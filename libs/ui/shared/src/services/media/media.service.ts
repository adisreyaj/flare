import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG, ApiConfig } from '@flare/ui/shared';
import { MediaUploadResponse } from '@flare/api-interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  constructor(
    private readonly http: HttpClient,
    @Inject(API_CONFIG) private apiConfig: ApiConfig
  ) {}

  uploadFiles(files: File[]): Observable<MediaUploadResponse> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    return this.http.post<MediaUploadResponse>(
      `${this.apiConfig.baseURL}/media/upload`,
      formData
    );
  }
}
