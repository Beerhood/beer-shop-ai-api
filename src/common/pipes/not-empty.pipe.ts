import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ERROR_MESSAGES } from '@utils/errors/error-messages';

@Injectable()
export class NotEmptyBodyPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata) {
    if (typeof value === 'object' && value !== null && Object.keys(value).length === 0) {
      throw new BadRequestException(ERROR_MESSAGES.getEmptyRequestMessage(metadata.type));
    }
    return value;
  }
}
