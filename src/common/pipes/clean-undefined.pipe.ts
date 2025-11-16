import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class CleanUndefinedPipe implements PipeTransform {
  transform(value: unknown, _metadata: ArgumentMetadata) {
    if (typeof value === 'object') return instanceToPlain(value, { exposeUnsetFields: false });
    return value;
  }
}
