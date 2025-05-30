/**
 * Entité TypeORM représentant une personne.
 * Liée à l'entité Animal via une relation OneToMany.
 */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Animal } from 'src/animal/animal.entity';

@ObjectType() // = cette classe peut être utilisée comme type GraphQL
@Entity() // décorateur Entity => classe mappée à une table SQL (ici : Person)
export class Person {
  @Field(() => Int) // décorateur Fied = propriété visible dans les requêtes GraphQl
  @PrimaryGeneratedColumn()
  id: number; // l'id est auto-incrémenté en SQL

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  phoneNumber: string;

  @Field(() => [Animal])
  @OneToMany(() => Animal, (animal) => animal.owner)
  // Relation OneToMany : une personne peut avoir plusieurs animaux.
  // Relation bidirectionnelle : (chaque entité connaît l'autre)
  animals: Animal[];
}
