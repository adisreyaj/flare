import { Component, Input } from '@angular/core';

@Component({
  selector: 'flare-block-image-renderer',
  template: `<div
    class="overflow-hidden rounded-md border border-slate-200 shadow-sm"
  >
    <ul
      class="grid"
      [class.grid-cols-1]="content.length === 1"
      [class.grid-cols-2]="content.length > 1"
    >
      <ng-container *ngFor="let image of content; index as i">
        <li class="group relative">
          <img
            class="h-full w-full object-contain"
            style="max-height: 400px"
            [src]="image.name | mediaUrl"
            [alt]="image.alt"
          />
        </li>
      </ng-container>
    </ul>
  </div>`,
})
export class FlareBlockImageRendererComponent {
  @Input()
  content!: any;
}
