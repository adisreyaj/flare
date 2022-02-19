import { Component } from '@angular/core';
import { AuthService } from '@flare/ui/auth';
import { take } from 'rxjs';

@Component({
  selector: 'flare-root',
  template: ` <router-outlet></router-outlet>`,
})
export class AppComponent {
  constructor(private authService: AuthService) {
    this.authService.init().pipe(take(1)).subscribe();
  }
}
