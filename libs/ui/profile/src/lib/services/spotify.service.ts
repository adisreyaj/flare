import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG, ApiConfig } from '@flare/ui/shared';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private readonly spotifyURL = this.api.coolStuffsURL;
  constructor(
    private readonly http: HttpClient,
    @Inject(API_CONFIG) private readonly api: ApiConfig
  ) {}

  authorize(username: string) {
    return this.http.get(`${this.spotifyURL}/spotify-authorize/@${username}`);
  }

  getLastPlayed(username: string): Observable<boolean | SpotifyLastPlayed[]> {
    return this.http
      .get<SpotifyLastPlayed[]>(
        `${this.spotifyURL}/spotify-last-played/@${username}`
      )
      .pipe(
        catchError((err) => {
          console.log(err);
          return of(false);
          return of(err?.message === 'Not configured' ? false : []);
        })
      );
  }
}

export interface SpotifyLastPlayed {
  title: string;
  album: string;
  artist: string;
  image: string;
}
