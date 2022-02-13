import { Component, Input, NgModule } from '@angular/core';
import { Blog } from '../../../../api-interfaces/src/blogs.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'flare-profile-blogs',
  template: `<ul
    class="grid grid-cols-1 md:grid-cols-2 md:gap-4 lg:grid-cols-3"
  >
    <ng-container *ngFor="let blog of blogs | slice: 3">
      <li
        class="group rounded-md border border-slate-200 transition-all duration-200"
      >
        <a [href]="blog.link" target="blank" rel="noreferrer nopener">
          <header class="relative">
            <img [src]="blog.image" class="rounded-md" [alt]="blog.title" />
          </header>
          <div class="p-2">
            <h3
              class="text-sm font-semibold line-clamp-2 group-hover:text-primary"
            >
              {{ blog.title }}
            </h3>
            <div class="flex">
              <p class="text-xs">{{ blog.date | date: 'short' }}</p>
            </div>
            <p class="mt-2 text-sm line-clamp-3">
              {{ blog.description }}
            </p>
          </div>
        </a>
      </li>
    </ng-container>
  </ul>`,
})
export class ProfileBlogsComponent {
  @Input()
  blogs: Blog[] | null = [];
}

@NgModule({
  imports: [CommonModule],
  declarations: [ProfileBlogsComponent],
  exports: [ProfileBlogsComponent],
})
export class ProfileBlogsModule {}
