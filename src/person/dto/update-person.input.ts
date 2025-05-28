import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdatePersonInput {
  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phoneNumber?: string;
}
