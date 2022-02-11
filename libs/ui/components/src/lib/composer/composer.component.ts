import {
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output,
} from '@angular/core';
import { ButtonModule, TooltipModule } from 'zigzag';
import { IconModule } from '../icon/icon.module';
import { BlockData, BlockType, ImageBlockData } from '@flare/api-interfaces';
import { CommonModule } from '@angular/common';
import { FlareBlocksInputModule } from '../flare-block-inputs';
import { BehaviorSubject } from 'rxjs';
import { FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { isNil } from 'lodash-es';
import { FileUploadModule } from '../file-upload/file-upload.module';

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
  @Output()
  private readonly createFlare = new EventEmitter<BlockData[]>();

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
    this.createFlare.emit(this.blocksFormArray.value);
    this.blocksFormArray = new FormArray([new FormControl(this.initBlock)]);
  }

  toggleFullScreen() {
    this.isFullScreenSubject.next(!this.isFullScreenSubject.value);
  }

  handleFileUploads(fileList: FileList) {
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
    this.blocksFormArray.push(
      new FormControl({
        type: BlockType.images,
        content: images,
      } as ImageBlockData)
    );
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
  ],
  exports: [ComposerComponent],
})
export class ComposerModule {}
