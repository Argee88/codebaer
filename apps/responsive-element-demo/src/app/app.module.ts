import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxResponsiveElementModule } from '@codebaer/ngx-responsive-element';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NgxResponsiveElementModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
