import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // This makes the module available everywhere without re-importing
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Exporting it so other modules can use it
})
export class PrismaModule {}
