import { ConflictException } from '@nestjs/common';
import { CallbackWithoutResult, Document } from 'mongoose';
import { MongoServerError } from 'mongodb';
import { ERROR_MESSAGES } from '@utils/errors/error-messages';

export function getHandleDuplicateKeyError<T>(entityName: string, prop: string) {
  return function handleDuplicateKeyError(
    error: Error,
    _doc: Document<T> | null,
    next: CallbackWithoutResult,
  ) {
    if (error instanceof MongoServerError && error.code === 11000) {
      next(new ConflictException(ERROR_MESSAGES.getUniqueConstraintMessage(entityName, prop)));
    } else {
      next(error);
    }
  };
}
