import { Test } from '@nestjs/testing';
import { ApiMediaController } from './api-media.controller';
import { ApiMediaService } from './api-media.service';

describe('ApiMediaController', () => {
  let controller: ApiMediaController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ApiMediaService],
      controllers: [ApiMediaController],
    }).compile();

    controller = module.get(ApiMediaController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
