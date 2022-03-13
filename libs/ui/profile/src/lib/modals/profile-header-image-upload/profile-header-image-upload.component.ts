import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule, ModalModule, ModalRef } from 'zigzag';
import { MediaService, SanitizeUrlPipeModule } from '@flare/ui/shared';
import { FileUploadModule } from '@flare/ui/components';
import { UsersService } from '../../services/users.service';
import { isNil } from 'lodash-es';
import { IsNilPipeModule } from '../../../../../shared/src/pipes/is-nil.pipe';
import { BehaviorSubject, finalize } from 'rxjs';

@Component({
  selector: 'flare-profile-header-image-upload',
  template: `<div class="p-4">
    <header class="mb-6">
      <h1 class="text-lg font-medium">Update Header Image</h1>
    </header>
    <div class="mb-4 flex h-60 flex-col">
      <div
        class="relative aspect-header h-60 rounded-md border border-slate-200"
        flareFileDrop
        (fileDropped)="handleFileDrop($event)"
        *ngIf="
          imagePreview !== null && imagePreview.length > 0;
          else uploadSection
        "
      >
        <div
          class="file-drop-overlay absolute top-0 left-0 z-10 hidden h-full w-full place-items-center bg-primary-transparent-10"
        >
          <div class="text-md font-medium">
            <p>Drop file here</p>
          </div>
        </div>
        <ng-container>
          <img
            class="h-full w-full object-fill"
            [src]="imagePreview | sanitizeUrl"
            alt="Image"
          />
        </ng-container>
      </div>
      <ng-template #uploadSection>
        <div class="file-select-section grid h-full w-full place-items-center">
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
            <p class="font-medium">Drag and Drop or browse for an image</p>
            <p>
              Image <strong>(png/jpg)</strong> resolution should be
              <strong>800x300px</strong>.
            </p>
          </div>
        </div>
      </ng-template>
    </div>
    <footer class="mt-6 flex items-center justify-start gap-2">
      <button
        zzButton
        variant="primary"
        (click)="updateHeaderImage()"
        [disabled]="
          (loading$ | async) ||
          (modalRef?.data?.preferenceId | isNil) ||
          (jobId | isNil)
        "
        type="submit"
      >
        Update
      </button>
      <button zzButton type="button" (click)="modalRef.close()">Cancel</button>
    </footer>
  </div>`,
})
export class ProfileHeaderImageUploadComponent {
  jobId: string | null = null;
  imagePreview: string | null = null;

  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this.loadingSubject.asObservable();
  constructor(
    public readonly modalRef: ModalRef<{ preferenceId: string }>,
    private readonly mediaService: MediaService,
    private readonly userService: UsersService
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

    this.imagePreview = URL.createObjectURL(image);

    if (this.jobId === null) {
      this.loadingSubject.next(true);
      this.mediaService
        .uploadFiles([image])
        .pipe(finalize(() => this.loadingSubject.next(false)))
        .subscribe((data) => {
          this.jobId = `${data.jobId}`;
        });
    } else {
      // TODO: Call API to update the job
    }
  }

  updateHeaderImage() {
    if (!isNil(this.jobId) && !isNil(this.modalRef.data.preferenceId)) {
      this.loadingSubject.next(true);
      this.userService
        .updateHeaderImage(this.jobId, this.modalRef.data.preferenceId)
        .pipe(
          finalize(() => {
            this.loadingSubject.next(false);
          })
        )
        .subscribe((success) => {
          if (success) {
            this.modalRef.close(success);
          }
        });
    }
  }
}

@NgModule({
  declarations: [ProfileHeaderImageUploadComponent],
  imports: [
    CommonModule,
    ButtonModule,
    SanitizeUrlPipeModule,
    FileUploadModule,
    FileUploadModule,
    ModalModule,
    IsNilPipeModule,
  ],
  exports: [ProfileHeaderImageUploadComponent],
})
export class ProfileHeaderImageUploadModule {}
