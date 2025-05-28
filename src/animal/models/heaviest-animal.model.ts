import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class HeaviestAnimal {
  @Field(() => Int)
  animalId: number;

  @Field()
  name: string;

  @Field()
  species: string;

  @Field(() => Float)
  weight: number;

  @Field()
  ownerFullName: string;

  @Field(() => Int)
  ownerId: number;
}
