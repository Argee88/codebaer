import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxResponsiveElementDirective } from './directives/ngx-responsive-element.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [NgxResponsiveElementDirective],
  exports: [NgxResponsiveElementDirective],
})
export class NgxResponsiveElementModule {}
