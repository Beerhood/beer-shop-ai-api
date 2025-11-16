import { ValidationError } from 'class-validator';

export interface ValidationErrorDetails {
  property: string;
  messages?: string[];
  children?: ValidationErrorDetails[];
}

export function expandValidationError(e: ValidationError): ValidationErrorDetails {
  const errObj: ValidationErrorDetails = { property: e.property };

  if (e.constraints) errObj.messages = Object.values(e.constraints);
  if (e.children && e.children.length) {
    errObj.children = e.children.map(expandValidationError);
  }
  return errObj;
}
