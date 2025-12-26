import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    // If no specific field is requested (e.g., @GetUser()), return the whole user object
    if (!data) return request.user;

    // If a field is requested (e.g., @GetUser('id')), return that specific field
    // This will now work because AtStrategy returns { id: payload.sub, ... }
    return request.user?.[data];
  },
);
