import { Component, Inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  ComposerModule,
  FlareCardModule,
  SidebarComponentModule,
} from '@flare/ui/components';
import { FlareService } from '@flare/ui/flare';
import { CURRENT_USER } from '@flare/ui/auth';
import { Observable } from 'rxjs';
import {
  BlockData,
  CreateBlockInput,
  CreateFlareInput,
  Flare,
  User,
} from '@flare/api-interfaces';

@Component({
  selector: 'flare-home',
  template: `<aside>
      <flare-sidebar [user]="user$ | async"></flare-sidebar>
    </aside>
    <main class="border-x border-slate-200">
      <flare-composer (createFlare)="this.createFlare($event)"></flare-composer>
      <ng-container *ngFor="let flare of flares$ | async">
        <flare-card [flare]="flare"></flare-card>
      </ng-container>
    </main>
    <aside></aside>`,
  styles: [
    //language=SCSS
    `
      :host {
        @apply mx-auto grid h-screen max-w-screen-lg;
        grid-template-columns: 280px 1fr 0;
        grid-template-rows: 1fr;
      }
    `,
  ],
})
export class HomeComponent {
  flares$: Observable<Flare[]>;
  constructor(
    private readonly flareService: FlareService,
    @Inject(CURRENT_USER) public readonly user$: Observable<User>
  ) {
    this.flareService.getAll();
    this.flares$ = this.flareService.flares$;
  }

  createFlare(blocks: BlockData[]) {
    const input: CreateFlareInput = {
      blocks: blocks as CreateBlockInput[],
    };
    this.flareService.newFlare(input).subscribe();
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
  ],
  exports: [HomeComponent],
})
export class HomeModule {}
