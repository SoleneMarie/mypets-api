import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Person } from '../person.entity';

@ObjectType()
export class PaginatedPersons {
  @Field(() => [Person])
  persons: Person[];

  @Field(() => Int)
  totalCount: number;
}
