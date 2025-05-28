import { Test, TestingModule } from '@nestjs/testing';
import { AnimalResolver } from './animal.resolver';
import { AnimalService } from './animal.service';

describe('AnimalResolver', () => {
  let resolver: AnimalResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnimalResolver, AnimalService],
    }).compile();

    resolver = module.get<AnimalResolver>(AnimalResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
