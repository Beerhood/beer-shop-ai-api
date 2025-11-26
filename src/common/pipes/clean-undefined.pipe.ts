import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

/**
 * Pipe that recursively removes all properties with `undefined` values
 * from objects. Empty objects are preserved.
 */
@Injectable()
export class CleanUndefinedPipe implements PipeTransform {
  transform(value: unknown, _metadata: ArgumentMetadata) {
    if (value === null || typeof value !== 'object') return value;

    return this.clean(value);
  }

  private clean(value: object): unknown {
    if (Array.isArray(value)) {
      return value.map<unknown>((v: unknown) => {
        if (v && typeof v === 'object') return this.clean(v);
        return v;
      });
    }

    const keys = Object.keys(value);
    if (keys.length === 0) return value;

    const cleaned: Record<string, unknown> = {};
    for (const key of keys) {
      const v: unknown = value[key];
      if (v === undefined) continue;
      if (v && typeof v === 'object' && Object.keys(v).length !== 0) {
        cleaned[key] = this.clean(v);
        continue;
      }
      cleaned[key] = v;
    }
    return cleaned;
  }
}
