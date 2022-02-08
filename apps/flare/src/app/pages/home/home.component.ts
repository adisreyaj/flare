import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  ComposerModule,
  FlareCardModule,
  SidebarComponentModule,
} from '@flare/ui/components';

@Component({
  selector: 'flare-home',
  template: `<aside>
      <flare-sidebar></flare-sidebar>
    </aside>
    <main class="border-r border-slate-100 overflow-y-auto">
      <flare-composer></flare-composer>
      <ul>
        <li>
          <flare-card></flare-card>
        </li>
        <li>
          <flare-card></flare-card>
        </li>
        <li>
          <flare-card></flare-card>
        </li>
        <li>
          <flare-card></flare-card>
        </li>
      </ul>
    </main>
    <aside hidden></aside>`,
  styles: [
    //language=SCSS
    `
      :host {
        display: grid;
        grid-template-columns: 280px 1fr;
        height: 100vh;
        grid-template-rows: 1fr;
      }
    `,
  ],
})
export class HomeComponent {}

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
