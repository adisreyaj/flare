import {
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output,
} from '@angular/core';
import { ButtonModule, DropdownModule, TooltipModule } from 'zigzag';
import { IconModule } from '../icon/icon.module';
import {
  BlockData,
  BlockType,
  ImageBlockData,
  MediaUploadResponse,
} from '@flare/api-interfaces';
import { CommonModule } from '@angular/common';
import { FlareBlocksInputModule } from '../flare-block-inputs';
import { BehaviorSubject } from 'rxjs';
import { FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { isNil } from 'lodash-es';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { MediaService } from '@flare/ui/shared';

@Component({
  selector: 'flare-composer',
  templateUrl: 'composer.component.html',
  styles: [
    //language=SCSS
    `
      .file-over {
        @apply ring-2 ring-primary;

        .file-drop-overlay {
          @apply grid;
        }
      }
    `,
  ],
})
export class ComposerComponent {
  blockTypes = BlockType;
  initBlock = {
    type: BlockType.text,
    content: {
      value: '',
    },
  };
  blocksFormArray: FormArray = new FormArray([new FormControl(this.initBlock)]);

  private readonly isFullScreenSubject = new BehaviorSubject(false);
  public readonly isFullScreen$ = this.isFullScreenSubject.asObservable();
  private mediaUploadState: Omit<MediaUploadResponse, 'jobId'> & {
    jobId: null | string | number;
  } = {
    jobId: null,
    files: [],
  };

  @Output()
  private readonly createFlare = new EventEmitter<CreateFlareEvent>();

  constructor(private readonly mediaService: MediaService) {}

  @Input()
  set blocks(blocks: BlockData[]) {
    if (!isNil(blocks)) {
      this.blocksFormArray = new FormArray(
        blocks.map((block) => new FormControl(block))
      );
    }
  }

  addBlock(block: BlockType) {
    this.blocksFormArray.push(
      new FormControl({
        type: block,
        content: '',
      })
    );
  }

  postFlare() {
    this.createFlare.emit({
      blocks: this.blocksFormArray.value,
      jobId: this.mediaUploadState.jobId as string,
    });
    this.blocksFormArray = new FormArray([new FormControl(this.initBlock)]);
    this.resetMediaUploadState();
  }

  toggleFullScreen() {
    this.isFullScreenSubject.next(!this.isFullScreenSubject.value);
  }

  handleFileDrop(fileList: FileList) {
    let files: File[] = [];
    for (let index = 0; index < fileList.length; index++) {
      const file = fileList.item(index);
      if (file) {
        files = [...files, file];
      }
    }
    const images = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    const imagesControl = this.blocksFormArray.controls.find(
      (control) => control.value.type === BlockType.images
    );
    if (imagesControl) {
      imagesControl.setValue({
        type: BlockType.images,
        content: [...imagesControl.value.content, ...images],
      });
    } else {
      this.blocksFormArray.push(
        new FormControl({
          type: BlockType.images,
          content: images,
        } as ImageBlockData)
      );
    }

    if (this.mediaUploadState.jobId === null) {
      this.mediaService.uploadFiles(files).subscribe((data) => {
        this.mediaUploadState = {
          jobId: data.jobId,
          files: [...this.mediaUploadState.files, ...data.files],
        };
        console.log(this.mediaUploadState);
      });
    } else {
      // TODO: Call API to Upload more files
    }
  }
  handleFileSelect(event: Event) {
    const fileList = (event.target as HTMLInputElement).files;
    if (fileList) this.handleFileDrop(fileList);
  }
  removeImageFromBlock($event: number, i: number) {
    const existingBlock: ImageBlockData =
      this.blocksFormArray.controls[i].value;
    const filtered = existingBlock.content.filter(
      (_, index) => index !== $event
    );
    if (filtered.length === 0) {
      this.blocksFormArray.removeAt(i);
    }
    this.blocksFormArray.controls[i].setValue({
      ...existingBlock,
      content: filtered,
    });
  }

  private resetMediaUploadState() {
    this.mediaUploadState = {
      jobId: null,
      files: [],
    };
  }
}

@NgModule({
  declarations: [ComposerComponent],
  imports: [
    ButtonModule,
    IconModule,
    TooltipModule,
    CommonModule,
    FlareBlocksInputModule,
    ReactiveFormsModule,
    FileUploadModule,
    DropdownModule,
  ],
  exports: [ComposerComponent],
})
export class ComposerModule {}

export interface CreateFlareEvent {
  blocks: BlockData[];
  jobId: string;
}
