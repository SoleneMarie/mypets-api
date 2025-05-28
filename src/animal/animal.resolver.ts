/**
 * Resolver GraphQL pour les opérations sur les animaux.
 * Expose les queries et mutations.
 */
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AnimalService } from './animal.service';
import { Animal } from './animal.entity';

import { CreateAnimalInput } from './dto/create-animal.input';
import { UpdateAnimalInput } from './dto/update-animal.input';
import { MostCommonSpecies } from './models/most-common-species.model';
import { HeaviestAnimal } from './models/heaviest-animal.model';

@Resolver(() => Animal)
export class AnimalResolver {
  constructor(private readonly animalService: AnimalService) {}

  /**
   * Récupère tous les animaux.
   */
  @Query(() => [Animal])
  findAllAnimals(
    @Args('start', { type: () => Int, nullable: true }) start: number,
    @Args('limit', { type: () => Int, nullable: true }) limit: number,
    @Args('species', { type: () => String, nullable: true }) species?: string,
  ) {
    return this.animalService.findAll(start, limit, species);
  }

  /**
   * Récupère un animal par son ID.
   */
  @Query(() => Animal)
  findAnimal(@Args('id', { type: () => Int }) id: number) {
    return this.animalService.findOne(id);
  }

  /**
   * Récupère un animal avec son propriétaire.
   */
  @Query(() => Animal)
  findAnimalWithOwner(@Args('id', { type: () => Int }) id: number) {
    return this.animalService.findOneWithOwner(id);
  }

  /**
   * Crée un nouvel animal.
   */
  @Mutation(() => Animal)
  createAnimal(@Args('data') data: CreateAnimalInput) {
    return this.animalService.create(data);
  }

  /**
   * Met à jour un animal existant.
   */
  @Mutation(() => Animal)
  updateAnimal(
    @Args('id', { type: () => Int }) id: number,
    @Args('data') data: UpdateAnimalInput,
  ) {
    return this.animalService.update(id, data);
  }

  /**
   * Supprime un animal par son ID.
   */
  @Mutation(() => Boolean)
  deleteAnimal(@Args('id', { type: () => Int }) id: number) {
    return this.animalService.remove(id);
  }

  // ---------- Méthodes spécifiques ----------

  /**
   * Trouve le ou les plus vieux animaux
   */
  @Query(() => [Animal])
  findOldestAnimals() {
    return this.animalService.findOldest();
  }

  /**
   * Trouve la ou les espèces les plus représentées
   */
  @Query(() => [MostCommonSpecies])
  findMostCommonSpecies() {
    return this.animalService.findMostCommonSpecies();
  }

  /**
   * Trouve le ou les animaux les plus lourds, et leurs maitres
   */
  @Query(() => [HeaviestAnimal], { nullable: true })
  findHeaviestAnimal() {
    return this.animalService.findHeaviestAnimal();
  }
}
