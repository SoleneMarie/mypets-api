import { InputType, Field, Float, Int } from '@nestjs/graphql';

@InputType()
export class UpdateAnimalInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  dateOfBirth?: Date;

  @Field({ nullable: true })
  species?: string;

  @Field({ nullable: true })
  breed?: string;

  @Field({ nullable: true })
  color?: string;

  @Field(() => Float, { nullable: true })
  weight?: number;

  @Field(() => Int, { nullable: true })
  ownerId?: number; //pour changer de propriétaire
}
