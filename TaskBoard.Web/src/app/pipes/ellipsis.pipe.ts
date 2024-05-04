import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ellipsis',
  standalone: true,
})
export class EllipsisPipe implements PipeTransform {
  transform(value: string, maxCharacters = 100): string {
    const ellipsis = '...';
    if (value.length <= maxCharacters) {
      return value;
    }

    return `${value.substring(0, maxCharacters - ellipsis.length).trimEnd()}${ellipsis}`;
  }
}
