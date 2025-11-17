import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

/**
 * Custom validation decorator that checks whether all values in an object
 * (recursively, including nested objects and arrays) are included in a specified list of allowed primitive values.
 *
 * @template T - Allowed primitive types (string | number | boolean)
 * @param {T[]} allowedList - Array of allowed values.
 * @param {ValidationOptions} [options] - Optional class-validator options.
 */
export function IsObjectValuesIn<T extends string | number | boolean>(
  allowedList: T[],
  options?: ValidationOptions,
) {
  return function (target: object, propertyName: string) {
    registerDecorator({
      name: 'isObjectValuesIn',
      target: target.constructor,
      propertyName,
      constraints: [allowedList],
      options,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          if (typeof value !== 'object' || value === null) return false;

          const list = args.constraints[0] as T[];

          return recursiveCheck(value, list);
        },
        defaultMessage() {
          return `$property must be an object with values in [$constraint1]`;
        },
      },
    });
  };
}

function recursiveCheck<T>(value: object, list: T[]): boolean {
  if (Array.isArray(value)) {
    return value.every((v: unknown) => {
      if (v && typeof v === 'object') return recursiveCheck(v, list);
      return list.includes(v as T);
    });
  }

  const keys = Object.keys(value);
  if (keys.length === 0) return false;

  let flag = true;
  for (const key of keys) {
    const v: unknown = value[key];
    if (v && typeof v === 'object') {
      if (Object.keys(v).length === 0) {
        flag = false;
        break;
      }
      if (!recursiveCheck(v, list)) {
        flag = false;
        break;
      }
      continue;
    }
    if (!list.includes(v as T)) {
      flag = false;
      break;
    }
  }
  return flag;
}
