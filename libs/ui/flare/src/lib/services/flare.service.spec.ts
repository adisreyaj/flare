import { TestBed } from '@angular/core/testing';

import { FlareService } from './flare.service';

describe('FlareService', () => {
  let service: FlareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
