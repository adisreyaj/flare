import { Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  template: '',
})
export class SocialLoginHandlerComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}
  ngOnInit(): void {
    const query = this.route.snapshot.queryParams;
    if (query && query?.['code'] === 'SUCCESS') {
      localStorage.setItem('token', query['token']);
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
