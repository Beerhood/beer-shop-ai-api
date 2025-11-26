import { Transform } from 'class-transformer';

export function Trim() {
  return Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  );
}

export function TrimArrayElements() {
  return Transform(({ value }: { value: unknown }) =>
    Array.isArray(value)
      ? value.map((v: unknown) => (typeof v === 'string' ? v.trim() : v))
      : value,
  );
}
