import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

import { SizeMap } from '../models/size-map.model';

@Directive({
  selector: '[cbNgxResponsiveElement]',
})
export class NgxResponsiveElementDirective implements OnInit {
  @Input() sizeMap: SizeMap | null = null;
  @Input() defaultCssClass = 'default';
  oldCssClass: string | null = null;

  constructor(public hostElement: ElementRef) {}

  ngOnInit() {
    this.onResize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (this.hostElement && this.hostElement.nativeElement) {
      const newCssClass = this.recalcClass(
        this.hostElement.nativeElement.clientWidth
      );

      if (this.oldCssClass !== newCssClass) {
        if (this.oldCssClass !== '') {
          this.hostElement.nativeElement.classList.remove(this.oldCssClass);
        }
        this.hostElement.nativeElement.classList.add(newCssClass);
        this.oldCssClass = newCssClass;
      }
    }
  }

  recalcClass(elementSize: number): string {
    if (!this.sizeMap) {
      return this.defaultCssClass;
    }
    const orderedKeys = Object.keys(this.sizeMap);
    const numberOfEntries = orderedKeys.length;
    for (let index = 0; index < numberOfEntries; index++) {
      const minSize = +orderedKeys[index];
      if (index <= numberOfEntries - 2) {
        const maxSize = +orderedKeys[index + 1];
        if (elementSize >= minSize && elementSize < maxSize) {
          return this.sizeMap[minSize];
        }
      } else if (index === numberOfEntries - 1 && elementSize >= minSize) {
        return this.sizeMap[minSize];
      }
    }
    return this.defaultCssClass;
  }
}
