import {
  Directive,
  HostBinding,
  HostListener,
  Input,
  NgModule,
} from '@angular/core';
import { Nullable } from 'ts-toolbelt/out/Union/Nullable';

@Directive({
  selector: '[flareDefaultImage]',
})
export class ProfileImageDefaultDirective {
  @Input()
  @HostBinding('src')
  src!: string | undefined | null;

  @Input('flareDefaultImage')
  username!: Nullable<string>;

  @HostListener('error')
  onError() {
    this.src = `https://avatar.tobi.sh/${this.username ?? ''}`;
  }
}

@NgModule({
  declarations: [ProfileImageDefaultDirective],
  exports: [ProfileImageDefaultDirective],
})
export class ProfileImageDefaultDirectiveModal {}
