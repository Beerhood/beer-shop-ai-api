import { ERROR_MESSAGES } from '@utils/errors/error-messages';
import { ENTITY_NAME } from './user.const';

export const USER_ERROR_MESSAGES = {
  NOT_FOUND: ERROR_MESSAGES.getNotFoundMessage(ENTITY_NAME),
} as const;
