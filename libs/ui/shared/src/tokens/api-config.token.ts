import { InjectionToken } from '@angular/core';

export interface ApiConfig {
  mediaURL: string;
  baseURL: string;
  coolStuffsURL: string;
}

export const API_CONFIG = new InjectionToken<ApiConfig>(
  'API related configuration'
);
