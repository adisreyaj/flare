import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  ComposerModule,
  CreateFlareEvent,
  FlareCardActions,
  FlareCardModule,
  FlareFeedsHeaderModule,
  SidebarComponentModule,
} from '@flare/ui/components';
import { FlareService } from '@flare/ui/flare';
import { Observable } from 'rxjs';
import {
  CreateBlockInput,
  CreateFlareInput,
  Flare,
} from '@flare/api-interfaces';

@Component({
  selector: 'flare-home',
  template: ` <flare-feeds-header title="What's Trending?"></flare-feeds-header>
    <flare-composer (createFlare)="this.createFlare($event)"></flare-composer>
    <ng-container *ngFor="let flare of flares$ | async">
      <flare-card
        [flare]="flare"
        (action)="handleFlareCardActions($event)"
      ></flare-card>
    </ng-container>`,
})
export class HomeComponent {
  flares$: Observable<Flare[]>;
  constructor(private readonly flareService: FlareService) {
    this.flareService.getAll();
    this.flares$ = this.flareService.flares$;
  }

  createFlare({ blocks, jobId }: CreateFlareEvent) {
    const input: CreateFlareInput = {
      blocks: blocks as CreateBlockInput[],
      jobId,
    };
    this.flareService.newFlare(input).subscribe();
  }

  handleFlareCardActions($event: { type: FlareCardActions; data: Flare }) {
    const trigger: Record<FlareCardActions, () => void> = {
      LIKE: () => this.like($event.data),
      UNLIKE: () => this.unlike($event.data),
      BOOKMARK: () => this.addBookmark($event.data),
      REMOVE_BOOKMARK: () => this.removeBookmark($event.data),
      DELETE: () => this.deleteFlare($event.data),
    };

    trigger[$event.type]();
  }

  private addBookmark(flare: Flare) {
    this.flareService.bookmark(flare.id).subscribe();
  }

  private removeBookmark(flare: Flare) {
    this.flareService.removeBookmark(flare.bookmarks[0].id).subscribe();
  }

  private like(flare: Flare) {
    this.flareService.like(flare.id).subscribe();
  }

  private unlike(flare: Flare) {
    this.flareService.removeLike(flare.id, flare.likes[0].id).subscribe();
  }

  private deleteFlare(flare: Flare) {
    this.flareService.delete(flare.id).subscribe();
  }
}

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: HomeComponent }]),
    SidebarComponentModule,
    ComposerModule,
    FlareCardModule,
    FlareCardModule,
    FlareFeedsHeaderModule,
  ],
  exports: [HomeComponent],
})
export class HomeModule {}
