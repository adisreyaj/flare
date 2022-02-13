import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Blog } from '../../../../../api-interfaces/src/blogs.interface';

@Injectable({
  providedIn: 'root',
})
export class DevToService {
  constructor(private readonly http: HttpClient) {}
  // TODO: Call backend due to CORS issue
  getLatestBlogs(user: string): Observable<Blog[]> {
    return this.http
      .get<any>(DEVTO_API_URL, {
        params: {
          username: user,
        },
      })
      .pipe(
        map((res) =>
          (res ?? []).map((post: any) => ({
            title: post.title,
            image: post.cover_image,
            link: post.url,
            description: post.description,
            dateUpdated: post.published_at,
          }))
        )
      );
  }
}

const DEVTO_API_URL = 'https://dev.to/api/articles';
