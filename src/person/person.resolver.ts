/**
 * Resolver GraphQL pour les opérations sur les personnes.
 * Expose les queries et mutations.
 */
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PersonService } from './person.service';
import { Person } from './person.entity';

import { CreatePersonInput } from './dto/create-person.input';
import { UpdatePersonInput } from './dto/update-person.input';
import { PaginatedPersons } from './dto/paginated-persons.dto';
import { TopOwner } from './models/top-owner.model';
import { HeaviestGroup } from './models/heaviest-group.model';

@Resolver(() => Person)
export class PersonResolver {
  constructor(private readonly personService: PersonService) {}

  /**
   * Récupère toutes les personnes.
   */
  @Query(() => PaginatedPersons)
  paginatedPersons(
    @Args('start', { type: () => Int, nullable: true }) start?: number,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ): Promise<PaginatedPersons> {
    return this.personService.findAll(start ?? 0, limit ?? 12);
  }

  /**
   * Récupère une personne par son ID.
   */
  @Query(() => Person)
  findPerson(@Args('id', { type: () => Int }) id: number) {
    return this.personService.findOne(id);
  }

  /**
   * Récupère une personne avec ses animaux.
   */
  @Query(() => Person)
  findPersonWithAnimals(@Args('id', { type: () => Int }) id: number) {
    return this.personService.findOneWithAnimals(id);
  }

  /**
   * Crée une nouvelle personne.
   */
  @Mutation(() => Person)
  createPerson(@Args('data') data: CreatePersonInput) {
    return this.personService.create(data);
  }

  /**
   * Met à jour une personne.
   */
  @Mutation(() => Person)
  updatePerson(
    @Args('id', { type: () => Int }) id: number,
    @Args('data') data: UpdatePersonInput,
  ) {
    return this.personService.update(id, data);
  }

  /**
   * Supprime une personne.
   */
  @Mutation(() => Boolean)
  deletePerson(@Args('id', { type: () => Int }) id: number) {
    return this.personService.remove(id);
  }

  /**
   * Supprime une personne et ses animaux.
   */
  @Mutation(() => Boolean)
  deletePersonWithAnimals(@Args('id', { type: () => Int }) id: number) {
    return this.personService.removeWithAnimals(id);
  }

  // ---------- Méthodes spécifiques ----------
  /**
   * Trouve la ou les personnes qui possèdent le plus d'animaux.
   */
  @Query(() => [TopOwner])
  findTopOwners() {
    return this.personService.findTopOwners();
  }

  /**
   * Trouve la ou les personnes qui possèdent le plus d'un animal.
   */
  @Query(() => [TopOwner])
  findTopOwnersBySpecies(@Args('species') species: string) {
    return this.personService.findTopOwnersBySpecies(species);
  }

  /**
   * Trouve la ou les personnes qui ont le groupe d'animaux le plus lourd
   */
  @Query(() => [HeaviestGroup])
  findHeaviestGroups() {
    return this.personService.findHeaviestGroups();
  }
}
