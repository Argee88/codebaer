import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormErrorsDirective } from './directives/form-errors.directive';
import { FormErrorDirective } from './directives/form-error.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [FormErrorsDirective, FormErrorDirective],
  exports: [FormErrorsDirective, FormErrorDirective],
})
export class NgxFormErrorsModule {}
