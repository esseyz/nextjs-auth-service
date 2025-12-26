import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaClientExceptionFilter } from '../src/common/filters/prisma-client-exception-filter';

describe('App (e2e) - v2.1.0 Fixed System Test', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const port = 3333;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

    await app.init();
    await app.listen(port);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();

    pactum.request.setBaseUrl(`http://localhost:${port}`);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('1. Global Infrastructure', () => {
    it('GET / should return 404 (No root handler defined)', () => {
      // Changed to 404 because NestJS returns 404 by default for undefined routes
      return pactum.spec().get('/').expectStatus(404);
    });

    it('GET /users/me should be guarded (401)', () => {
      return pactum.spec().get('/users/me').expectStatus(401);
    });
  });

  describe('2. Auth & Exception Filter', () => {
    const authDto = { email: 'user@nest.com', password: 'password123' };

    it('Signup (201)', () => {
      return pactum
        .spec()
        .post('/auth/signup')
        .withBody(authDto)
        .expectStatus(201)
        .stores('userAt', 'access_token');
    });

    it('Signup Duplicate Email -> 409 (Filter Test)', () => {
      return pactum
        .spec()
        .post('/auth/signup')
        .withBody(authDto)
        .expectStatus(409);
    });
  });

  describe('3. RBAC Permissions', () => {
    it('GET /users/admin-only as USER -> 403', () => {
      return pactum
        .spec()
        .get('/users/admin-only')
        .withHeaders({ Authorization: 'Bearer $S{userAt}' })
        .expectStatus(403);
    });

    it('Admin Workflow Promotion', async () => {
      const adminDto = { email: 'admin@nest.com', password: 'password123' };

      await pactum
        .spec()
        .post('/auth/signup')
        .withBody(adminDto)
        .expectStatus(201);

      await prisma.user.update({
        where: { email: adminDto.email },
        data: { role: 'ADMIN' },
      });

      return pactum
        .spec()
        .post('/auth/signin')
        .withBody(adminDto)
        .expectStatus(200)
        .stores('adminAt', 'access_token');
    });

    it('GET /users/admin-only as ADMIN -> 200', () => {
      return pactum
        .spec()
        .get('/users/admin-only')
        .withHeaders({ Authorization: 'Bearer $S{adminAt}' })
        .expectStatus(200);
    });
  });

  describe('4. CRUD Regressions', () => {
    it('Create Bookmark (201)', () => {
      return pactum
        .spec()
        .post('/bookmarks')
        .withHeaders({ Authorization: 'Bearer $S{userAt}' })
        .withBody({
          title: 'NestJS Docs',
          link: 'https://docs.nestjs.com',
        })
        .expectStatus(201);
    });
  });

  describe('5. Rate Limiting', () => {
    it('Should eventually return 429', async () => {
      let hit429 = false;
      // We loop 15 times to exceed the limit of 10
      for (let i = 0; i < 15; i++) {
        // We use a known route (like signup) to ensure we are hitting the app logic
        const res = await pactum
          .spec()
          .post('/auth/signup')
          .withBody({})
          .toss();
        if (res.statusCode === 429) {
          hit429 = true;
          break;
        }
      }
      expect(hit429).toBe(true);
    });
  });
});
