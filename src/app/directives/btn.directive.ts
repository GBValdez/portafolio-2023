import { Directive, HostBinding, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appBtn]',
  standalone: true,
})
export class BtnDirective implements OnInit {
  @Input() white = false;
  @HostBinding('class')
  elementClass = '';
  constructor() {}
  ngOnInit(): void {
    const basic = 'border-4 py-2 px-3 rounded-full border-dashed font-black';
    this.elementClass = basic;
    if (this.white) {
      this.elementClass +=
        ' border-white text-white hover:border-gray-400 hover:text-gray-400';
    } else {
      this.elementClass +=
        ' border-blue-950 hover:border-blue-800  text-blue-950 hover:text-blue-800 ';
    }
  }
}
