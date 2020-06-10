import { NgModule } from '@angular/core';
import { RochautMaskNumberComponent } from './rochaut-mask-number.component';
import { RochautMaskNumberDirective } from './rochaut-mask-number.directive';



@NgModule({
  declarations: [
    RochautMaskNumberComponent,
    RochautMaskNumberDirective
  ],
  imports: [
  ],
  exports: [
    RochautMaskNumberComponent,
    RochautMaskNumberDirective
  ]
})
export class RochautMaskNumberModule { }
