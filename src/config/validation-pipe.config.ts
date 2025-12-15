import { BadRequestException, HttpStatus } from '@nestjs/common';
import { expandValidationError } from '@utils/errors/expand-validation-error';
import { ValidationError } from 'class-validator';

export const validationPipeConfig = {
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  exceptionFactory: (errors: ValidationError[]) => {
    throw new BadRequestException({
      error: 'Validation Error',
      statusCode: HttpStatus.BAD_REQUEST,
      details: errors.map(expandValidationError),
    });
  },
};
