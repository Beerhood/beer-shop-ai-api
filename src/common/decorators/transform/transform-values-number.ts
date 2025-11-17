import { Transform } from 'class-transformer';

/**
 * Class-transformer decorator that recursively converts all values
 * of a plain object (including nested objects and arrays) to numbers.
 *
 * Leaves primitives, null, undefined, and non-object values unchanged (not recursively).
 */
export function TransfromObjectValuesToNumber() {
  return Transform(({ value }: { value: unknown }) => {
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      Object.values(value).length !== 0
    ) {
      return recursiveTransform(value);
    }
    return value;
  });
}

function recursiveTransform(value: object): unknown {
  if (Array.isArray(value)) {
    return value.map<unknown>((v: unknown) => {
      if (v && typeof v === 'object') return recursiveTransform(v);
      return v;
    });
  }

  const keys = Object.keys(value);
  if (keys.length === 0) return value;

  const result: Record<string, unknown> = {};
  for (const key of keys) {
    const v: unknown = value[key];
    if (v && typeof v === 'object' && Object.keys(v).length !== 0) {
      result[key] = recursiveTransform(v);
      continue;
    }
    result[key] = Number(v);
  }
  return result;
}
