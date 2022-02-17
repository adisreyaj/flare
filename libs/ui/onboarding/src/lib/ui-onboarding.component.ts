import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'flare-onboarding',
  template: `
    <header
      class="mb-6 flex items-center justify-center gap-2 md:justify-start md:px-6"
    >
      <img src="assets/images/flare.svg" alt="Flare" class="h-8 w-8" />
      <p class="text-xl font-bold">Flare</p>
    </header>
    <main class="px-6">
      <router-outlet></router-outlet>
    </main>
    <footer class="flex items-center justify-between px-4">
      <p>Copyright 2022 - Flare</p>
      <p>All rights reserved</p>
    </footer>
  `,
  styles: [
    `
      :host {
        @apply mx-auto grid grid h-full h-screen max-w-screen-xl grid-cols-1;
        grid-template-rows: 100px 1fr 80px;
      }
    `,
  ],
})
export class UiOnboardingComponent {}

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: UiOnboardingComponent,
        children: [
          {
            path: '',
            redirectTo: 'profile',
          },
          {
            path: 'profile',
            loadChildren: () =>
              import('./ui-onboarding-profile.component').then(
                (m) => m.UiOnboardingProfileModule
              ),
          },
          {
            path: 'explore',
            loadChildren: () =>
              import('./ui-onboarding-explore.component').then(
                (m) => m.UiOnboardingExploreModule
              ),
          },
        ],
      },
    ]),
  ],
  declarations: [UiOnboardingComponent],
  exports: [UiOnboardingComponent],
})
export class UiOnboardingModule {}
