import { Component, EventEmitter, NgModule, Output } from '@angular/core';
import { ButtonModule, TooltipModule } from 'zigzag';
import { IconModule } from '../icon/icon.module';
import { BlockData, BlockType } from '@flare/api-interfaces';
import { CommonModule } from '@angular/common';
import { FlareBlocksInputModule } from '../flare-block-inputs';
import { BehaviorSubject } from 'rxjs';
import { FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'flare-composer',
  templateUrl: 'composer.component.html',
})
export class ComposerComponent {
  blockTypes = BlockType;

  blocks: FormArray = new FormArray([
    new FormControl({
      type: BlockType.text,
      content: '',
    }),
  ]);

  private readonly isFullScreenSubject = new BehaviorSubject(false);
  public readonly isFullScreen$ = this.isFullScreenSubject.asObservable();

  @Output()
  private readonly createFlare = new EventEmitter<BlockData[]>();

  addBlock(block: BlockType) {
    this.blocks.push(
      new FormControl({
        type: block,
        content: '',
      })
    );
  }

  postFlare() {
    this.createFlare.emit(this.blocks.value);
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
