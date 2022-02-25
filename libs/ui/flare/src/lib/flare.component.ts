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
  FlareCardEventData,
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

  handleFlareCardActions($event: FlareCardEventData) {
    const trigger: Partial<Record<FlareCardActions, () => void>> = {
      LIKE: () => this.like($event.data as Flare),
      UNLIKE: () => this.unlike($event.data as Flare),
      BOOKMARK: () => this.addBookmark($event.data as Flare),
      REMOVE_BOOKMARK: () => this.removeBookmark($event.data as Flare),
      DELETE: () => this.deleteFlare($event.data as Flare),
      ADD_COMMENT: () =>
        this.addComment($event.data as { flare: Flare; comment: string }),
      REMOVE_COMMENT: () =>
        this.removeComment(
          $event.data as { flare: Flare; comment: string; commentId: string }
        ),
    };

    (
      trigger[$event.type] ??
      (() => {
        return;
      })
    )();
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

  private addComment(data: { flare: Flare; comment: string }) {
    this.flareService
      .addComment(data)
      .subscribe(() => this.refreshSubject.next());
  }

  private removeComment(data: {
    flare: Flare;
    comment: string;
    commentId: string;
  }) {
    this.flareService
      .removeComment(data)
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
