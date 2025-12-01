import { MaxDate, ValidationOptions } from 'class-validator';

export function IsDateNotInFuture(options?: ValidationOptions) {
  return MaxDate(() => new Date(), options);
}
