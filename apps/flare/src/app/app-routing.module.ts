import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ShellComponent } from './shell.component';
import { AlreadyOnboardedGuard, OnboardingGuard } from '@flare/ui/onboarding';
import { AlreadyLoggedInGuard, AuthGuard } from '@flare/ui/auth';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: 'login',
        canLoad: [AlreadyLoggedInGuard],
        loadChildren: () =>
          import('@flare/ui/auth').then((m) => m.LoginComponentModule),
      },
      {
        path: 'auth/callback',
        loadChildren: () =>
          import('@flare/ui/auth').then((m) => m.SocialLoginHandlerModule),
      },
      {
        path: 'onboarding',
        canLoad: [AuthGuard, AlreadyOnboardedGuard],
        loadChildren: () =>
          import('@flare/ui/onboarding').then((m) => m.UiOnboardingModule),
      },
      {
        path: '',
        component: ShellComponent,
        canActivate: [AuthGuard, OnboardingGuard],
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
            path: 'discover',
            loadChildren: () =>
              import('@flare/ui/discover').then((m) => m.DiscoverModule),
          },
          {
            path: ':username',
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
