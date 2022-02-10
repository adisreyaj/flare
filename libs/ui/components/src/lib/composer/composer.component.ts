import {
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output,
} from '@angular/core';
import { ButtonModule, TooltipModule } from 'zigzag';
import { IconModule } from '../icon/icon.module';
import { BlockData, BlockType } from '@flare/api-interfaces';
import { CommonModule } from '@angular/common';
import { FlareBlocksInputModule } from '../flare-block-inputs';
import { BehaviorSubject } from 'rxjs';
import { FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { isNil } from 'lodash-es';

@Component({
  selector: 'flare-composer',
  templateUrl: 'composer.component.html',
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

  @Input()
  set blocks(blocks: BlockData[]) {
    if (!isNil(blocks)) {
      this.blocksFormArray = new FormArray(
        blocks.map((block) => new FormControl(block))
      );
    }
  }

  @Output()
  private readonly createFlare = new EventEmitter<BlockData[]>();

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
  ],
  exports: [ComposerComponent],
})
export class ComposerModule {}
