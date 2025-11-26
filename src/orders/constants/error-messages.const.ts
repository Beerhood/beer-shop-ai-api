import { ERROR_MESSAGES } from '@utils/errors/error-messages';
import { AUTH_ACCESS_DENIED_EXCEPTION } from 'src/auth/constants/auth.const';
import { ORDER_NAME } from './orders.const';

export const ORDERS_ERROR_MESSAGES = {
  NOT_FOUND: ERROR_MESSAGES.getNotFoundMessage(ORDER_NAME),
  UNAUTHORIZED: AUTH_ACCESS_DENIED_EXCEPTION,
  TOTAL_PRICE_DISCREPANCY:
    'The provided expected total price does not match the actual calculated order total',
} as const;
