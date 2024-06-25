import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[invalidField]',
  standalone: true
})
export class InvalidFieldDirective {
  constructor(private el: ElementRef, private control: NgControl) {}

  private applyInvalidClass() {
    const invalid = this.control.invalid && (this.control.dirty || this.control.touched);
    this.el.nativeElement.classList.toggle('p-invalid', invalid);
  }

  @HostListener('click') onClick() {
    this.applyInvalidClass();
  }

  @HostListener('blur') onBlur() {
    this.applyInvalidClass();
  }

  @HostListener('input') onInput() {
    this.applyInvalidClass();
  }
}
