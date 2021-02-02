# NgxResponsiveElement

## Install

```
npm i -S @codebaer/ngx-responsive-element
```

## Include

Import the module via

```
import { NgxResponsiveElementModule } from '@codebaer/ngx-responsive-element';
```

and add NgxResponsiveElementModule to your module's imports

```javascript
@NgModule({
    imports: [..., NgxResponsiveElementModule],
})
export class YourModule {}
```

## Use directive

You can use the directive on any element you want.

### sizeMap

Define a sizeMap object. The key is the lowest pixel value of the element's
width and the value is the css class that should get applied.

Example:

```javascript
const sizeMap = { 300: 'small', 500: 'medium', 700: 'large' };
```

```html
<div cbNgxResponsiveElement [sizeMap]="sizeMap"></div>
```

From 300px element's width to 499px the class 'small' will be applied. From
500px element's width to 699px the class 'medium' will be applied. From 700px
element's width onwards the class 'large' will be applied.

For widths lower than 300px, the defaultCssClass will be applied.

### defaultCssClass

Define the css class your element should have when the element's size is smaller
than the smallest key in your sizeMap.

If you don't set the defaultCssClass, it defaults to 'default'.

Example:

```javascript
const defaultCssClass = 'test';
```

```html
<div cbNgxResponsiveElement [defaultCssClass]="defaultCssClass"></div>
```
