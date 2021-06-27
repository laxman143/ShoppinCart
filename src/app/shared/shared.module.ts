import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgColorDirective } from './directives/ng-color.directive';



@NgModule({
  declarations: [
    NgColorDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [NgColorDirective]
})
export class SharedModule { }
