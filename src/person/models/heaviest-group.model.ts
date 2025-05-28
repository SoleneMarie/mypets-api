import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class HeaviestGroup {
  @Field(() => Int)
  ownerId: number;

  @Field()
  fullName: string;

  @Field(() => Float)
  totalWeight: number;
}
