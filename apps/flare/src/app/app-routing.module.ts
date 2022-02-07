import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: 'login',
        loadChildren: () =>
          import('@flare/ui/auth').then((m) => m.LoginComponentModule),
      },
      {
        path: 'auth/callback',
        loadChildren: () =>
          import('@flare/ui/auth').then((m) => m.SocialLoginHandlerComponent),
      },
    ]),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
