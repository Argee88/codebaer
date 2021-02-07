import { ErrorOptions } from '../models/error-options';

export class Util {
  static errorOptionsToArray(value: ErrorOptions): string[] {
    return Array.isArray(value) ? value : [value];
  }
}
