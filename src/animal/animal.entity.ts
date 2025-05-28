/**
 * Entité TypeORM représentant un animal.
 * Liée à l'entité person via une relation ManyToOne.
 */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Person } from 'src/person/person.entity';

@ObjectType()
@Entity()
export class Animal {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  dateOfBirth: Date;

  @Field()
  @Column()
  species: string;

  @Field()
  @Column()
  breed: string;

  @Field()
  @Column()
  color: string;

  @Field(() => Float)
  @Column('float')
  weight: number;

  @Field(() => Person)
  @ManyToOne(() => Person, (person) => person.animals)
  // Relation ManyToOne : plusieurs animaux peuvent appartenir à une personne, mais chaque animal a un seul propriétaire.
  // Relation bidirectionnelle : (chaque entité connaît l'autre)
  owner: Person;
}
