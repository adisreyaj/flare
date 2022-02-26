import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ButtonModule,
  FormGroupLabelModule,
  FormGroupModule,
  FormInputModule,
  FormModule,
  ModalRef,
} from 'zigzag';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { SanitizeUrlPipeModule } from '@flare/ui/shared';
import { MediaUploadResponse, UpdateUserInput } from '@flare/api-interfaces';
import { AuthService } from '@flare/ui/auth';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'flare-profile-header-promo-submit-modal',
  template: `<div class="flex flex-col" style="max-height: 85vh">
    <header class="p-4 pb-6">
      <h1 class="text-lg font-medium">Edit Profile</h1>
    </header>
    <zz-form
      id="profileForm"
      class="flex-1 overflow-y-auto px-4"
      [formGroup]="profileForm"
    >
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
      <section formGroupName="bio">
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
        <zz-form-group id="hashnode" class="flex flex-col">
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
    <footer class="flex items-center justify-start gap-2 p-4">
      <button
        zzButton
        variant="primary"
        (click)="submit()"
        [disabled]="this.profileForm.invalid"
        type="submit"
      >
        Send
      </button>
      <button zzButton type="button" (click)="modalRef.close()">Close</button>
    </footer>
  </div>`,
  styles: [
    //language=SCSS
    `
      .file-over {
        @apply ring-2 ring-primary;

        .file-drop-overlay {
          @apply grid;
        }

        .file-select-section {
          display: none;
        }
      }
    `,
  ],
})
export class ProfileEditModalComponent {
  profileForm: FormGroup;

  private mediaUploadState: Omit<MediaUploadResponse, 'jobId'> & {
    jobId: null | string | number;
  } = {
    jobId: null,
    files: [],
  };

  constructor(
    public readonly modalRef: ModalRef,
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly userService: UsersService
  ) {
    this.profileForm = this.buildProfileForm();
    this.profileForm.get('email')?.disable();
    this.profileForm.get('username')?.disable();
    this.authService.me().subscribe((user) => {
      this.profileForm.patchValue({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        description: user.bio?.description,
        email: user.email,
        bio: {
          id: user?.bio?.id,
          github: user?.bio?.github,
          twitter: user?.bio?.twitter,
          linkedin: user?.bio?.linkedin,
          facebook: user?.bio?.facebook,
          hashnode: user?.bio?.hashnode,
          devto: user?.bio?.devto,
        },
      });
    });
  }

  submit() {
    const data = this.getProfileFormValue();
    this.userService.updateUserProfile(data).subscribe(() => {
      this.modalRef.close(true);
    });
  }

  private buildProfileForm() {
    return this.fb.group(
      {
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
            Validators.pattern(/^[a-zA-Z0-9]{1,}.[a-zA-Z0-9_]+$/),
          ],
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
}

@NgModule({
  declarations: [ProfileEditModalComponent],
  imports: [
    CommonModule,
    ButtonModule,
    FormInputModule,
    ReactiveFormsModule,
    SanitizeUrlPipeModule,
    FormGroupModule,
    FormGroupLabelModule,
    FormModule,
  ],
  exports: [ProfileEditModalComponent],
})
export class ProfileEditModalModule {}
