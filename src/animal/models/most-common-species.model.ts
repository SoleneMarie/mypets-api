import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class MostCommonSpecies {
  @Field()
  species: string;

  @Field(() => Int)
  count: number;
}
