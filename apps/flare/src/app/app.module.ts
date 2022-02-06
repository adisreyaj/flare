import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BUTTON_CONFIG, FORM_INPUT_CONFIG } from 'zigzag';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule],
  providers: [
    {
      provide: BUTTON_CONFIG,
      useValue: {
        rounded: 'full',
      },
    },
    {
      provide: FORM_INPUT_CONFIG,
      useValue: {
        rounded: 'full',
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
