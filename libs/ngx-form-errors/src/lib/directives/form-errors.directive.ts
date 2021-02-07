import { BehaviorSubject } from 'rxjs';

import { AfterViewInit, Directive, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroupDirective } from '@angular/forms';

import { Util } from '../classes/util.class';
import { ErrorDetails } from '../models/error-details';
import { ErrorOptions } from '../models/error-options';

@Directive({
  selector: '[cbFormErrors]',
})
export class FormErrorsDirective
  implements AfterViewInit, OnChanges, OnDestroy, OnInit {
  @Input('cbFormErrors') public readonly controlName!: string;

  public subject$!: BehaviorSubject<ErrorDetails | null>;

  public control: AbstractControl | null = null;

  private isReady = false;

  get errors() {
    return this.isReady && this.control ? this.control.errors : null;
  }

  get hasErrors() {
    return !!this.errors;
  }

  constructor(private readonly form: FormGroupDirective) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.checkStatus();
      this.control?.statusChanges.subscribe({
        next: this.checkStatus.bind(this),
      });
    });
  }

  private checkStatus() {
    if (this.control) {
      const control = this.control;
      const errors = this.control.errors;

      this.isReady = true;

      if (!errors) {
        return;
      }

      Object.keys(errors).forEach((errorName) =>
        this.subject$.next({ control, errorName })
      );
    }
  }

  ngOnChanges(): void {
    this.control = this.form.control.get(this.controlName) as AbstractControl;
  }

  ngOnDestroy(): void {
    this.subject$.complete();
  }

  ngOnInit(): void {
    this.subject$ = new BehaviorSubject<ErrorDetails | null>(null);
  }

  getError(name: string) {
    return this.isReady && this.control ? this.control.getError(name) : null;
  }

  hasError(name: string, conditions: ErrorOptions): boolean {
    return this.checkPropState('invalid', name, conditions);
  }

  isValid(name: string, conditions: ErrorOptions): boolean {
    return this.checkPropState('valid', name, conditions);
  }

  private checkPropState(
    prop: string,
    name: string,
    conditions: ErrorOptions
  ): boolean {
    if (!this.isReady) {
      return false;
    }

    if (prop === 'valid') {
      return !this.control?.hasError(name);
    }

    const control = (this.control as unknown) as Record<string, boolean>;

    const controlPropsState =
      !conditions ||
      Util.errorOptionsToArray(conditions).every(
        (condition) => control[condition]
      );

    if (name.charAt(0) === '*') {
      return control[prop] && controlPropsState;
    }

    return (this.control as FormControl).hasError(name) && controlPropsState;
  }
}
