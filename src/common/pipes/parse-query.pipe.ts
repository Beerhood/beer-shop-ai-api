import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
  Query,
} from '@nestjs/common';

interface Query {
  limit?: any;
  skip?: any;
  filter?: any;
  sort?: any;
  search?: any;
}

/**
 * Pipe that parses HTTP query parameters.
 * Supports parsing JSON-like strings for `filter`, `sort`, and `search`,
 * converting `search` values to regular expressions, and merging processed
 * query fields back into the original query object.
 *
 * Only applies to parameters of type `"query"`.
 */
@Injectable()
export class ParseQueryPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata) {
    if (metadata.type !== 'query' || typeof value !== 'object' || !value) return value;

    if (!metadata.data) {
      const query: Query = {};

      if ('limit' in value) query.limit = value.limit;
      if ('skip' in value) query.skip = value.skip;

      if ('filter' in value) {
        query.filter = this.parseObjectPart(value, 'filter');
      }

      if ('sort' in value) {
        query.sort = this.parseObjectPart(value, 'sort');
      }

      if ('search' in value) {
        const search = this.parseObjectPart(value, 'search');
        if (typeof search === 'object') query.search = this.toRegex(search);
      }
      return { ...value, ...query };
    }

    return value;
  }

  private toRegex(value: unknown) {
    if (typeof value === 'string') return new RegExp(value, 'i');
    if (
      typeof value === 'object' &&
      value !== null &&
      !(value instanceof RegExp) &&
      !Array.isArray(value)
    ) {
      const obj: Record<string, any> = {};
      for (const key in value) {
        obj[key] = this.toRegex(value[key]);
      }
      return obj;
    }
    return value;
  }

  private parseObjectPart<T>(value: object & T, name: string) {
    if (typeof value[name] === 'string') {
      return this.parseObject(value[name], name);
    }
    return value[name] as unknown;
  }

  private parseObject(value: string, name: string) {
    const trimmed = value.trim();
    const regex = /^\{[\s\S]*\}$/;
    if (regex.test(trimmed)) {
      try {
        return JSON.parse(trimmed) as object;
      } catch (_) {
        throw new BadRequestException(`Invalid ${name} JSON`);
      }
    }
    return value;
  }
}
