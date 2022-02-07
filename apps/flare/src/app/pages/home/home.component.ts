import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponentModule } from '@flare/ui/components';

@Component({
  selector: 'flare-home',
  template: `<aside>
      <flare-sidebar></flare-sidebar>
    </aside>
    <main></main>
    <aside></aside>`,
  styles: [
    `
      :host {
        display: grid;
        grid-template-columns: 280px 1fr 200px;
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
  ],
  exports: [HomeComponent],
})
export class HomeModule {}
