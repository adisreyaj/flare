import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ImageBlockData } from '@flare/api-interfaces';

@Component({
  selector: 'flare-block-image-input',
  template: `
    <div class="overflow-hidden rounded-md border border-slate-200 shadow-sm">
      <ul
        class="grid"
        [class.grid-cols-1]="content.length === 1"
        [class.grid-cols-2]="content.length > 1"
      >
        <ng-container *ngFor="let image of content; index as i">
          <li class="group relative">
            <img
              class="h-full object-fill"
              [src]="image.url | sanitizeUrl"
              alt=""
            />
            <div
              class="absolute top-0 left-0 hidden h-full w-full place-items-center rounded-md bg-black bg-opacity-40 group-hover:grid"
            >
              <button
                (click)="remove.emit(i)"
                class="rounded-full bg-white p-1 text-red-500 hover:shadow-lg"
              >
                <rmx-icon class="icon-sm" name="close-line"></rmx-icon>
              </button>
            </div>
          </li>
        </ng-container>
      </ul>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class FlareBlockImageInputComponent {
  @Input()
  content!: ImageBlockData['content'];

  @Output()
  remove = new EventEmitter<number>();
}
