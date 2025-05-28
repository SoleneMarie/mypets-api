import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class TopOwner {
  @Field(() => Int)
  ownerId: number;

  @Field()
  fullName: string;

  @Field(() => Int)
  count: number;
}
