import { InputType, Field, Float, Int } from '@nestjs/graphql';

@InputType()
export class CreateAnimalInput {
  @Field()
  name: string;

  @Field()
  dateOfBirth: Date;

  @Field()
  species: string;

  @Field()
  breed: string;

  @Field()
  color: string;

  @Field(() => Float)
  weight: number;

  @Field(() => Int)
  ownerId: number;
}
