import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export async function validateDTO<T extends object>(
  data: object,
  dataClass: new (...args: any[]) => T,
) {
  const dto = plainToInstance(dataClass, data);
  const errors = await validate(dto, {
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  return { errors, dto };
}
