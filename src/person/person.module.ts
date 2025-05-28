/**
 * Module lié à l'entité Person.
 * Enregistre l'entité, le service et le resolver.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from './person.entity';
import { Animal } from 'src/animal/animal.entity';
import { PersonService } from './person.service';
import { PersonResolver } from './person.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Person, Animal])], //permet d'accéder au repository de l'entité Person
  providers: [PersonService, PersonResolver],
  exports: [PersonService], // Si je veux l'utiliser dans un autre module
})
export class PersonModule {}
