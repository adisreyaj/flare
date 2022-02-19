import { Component, NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule, FormInputModule } from 'zigzag';
import {
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '@flare/ui/auth';
import { UpdateUserInput } from '@flare/api-interfaces';
import { UiOnboardingService } from './services/ui-onboarding.service';
import { map } from 'rxjs';

@Component({
  selector: 'flare-ui-onboarding-profile',
  template: `
    <header>
      <h1 class="text-center text-2xl font-semibold">Complete your profile!</h1>
    </header>
    <div class="grid place-items-center pt-10">
      <form
        class="grid w-full max-w-lg grid-cols-1 gap-8"
        [formGroup]="profileForm"
      >
        <section *ngIf="step === 0">
          <div class="grid w-full place-items-center">
            <img
              src="/assets/images/unicorn.svg"
              class="h-24 w-24"
              alt="Unicorn image"
            />
            <p class="mt-4 text-lg font-medium text-slate-500">
              Tell us more about yourself!
            </p>
            <p class="text-sm text-slate-500">
              Complete your profile to start exploring flare!
            </p>
          </div>
          <div class="flex flex-col">
            <label
              class="mb-1 text-sm font-medium text-slate-500"
              for="username"
              >Username</label
            >
            <input
              type="text"
              placeholder="Choose a unique username"
              variant="fill"
              zzInput
              id="username"
              formControlName="username"
            />
          </div>
          <div class="mt-10 mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="flex flex-col">
              <label
                class="mb-1 text-sm font-medium text-slate-500"
                for="firstName"
                >First Name</label
              >
              <input
                type="text"
                placeholder="Maicy"
                variant="fill"
                zzInput
                id="firstName"
                formControlName="firstName"
              />
            </div>
            <div class="flex flex-col">
              <label
                class="mb-1 text-sm font-medium text-slate-500"
                for="lastName"
                >Last Name</label
              >
              <input
                type="text"
                placeholder="Williams"
                variant="fill"
                zzInput
                id="lastName"
                formControlName="lastName"
              />
            </div>
          </div>
          <div class="mb-4 flex flex-col">
            <label class="mb-1 text-sm font-medium text-slate-500" for="email"
              >Email</label
            >
            <input
              type="text"
              variant="fill"
              placeholder="maicy@adi.so"
              zzInput
              formControlName="email"
              id="email"
            />
          </div>
          <section>
            <div>
              <div class="mb-4 flex flex-col">
                <label
                  class="mb-2 text-sm font-medium text-slate-500"
                  for="description"
                  >Impressum</label
                >
                <textarea
                  class="rounded-md border border-slate-200 bg-slate-100 p-2"
                  name="kudos"
                  id="description"
                  formControlName="description"
                  placeholder="Who are you?"
                  rows="3"
                ></textarea>
              </div>
            </div>
          </section>
        </section>
        <section *ngIf="step === 1" formGroupName="bio">
          <div class="grid w-full place-items-center">
            <img
              src="/assets/images/rocket.svg"
              class="h-24 w-24"
              alt="Rocket image"
            />
            <p class="mt-4 text-lg font-medium text-slate-500">
              Show us what you've got!
            </p>
            <p class="text-sm text-slate-500">
              Let others discover you on other platforms.
            </p>
          </div>
          <div class="mb-4 flex flex-col">
            <label class="mb-1 text-sm font-medium text-slate-500" for="github"
              >Github</label
            >
            <input
              type="text"
              placeholder="https://github.com/adisreyaj"
              variant="fill"
              zzInput
              id="github"
              formControlName="github"
            />
          </div>
          <div class="mb-4 flex flex-col">
            <label class="mb-1 text-sm font-medium text-slate-500" for="twitter"
              >Twitter</label
            >
            <input
              type="text"
              placeholder="https://twitter.com/adisreyaj"
              variant="fill"
              zzInput
              id="twitter"
              formControlName="twitter"
            />
          </div>
          <div class="mb-4 flex flex-col">
            <label class="mb-1 text-sm font-medium text-slate-500" for="title"
              >LinkedIn</label
            >
            <input
              type="text"
              placeholder="https://linkedin.com/in/adisreyaj"
              variant="fill"
              zzInput
              id="title"
              formControlName="linkedin"
            />
          </div>
          <div class="mb-4 flex flex-col">
            <label
              class="mb-1 text-sm font-medium text-slate-500"
              for="hashnode"
              >Hashnode</label
            >
            <input
              type="text"
              placeholder="https://hasnode.com/@adisreyaj"
              variant="fill"
              zzInput
              id="hashnode"
              formControlName="hashnode"
            />
          </div>
          <div class="mb-4 flex flex-col">
            <label class="mb-1 text-sm font-medium text-slate-500" for="devto"
              >Dev.to</label
            >
            <input
              placeholder="https://dev.to/adisreyaj"
              type="text"
              variant="fill"
              zzInput
              id="devto"
              formControlName="devto"
            />
          </div>
        </section>
      </form>
      <footer class="flex items-center gap-4 pt-4">
        <button zzButton [disabled]="step === 0" (click)="prev()">Prev</button>
        <ng-container *ngIf="step < maxStep">
          <button
            zzButton
            [variant]="step !== 1 ? 'primary' : 'neutral'"
            (click)="next()"
          >
            Next
          </button>
        </ng-container>
        <ng-container *ngIf="step === 1">
          <button
            zzButton
            variant="primary"
            [disabled]="profileForm.invalid"
            (click)="completeProfile()"
          >
            Save Profile
          </button>
        </ng-container>
      </footer>
    </div>
  `,
})
export class UiOnboardingProfileComponent {
  step = 0;
  maxStep = 1;

  profileForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly onboardingService: UiOnboardingService,
    private readonly router: Router
  ) {
    this.profileForm = this.fb.group(
      {
        username: ['', Validators.required, this.usernameValidator],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', Validators.required],
        description: [''],
        bio: this.fb.group({
          id: ['', Validators.required],
          github: ['', this.socialLinkValidator('github.com')],
          twitter: ['', this.socialLinkValidator('twitter.com')],
          linkedin: ['', this.socialLinkValidator('linkedin.com')],
          facebook: ['', this.socialLinkValidator('facebook.com')],
          hashnode: ['', this.socialLinkValidator('hashnode.com')],
          devto: ['', this.socialLinkValidator('dev.to')],
        }),
      },
      {
        updateOn: 'blur',
      }
    );
    this.profileForm.get('email')?.disable();
    this.authService.me().subscribe((user) => {
      if (user.onboardingState.state === 'SETUP_PROFILE') {
        this.router.navigate(['/onboarding/explore']);
      }
      this.profileForm.patchValue(user);
    });
  }

  next() {
    if (this.step < this.maxStep) {
      this.step++;
    }
  }

  prev() {
    if (this.step > 0) {
      this.step--;
    }
  }

  completeProfile() {
    this.onboardingService
      .completeProfile(this.getProfileFormValue())
      .subscribe(() => {
        this.router.navigate(['/onboarding/explore']);
      });
  }

  private socialLinkValidator =
    (domain: string): ValidatorFn =>
    (control) => {
      if (control.touched && control.dirty && control.value.trim() !== '') {
        const isValid = control.value.startsWith(`https://${domain}`);
        return isValid ? null : { link: 'Please enter a valid URL' };
      }
      return null;
    };

  private getProfileFormValue() {
    const data: UpdateUserInput = {
      bio: {
        ...this.profileForm.get('bio')?.value,
        description: this.profileForm.get('description')?.value,
      },
      firstName: this.profileForm.get('firstName')?.value,
      lastName: this.profileForm.get('lastName')?.value,
    };

    return data;
  }

  private usernameValidator: AsyncValidatorFn = (control) => {
    return this.onboardingService.checkUsernameAvailability(control.value).pipe(
      map((isAvailable) => {
        return isAvailable ? null : { usernameTaken: true };
      })
    );
  };
}

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: UiOnboardingProfileComponent },
    ]),
    FormInputModule,
    ReactiveFormsModule,
    ButtonModule,
    CommonModule,
  ],
  declarations: [UiOnboardingProfileComponent],
  exports: [UiOnboardingProfileComponent],
})
export class UiOnboardingProfileModule {}
