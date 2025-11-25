import { ERROR_MESSAGES } from '@utils/errors/error-messages';
import { ENTITY_NAME } from './user.const';
import { AUTH_ACCESS_DENIED_EXCEPTION } from 'src/auth/constants/auth.const';

export const USER_ERROR_MESSAGES = {
  NOT_FOUND: ERROR_MESSAGES.getNotFoundMessage(ENTITY_NAME),
  UNAUTHORIZED: AUTH_ACCESS_DENIED_EXCEPTION,
} as const;
