import { Component, NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  ButtonModule,
  FormGroupLabelModule,
  FormGroupModule,
  FormInputModule,
  FormModule,
} from 'zigzag';
import {
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '@flare/ui/auth';
import { UpdateUserInput } from '@flare/api-interfaces';
import { UiOnboardingService } from './services/ui-onboarding.service';
import { catchError, map, Observable, of, take } from 'rxjs';

@Component({
  selector: 'flare-ui-onboarding-profile',
  template: `
    <header>
      <h1 class="text-center text-2xl font-semibold">Complete your profile!</h1>
    </header>
    <div class="grid place-items-center pt-10">
      <zz-form
        id="profileForm"
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
          <zz-form-group id="username" class="flex flex-col">
            <zz-form-group-label required>Username</zz-form-group-label>
            <input
              type="text"
              placeholder="Choose a unique username"
              variant="fill"
              zzInput
              id="username"
              formControlName="username"
            />
          </zz-form-group>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <zz-form-group id="firstName" class="flex flex-col">
              <zz-form-group-label required>First Name</zz-form-group-label>
              <input
                type="text"
                placeholder="Maicy"
                variant="fill"
                zzInput
                id="firstName"
                formControlName="firstName"
              />
            </zz-form-group>
            <zz-form-group id="lastName" class="flex flex-col">
              <zz-form-group-label required>Last Name</zz-form-group-label>
              <input
                type="text"
                placeholder="Williams"
                variant="fill"
                zzInput
                id="lastName"
                formControlName="lastName"
              />
            </zz-form-group>
          </div>
          <zz-form-group id="email" class="flex flex-col">
            <zz-form-group-label required>Email</zz-form-group-label>
            <input
              type="text"
              variant="fill"
              placeholder="maicy@adi.so"
              zzInput
              formControlName="email"
              id="email"
            />
          </zz-form-group>
          <section>
            <zz-form-group id="description" class="flex flex-col">
              <zz-form-group-label required>Description</zz-form-group-label>
              <textarea
                class="rounded-md border border-slate-200 bg-slate-100 p-2"
                name="kudos"
                id="description"
                formControlName="description"
                placeholder="Show off about what you do or love!"
                rows="3"
                variant="fill"
                zzInput
                required
              ></textarea>
            </zz-form-group>
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
          <zz-form-group id="github" class="flex flex-col">
            <zz-form-group-label>Github</zz-form-group-label>
            <input
              type="text"
              placeholder="https://github.com/adisreyaj"
              variant="fill"
              zzInput
              id="github"
              formControlName="github"
            />
          </zz-form-group>
          <zz-form-group id="twitter" class="flex flex-col">
            <zz-form-group-label>Twitter</zz-form-group-label>
            <input
              type="text"
              placeholder="https://twitter.com/adisreyaj"
              variant="fill"
              zzInput
              id="twitter"
              formControlName="twitter"
            />
          </zz-form-group>
          <zz-form-group id="facebook" class="flex flex-col">
            <zz-form-group-label>Facebook</zz-form-group-label>
            <input
              type="text"
              placeholder="https://facebook.com/adisreyaj"
              variant="fill"
              zzInput
              id="facebook"
              formControlName="facebook"
            />
          </zz-form-group>
          <zz-form-group id="linkedin" class="flex flex-col">
            <zz-form-group-label>LinkedIn</zz-form-group-label>
            <input
              type="text"
              placeholder="https://linkedin.com/in/adisreyaj"
              variant="fill"
              zzInput
              id="title"
              formControlName="linkedin"
            />
          </zz-form-group>
          <zz-form-group id="hasnode" class="flex flex-col">
            <zz-form-group-label>Hashnode</zz-form-group-label>
            <input
              type="text"
              placeholder="https://hasnode.com/@adisreyaj"
              variant="fill"
              zzInput
              id="hashnode"
              formControlName="hashnode"
            />
          </zz-form-group>
          <zz-form-group id="devto" class="flex flex-col">
            <zz-form-group-label>Dev.to</zz-form-group-label>
            <input
              placeholder="https://dev.to/adisreyaj"
              type="text"
              variant="fill"
              zzInput
              id="devto"
              formControlName="devto"
            />
          </zz-form-group>
        </section>
      </zz-form>
      <footer class="flex items-center gap-4 pt-4">
        <button zzButton [disabled]="step === 0" (click)="prev()">Prev</button>
        <ng-container *ngIf="step < maxStep">
          <button
            zzButton
            [attr.data-invalid]="profileForm.invalid"
            [disabled]="step === 0 && profileForm.invalid"
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
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
            Validators.pattern(/^[a-zA-Z0-9]{1,}.[a-zA-Z0-9_]+$/),
          ],
          [this.usernameValidator()],
        ],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', Validators.required],
        description: [
          '',
          [
            Validators.required,
            Validators.maxLength(256),
            Validators.minLength(3),
          ],
        ],
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
      this.profileForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        bio: {
          id: user?.bio?.id,
        },
      });
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
      if (control.dirty && control.value.trim() !== '') {
        const isValid = control.value.startsWith(`https://${domain}`);
        return isValid ? null : { link: 'Please enter a valid URL' };
      }
      return null;
    };

  private getProfileFormValue() {
    if ((this.profileForm.get('username')?.value ?? '').trim() === '') {
      this.profileForm.get('username')?.setErrors({ required: true });
    }
    const data: UpdateUserInput = {
      bio: {
        ...this.profileForm.get('bio')?.value,
        description: this.profileForm.get('description')?.value,
      },
      firstName: this.profileForm.get('firstName')?.value,
      lastName: this.profileForm.get('lastName')?.value,
      username: this.profileForm.get('username')?.value,
    };

    return data;
  }

  private usernameValidator =
    (): AsyncValidatorFn =>
    (control): Observable<ValidationErrors | null> => {
      return this.onboardingService
        .checkUsernameAvailability(control.value)
        .pipe(
          map((isAvailable) => {
            if (control.touched && control.dirty) {
              return isAvailable ? null : { usernameTaken: true };
            }
            return null;
          }),
          take(1),
          catchError(() => of(null))
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
    FormGroupModule.configure({
      profileForm: {
        username: {
          required: 'Username is required',
          usernameTaken: 'Username is taken',
          minlength: 'Username must be at least 3 characters',
          maxlength: 'Max length is 20 characters',
          pattern: 'Username can only contain alphabets, numbers & underscores',
        },
        firstName: {
          required: 'First name is required',
        },
        lastName: {
          required: 'Last name is required',
        },
        description: {
          required: 'Description is required',
          minlength: 'Minimum 3 characters',
          maxlength: 'Max allowed length is 256 characters',
        },
        github: {
          link: 'Please enter a valid Github URL',
        },
        twitter: {
          link: 'Please enter a valid twitter URL',
        },
        facebook: {
          link: 'Please enter a valid Facebook URL',
        },
        linkedin: {
          link: 'Please enter a valid LinkedIn URL',
        },
        hashnode: {
          link: 'Please enter your hashnode URL',
        },
        devto: {
          link: 'Please enter a valid dev.to profile URL',
        },
      },
    }),
    FormGroupLabelModule,
    FormModule,
  ],
  declarations: [UiOnboardingProfileComponent],
  exports: [UiOnboardingProfileComponent],
})
export class UiOnboardingProfileModule {}
