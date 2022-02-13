import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ShellComponent } from './shell.component';

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
          import('@flare/ui/auth').then((m) => m.SocialLoginHandlerModule),
      },
      {
        path: '',
        component: ShellComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            loadChildren: () =>
              import('./pages/home/home.component').then((m) => m.HomeModule),
          },
          {
            path: 'bookmarks',
            loadChildren: () =>
              import('@flare/ui/bookmark').then((m) => m.UiBookmarkModule),
          },
          {
            path: 'profile',
            loadChildren: () =>
              import('@flare/ui/profile').then((m) => m.UiProfileModule),
          },
        ],
      },
    ]),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
