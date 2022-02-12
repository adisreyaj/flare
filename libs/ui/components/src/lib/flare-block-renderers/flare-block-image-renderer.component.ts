import { Component, Input } from '@angular/core';

@Component({
  selector: 'flare-block-image-renderer',
  template: `<div class="rounded-md border border-slate-200 p-2">
    <ul class="flex flex-wrap gap-2">
      <ng-container *ngFor="let image of content; index as i">
        <li class="group relative">
          <img
            class="h-24 w-24 rounded-md"
            [src]="image.name | mediaUrl"
            alt=""
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
