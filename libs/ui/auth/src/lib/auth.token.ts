import { InjectionToken } from '@angular/core';

export const AUTH_CONFIG = new InjectionToken<AuthConfig>(
  'Authentication related configs'
);

export interface AuthConfig {
  socialLoginURL: string;
}
