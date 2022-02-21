import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  combineLatest,
  filter,
  map,
  mapTo,
  Observable,
  startWith,
  Subject,
  switchMap,
} from 'rxjs';
import { Flare } from '@flare/api-interfaces';
import { FlareService } from './services/flare.service';
import {
  FlareCardActions,
  FlareCardModule,
  FlareFeedsHeaderModule,
} from '@flare/ui/components';

@Component({
  selector: 'flare-detail',
  template: `
    <flare-feeds-header title="Flare"></flare-feeds-header>
    <div *ngIf="flare$ | async as flare">
      <flare-card
        context="FLARE_DETAIL"
        [flare]="flare"
        (action)="handleFlareCardActions($event)"
      ></flare-card>
    </div>
  `,
})
export class FlareComponent {
  flare$: Observable<Flare>;
  refreshSubject = new Subject<void>();
  refresh$ = this.refreshSubject
    .asObservable()
    .pipe(startWith(true), mapTo(true));
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly flareService: FlareService
  ) {
    this.flare$ = combineLatest([
      this.activatedRoute.params,
      this.refresh$,
    ]).pipe(
      filter(([params]) => !!params['id']),
      map(([params, refresh]) => ({
        id: params['id'],
        refresh,
      })),
      switchMap(({ id, refresh }) =>
        this.flareService.getFlareById(id, refresh)
      )
    );
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
    this.flareService
      .bookmark(flare.id)
      .subscribe(() => this.refreshSubject.next());
  }

  private removeBookmark(flare: Flare) {
    this.flareService
      .removeBookmark(flare.bookmarks[0].id)
      .subscribe(() => this.refreshSubject.next());
  }

  private like(flare: Flare) {
    this.flareService
      .like(flare.id)
      .subscribe(() => this.refreshSubject.next());
  }

  private unlike(flare: Flare) {
    this.flareService
      .removeLike(flare.id, flare.likes[0].id)
      .subscribe(() => this.refreshSubject.next());
  }

  private deleteFlare(flare: Flare) {
    this.flareService
      .delete(flare.id)
      .subscribe(() => this.refreshSubject.next());
  }
}

@NgModule({
  declarations: [FlareComponent],
  exports: [FlareComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: ':id',
        component: FlareComponent,
      },
    ]),
    FlareCardModule,
    FlareFeedsHeaderModule,
  ],
})
export class UiFlareModule {}
