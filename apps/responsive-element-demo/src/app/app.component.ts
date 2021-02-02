import { Component } from '@angular/core';

@Component({
  selector: 'codebaer-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  sizeMap = { 500: 'medium', 300: 'small', 700: 'large' };
  defaultCssClass = 'test';
}
