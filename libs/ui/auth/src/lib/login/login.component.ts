import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule, FormInputModule } from 'zigzag';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
    //language=SCSS
    `
      :host {
        display: block;
      }
      .separator {
        @apply text-center border-b border-slate-300;
        height: 12px;
      }
      .separator:first-line {
        background-color: white;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {}

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: LoginComponent }]),
    FormInputModule,
    ButtonModule,
  ],
  declarations: [LoginComponent],
  exports: [LoginComponent],
})
export class LoginComponentModule {}
