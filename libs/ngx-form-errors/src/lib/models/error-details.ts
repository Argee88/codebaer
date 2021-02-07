import { AbstractControl } from '@angular/forms';

export interface ErrorDetails {
  control: AbstractControl;
  errorName: string;
}
