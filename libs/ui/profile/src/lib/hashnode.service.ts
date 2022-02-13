import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Blog } from '@flare/api-interfaces';

@Injectable({
  providedIn: 'root',
})
export class HashnodeService {
  constructor(private readonly http: HttpClient) {}

  getLatestBlogs(user: string): Observable<Blog[]> {
    return this.http
      .post<any>(HASHNODE_API_URL, {
        query: getLatestBlogs(user),
      })
      .pipe(
        map((res) =>
          (res.data.user.publication.posts ?? []).map((post: any) => ({
            title: post.title,
            image: post.coverImage,
            link: `https://${res.data.user.publicationDomain}/${post.slug}`,
            description: post.brief,
            dateUpdated: post.dateUpdated,
          }))
        )
      );
  }
}

const HASHNODE_API_URL = 'https://api.hashnode.com/';
const getLatestBlogs = (author: string) => `
    query {
      user(username: "${author}") {
        publicationDomain
        publication {
          posts(page: 0) {
            title
            coverImage
            slug
            cuid
            totalReactions
            brief
            dateUpdated
          }
        }
      }
    }`;
