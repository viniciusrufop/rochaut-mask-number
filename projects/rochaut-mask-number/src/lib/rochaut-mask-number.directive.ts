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
  @Input() thousandSeparator: boolean;

  private numRegex: RegExp;
  private regex: RegExp;
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'F12', 'Delete', 'ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Control', 'Shift', 'Insert', 'Alt'];

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    this.numRegex = new RegExp('[0-9]');
    if (this.isNullOrUndefined(this.allowLess)) { this.allowLess = true; }
    if (this.isNullOrUndefined(this.comma)) { this.comma = true; }
    if (this.isNullOrUndefined(this.units)) { this.units = ''; }
    if (this.isNullOrUndefined(this.decimals)) { this.decimals = ''; }
    if (this.isNullOrUndefined(this.integer)) { this.integer = false; }
    if (this.isNullOrUndefined(this.thousandSeparator)) { this.thousandSeparator = false; }
  }

  @HostListener('paste', [ '$event' ])
  onPaste(event: KeyboardEvent) {
    setTimeout(() => {
      this.regex = new RegExp(this.getRegExp());

      let next: string = this.el.nativeElement.value;

      if ((next && !String(next).match(this.regex)) || (next.charAt(0) === '.' || next.charAt(0) === ',')) {
        this.el.nativeElement.value = '';
      } else if (this.thousandSeparator) {
        event.preventDefault();
        this.el.nativeElement.value = this.formatThousandSeparator(next);
      }
    }, 100);

  }

  @HostListener('keydown', [ '$event' ])
  onKeyDown(event: KeyboardEvent) {
    // Allow Backspace, tab, end, and home keys
    if ((this.specialKeys.indexOf(event.key) !== -1) || (event.key === 'v' && event.ctrlKey) || (event.key === 'c' && event.ctrlKey)) {
      if (this.clearThousandSeparator(event)) {
        event.preventDefault();
        this.el.nativeElement.value = this.formatThousandSeparator(this.el.nativeElement.value.slice(0, -1));
      }
      return;
    }

    this.regex = new RegExp(this.getRegExp());

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
    } else if (this.thousandSeparator && (event.target['selectionStart'] === event.target['selectionEnd'])) {
      event.preventDefault();
      this.el.nativeElement.value = next.includes(this.comma ? ',' : '.') ? next : this.formatThousandSeparator(next);
    }
  }

  @HostListener('blur')
  onBlur() {
    let valueArr = this.el.nativeElement.value.split((this.comma ? ',' : '.'));

    if (valueArr.length === 2) {
      while (valueArr[1].length < this.decimals) {
        valueArr[1] = valueArr[1] + '0';
      }

      this.el.nativeElement.value = valueArr.join((this.comma ? ',' : '.'));
    } else {
      if (valueArr[1] === '-') { this.el.nativeElement.value = ''; }
    }
  }

  private getRegExp(): string {
    // ? = 0-1 = Corresponde apenas a zero ou a uma ocorrência.
    // + = 1-n = Corresponde a ocorrências infinitas, mas nunca a zero.
    // * = 0-n = Corresponde zero, uma ou ocorrências infinitas.

    const reg1 = '^' + `${this.allowLess ? '-?' : ''}` + '([0-9]{0,' + this.units + '})' + `${this.integer ? '$' : '([\,\.]{0,1})$'}`;
    const reg2 = '^' + `${this.allowLess ? '-?' : ''}` + '([0-9]{0,' + this.units + '})([\,\.]{0,1})([0-9]{0,' + this.decimals + '})$';
    const reg3 = `^${this.allowLess ? '-?' : ''}(([0-9]{1,3})(\\${this.comma ? '.' : ','}?)){0,}((\\${this.comma ? ',' : '.'}?)([0-9]{0,2}))$`;

    if (this.thousandSeparator) {
      return reg3;
    } else if (this.el.nativeElement.value.indexOf('.') >= 0 || this.el.nativeElement.value.indexOf(',') >= 0 && !this.integer) {
      return reg2;
    } else {
      return reg1;
    }
  }

  private getSeparator(key: string): string {
    if (key === '.' && this.comma) {
      return ',';
    } else if (key === ',' && !this.comma) {
      return '.';
    }
    return key;
  }

  private isNullOrUndefined(value): boolean {
    return value === null || value === undefined;
  }

  private formatThousandSeparator(value): string {
    let decimais: string = '';

    let separator = this.comma ? ',' : '.';
    if (value.includes(separator)) {
      decimais = value.slice(value.indexOf(separator));
      value = value.substring(0,value.indexOf(separator))
    }

    let myArray = value.split('');

    let negativo = (myArray[0] === '-');

    myArray = value.replace(/[^0-9]/g, '').split('');

    const arrayLength: number = myArray.length;

    if (arrayLength > 3) {

      let qtdePontos: any = parseInt(String((arrayLength / 3)), 10);
      const resto = (arrayLength % 3);

      if ((qtdePontos > 1) && (resto === 0)) { qtdePontos--; }

      for (let i = 1; i < (qtdePontos + 1) ; i++) {

        const pos = arrayLength - (3 * i);
        const separator = (this.comma) ? '.' : ',';
        myArray.splice(pos, 0, separator);
      }
    }

    if (negativo) { myArray.splice(0, 0, '-'); }

    return myArray.join('') + decimais;
  }

  private clearThousandSeparator(event: KeyboardEvent): boolean {
    return event.key === 'Backspace'
      && this.thousandSeparator
      && (event.target['selectionStart'] === event.target['selectionEnd'])
      && ((this.comma && !this.el.nativeElement.value.includes(','))
        || (!this.comma && !this.el.nativeElement.value.includes('.')));
  }

}
