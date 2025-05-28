/**
 * Module lié à l'entité Animal.
 * Enregistre l'entité, le service et le resolver.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Animal } from './animal.entity';
import { Person } from 'src/person/person.entity';
import { AnimalService } from './animal.service';
import { AnimalResolver } from './animal.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Animal, Person])], // Donne accès au repository de l'entité Animal
  providers: [AnimalService, AnimalResolver],
  exports: [AnimalService], // Si je veux l'utiliser dans un autre module
})
export class AnimalModule {}
