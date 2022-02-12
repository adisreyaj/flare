import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BUTTON_CONFIG, FORM_INPUT_CONFIG } from 'zigzag';
import {
  AUTH_CONFIG,
  AuthInterceptor,
  AuthService,
  CURRENT_USER,
} from '@flare/ui/auth';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ApolloLink, InMemoryCache } from '@apollo/client/core';
import { environment } from '../environments/environment';
import { setContext } from '@apollo/client/link/context';
import { API_CONFIG } from '@flare/ui/shared';

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
    {
      provide: API_CONFIG,
      useValue: {
        baseURL: `${environment.apiURL}/api`,
        mediaURL: environment.mediaURL,
      },
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
    {
      provide: CURRENT_USER,
      useFactory: (auth: AuthService) => auth.me(),
      deps: [AuthService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

export function createApollo(httpLink: HttpLink) {
  const gqlAPI = `${environment.apiURL}/graphql`;

  const auth = setContext(() => {
    const token = localStorage.getItem('token');

    if (token === null) {
      return {};
    } else {
      return {
        headers: {
          Authorization: `JWT ${token}`,
        },
      };
    }
  });

  const link = ApolloLink.from([auth, httpLink.create({ uri: gqlAPI })]);
  const cache = new InMemoryCache();

  return {
    link,
    cache,
  };
}
