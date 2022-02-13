import { Test } from '@nestjs/testing';
import { ApiMediaService } from './api-media.service';

describe('ApiMediaService', () => {
  let service: ApiMediaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ApiMediaService],
    }).compile();

    service = module.get(ApiMediaService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
