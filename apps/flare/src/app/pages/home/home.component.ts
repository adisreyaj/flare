import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  ComposerModule,
  CreateFlareEvent,
  FlareCardModule,
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
  template: ` <flare-composer
      (createFlare)="this.createFlare($event)"
    ></flare-composer>
    <ng-container *ngFor="let flare of flares$ | async">
      <flare-card [flare]="flare"></flare-card>
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
