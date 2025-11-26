import { Transform } from 'class-transformer';

/**
 * Class-transformer decorator that converts a value to a number
 * only if it is defined. Undefined values are preserved, preventing NaN.
 */
export function TransformOptionalToNumber() {
  return Transform(({ value }: { value: unknown }) =>
    value === undefined ? value : Number(value),
  );
}
