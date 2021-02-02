import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SizeMap } from '../models/size-map.model';
import { NgxResponsiveElementDirective } from './ngx-responsive-element.directive';

@Component({
  template: `
    <div id="no-size-map" cbNgxResponsiveElement></div>
    <div
      id="size-map"
      cbNgxResponsiveElement
      [sizeMap]="{ '500': 'medium', '300': 'small', '700': 'large' }"
    ></div>
    <div
      id="size-map-and-default"
      cbNgxResponsiveElement
      defaultCssClass="test"
      [sizeMap]="{ '500': 'medium', '300': 'small', '700': 'large' }"
    ></div>
  `,
})
class DirectiveHostComponent {}

describe('NgxResponsiveElementDirective', () => {
  let fixture: ComponentFixture<DirectiveHostComponent>;
  let directive: NgxResponsiveElementDirective;
  let sizeMap: SizeMap = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DirectiveHostComponent, NgxResponsiveElementDirective],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DirectiveHostComponent);
      });
  });

  it('should create an instance', () => {
    expect(fixture).toBeTruthy();
  });

  describe('should be possible to define a default css class', () => {
    let dEs;
    let dE;
    beforeEach(() => {
      dEs = fixture.debugElement.queryAll(
        By.directive(NgxResponsiveElementDirective)
      );
      dE = dEs.filter(
        (tempDE) => tempDE.attributes.id === 'size-map-and-default'
      )[0];
      directive = dE.injector.get(NgxResponsiveElementDirective);
      directive.defaultCssClass = 'test';
    });
    it('should be possible to define a default css class', () => {
      expect(directive.defaultCssClass).toBe('test');
    });
  });

  describe('onResize', () => {
    let dE: DebugElement;
    let sizeMapValues: string[];
    beforeEach(() => {
      const dEs = fixture.debugElement.queryAll(
        By.directive(NgxResponsiveElementDirective)
      );
      dE = dEs.filter((tempDE) => tempDE.attributes.id === 'size-map')[0];
      directive = dE.injector.get(NgxResponsiveElementDirective);

      sizeMap = {
        500: 'medium',
        300: 'small',
        700: 'large',
      };

      directive.sizeMap = sizeMap;
      sizeMapValues = Object.values(sizeMap);

      Object.defineProperty(
        directive.hostElement.nativeElement,
        'clientWidth',
        {
          get: () => 330,
        }
      );
    });
    it('should run on directive init', () => {
      spyOn(directive, 'onResize');
      directive.ngOnInit();
      expect(directive.onResize).toHaveBeenCalled();
    });
    it('should run on window resize event', () => {
      const spyOnResize = spyOn(directive, 'onResize');
      dE.triggerEventHandler('window:resize', null);
      window.dispatchEvent(new Event('resize'));
      expect(spyOnResize).toHaveBeenCalled();
    });
    it('should update the oldCssClass to the newCssClass', () => {
      expect(directive.oldCssClass).toBeNull();
      directive.onResize();
      expect(
        sizeMapValues.indexOf(directive.oldCssClass as string)
      ).toBeGreaterThan(-1);
    });
    it('should remove the oldCssClass before adding the newCssClass', () => {
      expect(directive.oldCssClass).toBeNull();
      directive.oldCssClass = 'test';
      expect(directive.oldCssClass).toBe('test');
      directive.onResize();

      let numberOfFoundClasses = 0;
      for (const tempClassName of sizeMapValues) {
        if (dE.nativeElement.classList.contains(tempClassName)) {
          numberOfFoundClasses++;
        }
      }

      expect(numberOfFoundClasses).toEqual(1);
    });
    it('should not do anything when oldCssClass and newCssClass are the same', () => {
      expect(directive.oldCssClass).toBeNull();
      directive.onResize();
      directive.onResize();

      let numberOfFoundClasses = 0;
      for (const tempClassName of sizeMapValues) {
        if (dE.nativeElement.classList.contains(tempClassName)) {
          numberOfFoundClasses++;
        }
      }

      expect(numberOfFoundClasses).toEqual(1);
    });
    it('should not do anything when host element is gone', () => {
      // workaround for private property
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (directive as any).hostElement = null;

      directive.onResize();
      expect(directive.oldCssClass).toBeNull();
    });
  });

  describe('recalcClass', () => {
    describe('when no sizeMap is provided', () => {
      beforeEach(() => {
        const dEs = fixture.debugElement.queryAll(
          By.directive(NgxResponsiveElementDirective)
        );
        const dE = dEs.filter(
          (tempDE) => tempDE.attributes.id === 'no-size-map'
        )[0];
        directive = dE.injector.get(NgxResponsiveElementDirective);
      });
      it('sizeMap should be null', () => {
        expect(directive.sizeMap).toBeNull();
      });
      it('should return the default css class', () => {
        expect(directive.recalcClass(0)).toBe(directive.defaultCssClass);
      });
    });
    describe('when sizeMap is provided', () => {
      beforeEach(() => {
        const dEs = fixture.debugElement.queryAll(
          By.directive(NgxResponsiveElementDirective)
        );
        const dE = dEs.filter(
          (tempDE) => tempDE.attributes.id === 'size-map'
        )[0];
        directive = dE.injector.get(NgxResponsiveElementDirective);

        sizeMap = {
          500: 'medium',
          300: 'small',
          700: 'large',
        };
        directive.sizeMap = sizeMap;
      });
      it('sizeMap should be an object', () => {
        expect(typeof directive.sizeMap).toEqual('object');
      });
      it('should return default class, when given value is smaller than smallest sizeMap value', () => {
        expect(directive.recalcClass(100)).toBe(directive.defaultCssClass);
      });
      it('should return class name, that has the closest smaller width associated to it', () => {
        expect(directive.recalcClass(350)).toBe(sizeMap['300']);
        expect(directive.recalcClass(499)).toBe(sizeMap['300']);
        expect(directive.recalcClass(500)).toBe(sizeMap['500']);
        expect(directive.recalcClass(600)).toBe(sizeMap['500']);
        expect(directive.recalcClass(699)).toBe(sizeMap['500']);
        expect(directive.recalcClass(700)).toBe(sizeMap['700']);
        expect(directive.recalcClass(1000)).toBe(sizeMap['700']);
      });
    });
  });
});
