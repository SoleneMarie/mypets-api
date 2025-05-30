/**
 * Service pour la logique métier liée aux personnes.
 * Contient le CRUD avec gestion des erreurs et les méthodes spécifiques.
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Person } from './person.entity';
import { Animal } from '../animal/animal.entity';
import { TopOwner } from './models/top-owner.model';
import { HeaviestGroup } from './models/heaviest-group.model';

import { UpdatePersonInput } from './dto/update-person.input';
import { CreatePersonInput } from './dto/create-person.input';

import {
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    @InjectRepository(Animal)
    private readonly animalRepository: Repository<Animal>,
  ) {}

  /**
   * Récupère toutes les personnes enregistrées dans la base.
   * @returns {Promise<Person[]>} Liste complète des personnes.
   * @throws {InternalServerErrorException} En cas d'erreur inattendue.
   */
  async findAll(
    start: number,
    limit: number,
  ): Promise<{ persons: Person[]; totalCount: number }> {
    try {
      const [persons, totalCount] = await this.personRepository
        .createQueryBuilder('person')
        .leftJoinAndSelect('person.animals', 'animals')
        .skip(Number(start))
        .take(Number(limit))
        .getManyAndCount(); // Récupérer les résultats paginés + le total sans pagination

      return { persons, totalCount };
    } catch (error) {
      console.error('FINDALL PAGINATED ERROR:', error);
      throw new InternalServerErrorException(
        'Erreur lors de la récupération paginée des personnes',
      );
    }
  }

  /**
   * Récupère une personne par son identifiant.
   * @param {number} id - L'identifiant de la personne.
   * @returns {Promise<Person>} La personne trouvée.
   * @throws {NotFoundException} Si la personne n'existe pas.
   * @throws {InternalServerErrorException} En cas d'erreur inattendue.
   */
  async findOne(id: number): Promise<Person> {
    try {
      const person = await this.personRepository.findOneBy({ id });
      if (!person) {
        throw new NotFoundException(`Personne avec l'id ${id} non trouvée`);
      }
      return person;
    } catch (error) {
      console.error('FINDONE ERROR :', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Erreur lors de la récupération de la personne',
      );
    }
  }

  /**
   * Récupère une personne et ses animaux
   * @param {number} id - L'identifiant de la personne.
   * @returns {Promise<Person>} La personne avec ses animaux.
   * @throws {NotFoundException} Si la personne n'existe pas.
   * @throws {InternalServerErrorException} En cas d'erreur inattendue.
   */
  async findOneWithAnimals(id: number): Promise<Person | null> {
    try {
      const person = await this.personRepository.findOne({
        where: { id },
        relations: ['animals'],
      });

      if (!person) {
        throw new NotFoundException(`Personne avec l'id ${id} non trouvée`);
      }

      return person;
    } catch (error) {
      console.error('FINDONEWITHANIMALS ERROR :', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Erreur lors de la récupération des données de la personne',
      );
    }
  }

  /**
   * Crée une nouvelle personne.
   * @param {CreatePersonInput} data - Données de la personne à créer.
   * @returns {Promise<Person>} La personne nouvellement créée.
   * @throws {InternalServerErrorException} En cas d'échec de création.
   */
  async create(data: CreatePersonInput): Promise<Person> {
    try {
      const person = this.personRepository.create(data);
      return await this.personRepository.save(person);
    } catch (error) {
      console.error('CREATE ERROR :', error);
      throw new InternalServerErrorException(
        'Erreur lors de la création de la personne',
      );
    }
  }

  /**
   * Met à jour les données d'une personne.
   * @param {number} id - L'identifiant de la personne à modifier.
   * @param {UpdatePersonInput} data - Les données à mettre à jour.
   * @returns {Promise<Person>} La personne mise à jour.
   * @throws {NotFoundException} Si la personne n'existe pas.
   * @throws {InternalServerErrorException} En cas d'erreur lors de l'enregistrement.
   */
  async update(id: number, data: UpdatePersonInput): Promise<Person> {
    try {
      const person = await this.personRepository.findOneBy({ id });
      if (!person) {
        throw new NotFoundException(`Person with id ${id} not found`);
      }

      Object.assign(person, data);
      return await this.personRepository.save(person);
    } catch (error) {
      console.error('UPDATE ERROR :', error);
      throw new InternalServerErrorException(
        'Une erreur est survenue lors de la mise à jour',
      );
    }
  }

  /**
   * Supprime une personne par son identifiant.
   * @param {number} id - L'identifiant de la personne à supprimer.
   * @returns {Promise<boolean>} `true` si la suppression a été effectuée.
   * @throws {NotFoundException} Si la personne n'existe pas.
   * @throws {InternalServerErrorException} En cas d'erreur inattendue.
   */
  async remove(id: number): Promise<boolean> {
    try {
      const person = await this.personRepository.findOneBy({ id });

      if (!person) {
        throw new NotFoundException(`Personne avec l'id ${id} non trouvée`);
      }

      const result = await this.personRepository.delete(id);
      return !!result.affected && result.affected > 0;
    } catch (error) {
      console.error('REMOVE ERROR :', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Erreur lors de la suppression de la personne',
      );
    }
  }

  /**
   * Supprime une personne et tous ses animaux.
   * @param {number} id - L'identifiant de la personne à supprimer.
   * @returns {Promise<boolean>} `true` si la suppression a bien eu lieu.
   * @throws {NotFoundException} Si la personne n'existe pas.
   * @throws {InternalServerErrorException} En cas d'erreur globale.
   */
  async removeWithAnimals(id: number): Promise<boolean> {
    try {
      const person = await this.personRepository.findOneBy({ id });

      if (!person) {
        throw new NotFoundException(`Personne avec l'id ${id} non trouvée`);
      }

      await this.animalRepository.delete({ owner: { id } });
      const result = await this.personRepository.delete(id);
      return !!result.affected && result.affected > 0;
    } catch (error) {
      console.error('REMOVEWITHANIMALS ERROR :', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Erreur lors de la suppression de la personne et de ses animaux',
      );
    }
  }

  // ---------- Méthodes spécifiques ----------
  /**
   * Retourne la ou les personnes possédant le plus d'animaux.
   * @returns {Promise<TopOwner[]>} Tableau contenant le ou les propriétaires ayant le plus d'animaux.
   * @throws {InternalServerErrorException} En cas d'erreur globale.
   */
  async findTopOwners(): Promise<
    { ownerId: number; fullName: string; count: number }[]
  > {
    try {
      const persons = await this.personRepository.find({
        relations: ['animals'], //Pour que typeORM fasse un JOIN, sinon person.animals reste undefined
      });

      if (persons.length === 0) return [];
      // Créer un tableau avec ownerId, fullName et nombre d'animaux
      const ownersWithCount = persons.map((person) => ({
        ownerId: person.id,
        fullName: `${person.firstName} ${person.lastName}`,
        count: person.animals.length,
      }));

      const maxCount = Math.max(...ownersWithCount.map((owner) => owner.count));
      return ownersWithCount.filter((owner) => owner.count === maxCount);
    } catch (error) {
      console.error('FINDTOPOWNERS ERROR :', error);
      throw new InternalServerErrorException(
        "Une erreur est survenue lors de la récupération des propriétaires avec le plus d'animaux",
      );
    }
  }

  /**
   * Retourne la ou les personnes ayant le plus d'animaux d'une espèce donnée.
   * @param species - Nom de l'espèce à filtrer (ex: "Cat")
   * @returns {Promise<TopOwner[]>} Tableau contenant le ou les propriétaires en ayant le plus, et le nombre de chats.
   * @throws {BadRequestException} Si le paramètre est vide.
   * @throws {InternalServerErrorException} En cas d’erreur inattendue.
   */
  async findTopOwnersBySpecies(species: string): Promise<TopOwner[]> {
    try {
      if (!species || species.trim() === '') {
        throw new BadRequestException(
          "Le champ 'species' ne peut pas être vide.",
        );
      }
      const speciesLower = species.toLowerCase();
      const persons = await this.personRepository.find({
        relations: ['animals'],
      });

      const ownersWithCount = persons.map((person) => {
        const count = person.animals.filter(
          (a) => a.species.toLowerCase() === speciesLower,
        ).length;

        return {
          ownerId: person.id,
          fullName: `${person.firstName} ${person.lastName}`,
          count,
        };
      });
      const maxCount = Math.max(...ownersWithCount.map((o) => o.count));
      return ownersWithCount.filter((o) => o.count === maxCount && o.count > 0);
    } catch (error) {
      console.error('FINDTOPOWNERSBYSPECIES ERROR :', error);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(
        "Erreur lors de la recherche des propriétaires pour l'espèce spécifiée",
      );
    }
  }

  /**
   * Trouve le ou les propriétaires ayant le groupe d’animaux le plus lourd.
   * @returns {Promise<HeaviestGroup[]>} Propriétaires avec le poids total le plus élevé.
   * @throws {InternalServerErrorException} En cas d’erreur de récupération.
   */
  async findHeaviestGroups(): Promise<HeaviestGroup[]> {
    try {
      const persons = await this.personRepository.find({
        relations: ['animals'],
      });

      const ownersWithTotalWeight = persons.map((person) => {
        const totalWeight = person.animals.reduce(
          (sum, animal) => sum + animal.weight,
          0,
        );

        return {
          ownerId: person.id,
          fullName: `${person.firstName} ${person.lastName}`,
          totalWeight,
        };
      });

      const maxWeight = Math.max(
        ...ownersWithTotalWeight.map((owner) => owner.totalWeight),
      );

      return ownersWithTotalWeight.filter(
        (owner) => owner.totalWeight === maxWeight,
      );
    } catch (error) {
      console.error('FINDHEAVIESTGROUPS ERROR :', error);
      throw new InternalServerErrorException(
        "Erreur lors de la récupération des groupes d'animaux les plus lourds",
      );
    }
  }
}
