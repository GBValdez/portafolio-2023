import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[appBtn]',
  standalone: true,
})
export class BtnDirective {
  @HostBinding('class')
  elementClass =
    'border-blue-950 hover:border-blue-800 border-4 py-2 px-3 rounded-full border-dashed font-black text-blue-950 hover:text-blue-800 ';
  constructor() {}
}
