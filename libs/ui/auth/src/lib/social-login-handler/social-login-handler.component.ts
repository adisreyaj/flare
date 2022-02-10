import { Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  template: '',
})
export class SocialLoginHandlerComponent implements OnInit {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}
  ngOnInit(): void {
    const query = this.route.snapshot.queryParams;
    if (query && query?.['code'] === 'SUCCESS') {
      localStorage.setItem('token', query['token']);
      this.authService.me();
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}

@NgModule({
  declarations: [SocialLoginHandlerComponent],
  imports: [
    RouterModule.forChild([
      { path: '', component: SocialLoginHandlerComponent },
    ]),
  ],
  exports: [SocialLoginHandlerComponent],
})
export class SocialLoginHandlerModule {}
