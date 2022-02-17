import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'flare-onboarding-explore',
  template: `Hello`,
})
export class UiOnboardingExploreComponent {}

@NgModule({
  declarations: [UiOnboardingExploreComponent],
  imports: [
    RouterModule.forChild([
      { path: '', component: UiOnboardingExploreComponent },
    ]),
  ],
  exports: [UiOnboardingExploreComponent],
})
export class UiOnboardingExploreModule {}
