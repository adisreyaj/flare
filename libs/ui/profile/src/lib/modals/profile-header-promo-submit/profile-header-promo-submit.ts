import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule, FormInputModule, ModalRef } from 'zigzag';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from '../../../../../components/src/lib/file-upload/file-upload.module';
import { MediaService, SanitizeUrlPipeModule } from '@flare/ui/shared';
import { MediaUploadResponse } from '@flare/api-interfaces';

@Component({
  selector: 'flare-profile-header-promo-submit-modal',
  template: `<div class="p-4">
    <header class="mb-6">
      <h1 class="text-lg font-medium">Submit Promo Proposal</h1>
    </header>
    <form [formGroup]="promoForm">
      <div>
        <div class="mb-4 flex flex-col">
          <label class="mb-1 text-sm font-medium text-slate-500" for="title"
            >Title</label
          >
          <input
            type="text"
            variant="fill"
            zzInput
            formControlName="title"
            id="title"
          />
        </div>
        <div class="mb-4 flex flex-col">
          <label class="mb-1 text-sm font-medium text-slate-500" for="price"
            >Header Image</label
          >
          <div
            class="relative aspect-header h-40 rounded-md border border-slate-200"
            flareFileDrop
            (fileDropped)="handleFileDrop($event)"
          >
            <div
              class="file-drop-overlay absolute top-0 left-0 z-10 hidden h-full w-full place-items-center bg-primary-transparent-10"
            >
              <div class="text-md font-medium">
                <p>Drop file here</p>
              </div>
            </div>
            <ng-container
              *ngIf="promoForm.get('image')?.value; else uploadSection"
            >
              <img
                class="h-full w-full object-fill"
                [src]="promoForm.get('image')?.value | sanitizeUrl"
                alt="Image"
              />
            </ng-container>
            <ng-template #uploadSection>
              <div
                class="file-select-section grid h-full w-full place-items-center"
              >
                <div class="text-center text-xs text-slate-500">
                  <input
                    #mediaInput
                    (change)="handleFileSelect($event)"
                    id="media"
                    accept="image/jpeg,image/png"
                    style="display: none"
                    type="file"
                  />
                  <button
                    zzButton
                    variant="primary"
                    (click)="mediaInput.click()"
                    class="mx-auto mb-2"
                    size="sm"
                  >
                    Upload Image
                  </button>
                  <p class="font-medium">Drag and Drop or Browser Image</p>
                  <p>
                    Image <strong>(png/jpg)</strong> resolution should be
                    <strong>800x300px</strong>.
                  </p>
                </div>
              </div>
            </ng-template>
          </div>
        </div>
        <div class="mb-4 flex flex-col">
          <label
            class="mb-2 text-sm font-medium text-slate-500"
            for="description"
            >Description</label
          >
          <textarea
            formControlName="description"
            class="rounded-md border border-slate-200 bg-slate-100 p-2"
            name="kudos"
            placeholder="Write about your proposal..."
            rows="4"
          ></textarea>
        </div>
        <div class="mb-4 flex flex-col">
          <label class="mb-1 text-sm font-medium text-slate-500" for="price"
            >Price</label
          >
          <input
            type="text"
            zzInput
            class="w-24"
            variant="fill"
            formControlName="price"
            id="price"
          />
        </div>
      </div>
      <footer class="mt-6 flex items-center justify-start gap-2">
        <button
          zzButton
          variant="primary"
          (click)="submit()"
          [disabled]="this.promoForm.invalid"
          type="submit"
        >
          Send
        </button>
        <button zzButton type="button" (click)="modalRef.close()">Close</button>
      </footer>
    </form>
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
export class ProfileHeaderPromoSubmitModalComponent {
  promoForm = this.fb.group({
    title: [''],
    description: [''],
    image: [''],
    price: [''],
  });

  private mediaUploadState: Omit<MediaUploadResponse, 'jobId'> & {
    jobId: null | string | number;
  } = {
    jobId: null,
    files: [],
  };

  constructor(
    public readonly modalRef: ModalRef,
    private readonly fb: FormBuilder,
    private readonly mediaService: MediaService
  ) {}

  handleFileSelect(event: Event) {
    const fileList = (event.target as HTMLInputElement).files;
    if (fileList) this.handleFileDrop(fileList);
  }

  handleFileDrop(fileList: FileList) {
    let files: File[] = [];
    for (let index = 0; index < fileList.length; index++) {
      const file = fileList.item(index);
      if (file) {
        files = [...files, file];
      }
    }
    const image = files[0];

    this.promoForm.patchValue({ image: URL.createObjectURL(image) });
    if (this.mediaUploadState.jobId === null) {
      this.mediaService.uploadFiles([image]).subscribe((data) => {
        this.mediaUploadState = {
          jobId: data.jobId,
          files: [...data.files],
        };
        console.log(this.mediaUploadState);
      });
    } else {
      // TODO: Call API to update the job
    }
  }

  submit() {
    const { image, price, ...data } = this.promoForm.value;
    this.modalRef.close({
      data: {
        ...data,
        price: {
          amount: price,
          currency: 'USD',
        },
      },
      jobId: this.mediaUploadState.jobId,
    });
  }
}

@NgModule({
  declarations: [ProfileHeaderPromoSubmitModalComponent],
  imports: [
    CommonModule,
    ButtonModule,
    FormInputModule,
    ReactiveFormsModule,
    FileUploadModule,
    SanitizeUrlPipeModule,
  ],
  exports: [ProfileHeaderPromoSubmitModalComponent],
})
export class ProfileHeaderPromoSubmitModalModule {}
