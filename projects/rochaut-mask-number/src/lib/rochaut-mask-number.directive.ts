import {
  Directive,
  HostListener,
  ElementRef,
  Input,
  OnInit,
} from '@angular/core';

@Directive({
  selector: '[rochautMask]',
})
export class RochautMaskNumberDirective implements OnInit {
  @Input() decimals: string;
  @Input() units: string;
  @Input() allowLess: boolean;
  @Input() comma: boolean;
  @Input() integer: boolean;

  private numRegex: RegExp;
  private regex: RegExp;
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'F12', 'Delete', 'ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Control', 'Shift', 'Insert', 'Alt'];

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    this.numRegex = new RegExp("[0-9]");
    if (this.isNullOrUndefined(this.allowLess)) { this.allowLess = true; }
    if (this.isNullOrUndefined(this.comma)) { this.comma = true; }
    if (this.isNullOrUndefined(this.units)) { this.units = ''; }
    if (this.isNullOrUndefined(this.decimals)) { this.decimals = ''; }
    if (this.isNullOrUndefined(this.integer)) { this.integer = false; }
  }

  @HostListener('paste', [ '$event' ])
  onPaste(event: KeyboardEvent) {
    setTimeout(() => {
      const reg1 = "^" + `${this.allowLess ? '-?' : ''}` + "([0-9]{0," + this.units + "})" + `${this.integer ? '$' : '([\,\.]{0,1})$'}`;
      const reg2 = "^" + `${this.allowLess ? '-?' : ''}` + "([0-9]{0," + this.units + "})([\,\.]{0,1})([0-9]{0," + this.decimals + "})$";

      if (this.el.nativeElement.value.indexOf('.') >= 0 || this.el.nativeElement.value.indexOf(',') >= 0 && !this.integer) {
        this.regex = new RegExp(reg2);
      } else {
        this.regex = new RegExp(reg1);
      }

      let next: string = this.el.nativeElement.value;

      if ((next && !String(next).match(this.regex)) || (next.charAt(0) === '.' || next.charAt(0) === ',')) {
        this.el.nativeElement.value = '';
      }
    }, 100);

  }

  @HostListener('keydown', [ '$event' ])
  onKeyDown(event: KeyboardEvent) {
    // Allow Backspace, tab, end, and home keys
    if ((this.specialKeys.indexOf(event.key) !== -1) || (event.key === 'v' && event.ctrlKey) || (event.key === 'c' && event.ctrlKey)) {
      return;
    }

    const reg1 = "^" + `${this.allowLess ? '-?' : ''}` + "([0-9]{0," + this.units + "})" + `${this.integer ? '$' : '([\,\.]{0,1})$'}`;
    const reg2 = "^" + `${this.allowLess ? '-?' : ''}` + "([0-9]{0," + this.units + "})([\,\.]{0,1})([0-9]{0," + this.decimals + "})$";

    if (this.el.nativeElement.value.indexOf('.') >= 0 || this.el.nativeElement.value.indexOf(',') >= 0 && !this.integer) {
      this.regex = new RegExp(reg2);
    } else {
      this.regex = new RegExp(reg1);
    }

    let value: string = (event.key === ',' || event.key === '.') ? this.getSeparator(event.key) : event.key;
    let current: string = this.el.nativeElement.value;
    let next: string = current.concat(value);

    if (event.key === 'Unidentified') {
      setTimeout(() => this.el.nativeElement.value = this.el.nativeElement.value.slice(0, -1), 100);
    } else if ((next && !String(next).match(this.regex)) && (event.target['selectionStart'] === event.target['selectionEnd']))  {
      event.preventDefault();
    } else if (!String(event.key).match(this.numRegex) && (event.target['selectionStart'] !== event.target['selectionEnd']))  {
      event.preventDefault();
      this.el.nativeElement.value = '';
    } else if ((event.key === ',' || event.key === '.') && current.length === 0) {
      event.preventDefault();
    } else if (event.key === ',' || event.key === '.') {
      event.preventDefault();
      this.el.nativeElement.value = next;
    }
  }

  @HostListener('blur')
  onBlur() {
    let valueArr = this.el.nativeElement.value.split((this.comma ? ',' : '.'));

    if (valueArr.length == 2) {
      while (valueArr[1].length < this.decimals) {
        valueArr[1] = valueArr[1] + "0";
      }

      this.el.nativeElement.value = valueArr.join((this.comma ? ',' : '.'));
    } else {
      if (valueArr[1] === "-")
        this.el.nativeElement.value = "";
    }
  }

  private getSeparator(key: string): string {
    if (key === '.' && this.comma) {
      return ','
    } else if (key === ',' && !this.comma) {
      return '.'
    }
    return key;
  }

  private isNullOrUndefined(value): boolean {
    return value === null || value === undefined;
  }
}
