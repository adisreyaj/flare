import { Test } from '@nestjs/testing';
import { ApiHeaderPromoService } from './api-header-promo.service';

describe('ApiHeaderPromoService', () => {
  let service: ApiHeaderPromoService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ApiHeaderPromoService],
    }).compile();

    service = module.get(ApiHeaderPromoService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
