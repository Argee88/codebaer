import { combineLatest, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';

import {
    Directive, DoCheck, forwardRef, HostBinding, Inject, Input, OnDestroy, OnInit
} from '@angular/core';

import { Util } from '../classes/util.class';
import { ErrorOptions } from '../models/error-options';
import { FormErrorsDirective } from './form-errors.directive';

@Directive({
  selector: '[cbFormError]',
})
export class FormErrorDirective implements DoCheck, OnDestroy, OnInit {
  @Input()
  set setFormError(value: ErrorOptions) {
    this.errorNames = Util.errorOptionsToArray(value);
  }

  /**
   * The displayFormErrorWhen causes the element to be displayed
   * when the formControl's property given here evalutates to true
   */
  @Input()
  set displayFormErrorWhen(value: ErrorOptions) {
    this.rules = Util.errorOptionsToArray(value);
  }

  @HostBinding('hidden') public hidden = true;

  private errorNames: string[] = [];
  private rules: string[] = [];
  private readonly _states$ = new Subject<string[]>();
  private readonly onDestroy$ = new Subject();
  private states$!: Observable<string[]>;

  constructor(
    @Inject(forwardRef(() => FormErrorsDirective))
    private readonly formErrors: FormErrorsDirective
  ) {}

  ngDoCheck(): void {
    this._states$.next(
      this.rules.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (rule) => (this.formErrors.control as any)[rule]
      )
    );
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this._states$.complete();
  }
  ngOnInit(): void {
    this.states$ = this._states$.asObservable().pipe(distinctUntilChanged());

    const errors = this.formErrors.subject$.pipe(
      filter((obj) =>
        obj !== null ? this.errorNames.includes(obj.errorName) : false
      )
    );

    const states = this.states$.pipe(
      map((states) => this.rules.every((rule) => states.includes(rule)))
    );

    combineLatest([states, errors])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(([states, errors]) => {
        this.hidden = !(states && errors?.control.hasError(errors.errorName));
      });
  }
}
