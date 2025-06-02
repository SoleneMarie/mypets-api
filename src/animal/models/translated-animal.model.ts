import { ObjectType, Field } from '@nestjs/graphql';
import { Animal } from '../animal.entity';

@ObjectType()
export class TranslatedAnimal extends Animal {
  @Field()
  breedTranslated: string;

  @Field()
  colorTranslated: string;

  @Field()
  specieTranslated: string;
}
