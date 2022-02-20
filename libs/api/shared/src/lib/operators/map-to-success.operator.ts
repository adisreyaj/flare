import { map, Observable } from 'rxjs';

export const mapToSuccess =
  <T>() =>
  (source: Observable<T>) =>
    source.pipe(map(() => ({ success: true })));
