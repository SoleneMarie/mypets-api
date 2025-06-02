import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Animal } from '../animal.entity';

@ObjectType()
export class PaginatedAnimals {
  @Field(() => [Animal])
  animals: Animal[];

  @Field(() => Int)
  totalCount: number;
}
