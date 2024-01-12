import {
  AfterViewInit,
  ContentChild,
  ContentChildren,
  Directive,
  ElementRef,
  HostListener,
} from '@angular/core';

@Directive({
  selector: '[appGbInput]',
  standalone: true,
})
export class GbInputDirective implements AfterViewInit {
  @ContentChild('input') input!: ElementRef;
  @ContentChild('label') label!: ElementRef;
  originalLabel!: string;
  originalInput!: string;
  isFocused: boolean = false;
  mouseHover: boolean = false;
  constructor(private elementRef: ElementRef) {}

  get inputElement(): HTMLInputElement | HTMLTextAreaElement {
    return this.input.nativeElement;
  }
  get labelElement(): HTMLLabelElement {
    return this.label.nativeElement;
  }

  @HostListener('click', ['$event'])
  click(event: MouseEvent) {
    this.inputElement.focus();
  }

  @HostListener('mouseenter', ['$event'])
  mouseEnter(event: MouseEvent) {
    this.mouseHover = true;
    if (!this.isFocused) {
      this.labelElement.className =
        'cursor-pointer font-bold text-lg text-blue-800';
      this.inputElement.className =
        'text-blue-800 bg-transparent w-full h-full m-0 p-3 font-bold focus:outline-none border-blue-800 border-4 rounded-[10px] border-dashed focus:border-blue-600 focus:text-blue-600';
    }
  }

  @HostListener('mouseleave', ['$event'])
  mouseExit(event: MouseEvent) {
    this.mouseHover = false;
    if (!this.isFocused) {
      this.labelElement.className = this.originalLabel;
      this.inputElement.className = this.originalInput;
    }
  }

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.className += 'cursor-pointer ';
    this.originalInput =
      'text-blue-950 bg-transparent w-full h-full m-0 p-3 font-bold focus:outline-none border-blue-950 border-4 rounded-[10px] border-dashed focus:border-blue-600 focus:text-blue-600';
    this.originalLabel = 'cursor-pointer font-bold text-lg text-blue-950';
    this.labelElement.className = this.originalLabel;
    this.inputElement.className = this.originalInput;
    this.inputElement.addEventListener('focus', () => {
      this.labelElement.className =
        'cursor-pointer font-bold text-lg text-blue-600';
      this.isFocused = true;
    });
    this.inputElement.addEventListener('blur', () => {
      this.labelElement.className =
        'cursor-pointer font-bold text-lg text-blue-950';
      this.isFocused = false;
      if (!this.mouseHover) this.inputElement.className = this.originalInput;
    });
  }
}
