import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BUTTON_CONFIG, FORM_INPUT_CONFIG } from 'zigzag';
import { AUTH_CONFIG, AuthInterceptor } from '@flare/ui/auth';

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
    {
      provide: AUTH_CONFIG,
      useValue: {
        socialLoginURL: 'http://localhost:3333/api/auth',
      },
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
