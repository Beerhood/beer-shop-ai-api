// Does not process nested objects
export function createFilter(criteria: Record<string, unknown>, path: string) {
  const min = 'min';
  const max = 'max';

  const filter: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(criteria)) {
    if (typeof value === 'number') {
      if (key.startsWith(min)) {
        const newKey = getKeyWithoutPrefix(key, min);
        filter[`${path}.${newKey}`] = {
          ...(filter[newKey] as Record<string, unknown>),
          $gte: value,
        };
      } else if (key.startsWith(max)) {
        const newKey = getKeyWithoutPrefix(key, max);
        filter[`${path}.${newKey}`] = {
          ...(filter[newKey] as Record<string, unknown>),
          $lte: value,
        };
      } else filter[`${path}.${key}`] = value;
    } else if (Array.isArray(value)) {
      filter[`${path}.${key}`] = { $in: value };
    } else filter[`${path}.${key}`] = value;
  }

  return filter;
}

function getKeyWithoutPrefix(key: string, prefix: string) {
  const rawKey = key.replace(prefix, '');
  if (rawKey.toUpperCase() === rawKey && rawKey.length > 1) return rawKey;
  return rawKey.charAt(0).toLowerCase() + rawKey.slice(1);
}
