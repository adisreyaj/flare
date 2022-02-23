import { InjectionToken } from '@angular/core';
import { User } from '@flare/api-interfaces';
import { Observable } from 'rxjs';

export const AUTH_CONFIG = new InjectionToken<AuthConfig>(
  'Authentication related configs'
);

export interface AuthConfig {
  authURL: string;
}

export const CURRENT_USER = new InjectionToken<Observable<User>>(
  'Logged in user details'
);
