/**
 * Service pour la logique métier liée aux animaux.
 * Contient le CRUD avec gestion des erreurs et les méthodes spécifiques.
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Animal } from './animal.entity';
import { Person } from 'src/person/person.entity';

import { CreateAnimalInput } from './dto/create-animal.input';
import { UpdateAnimalInput } from './dto/update-animal.input';
import { HeaviestAnimal } from './models/heaviest-animal.model';
import { MostCommonSpecies } from './models/most-common-species.model';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class AnimalService {
  constructor(
    @InjectRepository(Animal)
    private readonly animalRepository: Repository<Animal>,
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
  ) {}

  /**
   * Récupère tous les animaux.
   * @returns {Promise<Animal[]>} Liste complète des animaux.
   * @throws {InternalServerErrorException} En cas d'erreur inattendue.
   */
  async findAll(start, limit, species?: string): Promise<Animal[]> {
    try {
      // VERSION JS CLASSIQUE
      // let animals = await this.animalRepository.find({ relations: ['owner'] });
      // //Filtre par espèce si demandé
      // if (species) {
      //   animals = animals.filter(
      //     (animal) => animal.species.toLowerCase() === species.toLowerCase(),
      //   );
      // }
      // //Slice pour garder uniquement les résultats demandés
      // const paginatedAnimals = animals.slice(start, start + limit);
      // return paginatedAnimals;

      //VERSION AVEC QUERY BUILDER, pour créer une requête SQL personnalisée. Plus performant.
      const query = this.animalRepository
        .createQueryBuilder('animal')
        .leftJoinAndSelect('animal.owner', 'owner');
      if (species) {
        //On ajoute une clause "where" si l'espèce est précisée
        query.where('LOWER(animal.species) = LOWER(:species)', { species });
      }
      if (typeof start === 'number' && typeof limit === 'number') {
        //Ajout de la pagination en SQL
        query.skip(start).take(limit);
      }
      //Exécution de la requête SQL construite
      const animals = await query.getMany();
      return animals;
    } catch (error) {
      console.error('FINDALL ERROR :', error);
      throw new InternalServerErrorException(
        'Erreur lors de la récupération des animaux',
      );
    }
  }

  /**
   * Récupère un animal par son identifiant.
   * @param {number} id - L'identifiant de l'animal.
   * @returns {Promise<Animal>} L'animal trouvé.
   * @throws {NotFoundException} Si l'animal n'existe pas.
   * @throws {InternalServerErrorException} En cas d'erreur inattendue.
   */
  async findOne(id: number): Promise<Animal> {
    try {
      const animal = await this.animalRepository.findOneBy({ id });
      if (!animal) {
        throw new NotFoundException(`Personne avec l'id ${id} non trouvée`);
      }
      return animal;
    } catch (error) {
      console.error('FINDONE ERROR :', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Erreur lors de la récupération de la personne',
      );
    }
  }

  /**
   * Récupère un animal avec les informations de son propriétaire.
   * @param {number} id - Identifiant de l'animal.
   * @returns {Promise<Animal>} L'animal trouvé avec la relation owner.
   * @throws {NotFoundException} Si l'animal n'existe pas.
   * @throws {InternalServerErrorException} En cas d'erreur inattendue.
   */
  async findOneWithOwner(id: number): Promise<Animal> {
    try {
      const animal = await this.animalRepository.findOne({
        where: { id },
        relations: ['owner'],
      });
      if (!animal) {
        throw new NotFoundException(`Animal avec l'id ${id} non trouvé`);
      }
      return animal;
    } catch (error) {
      console.error('FINDONEWITHOWNER ERROR :', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Erreur lors de la récupération de l’animal avec son propriétaire',
      );
    }
  }

  /**
   * Crée un nouvel animal et l’associe à un propriétaire existant.
   * @param {CreateAnimalInput} data - Données nécessaires à la création de l’animal.
   * @returns {Promise<boolean>} L’animal créé avec sa relation propriétaire.
   * @throws {NotFoundException} NotFoundException si le propriétaire est introuvable.
   * @throws {InternalServerErrorException} InternalServerErrorException en cas d’erreur de création.
   */
  async create(data: CreateAnimalInput): Promise<Animal> {
    try {
      const owner = await this.personRepository.findOneBy({ id: data.ownerId });
      if (!owner) {
        throw new NotFoundException(
          `Propriétaire avec l'id ${data.ownerId} non trouvé`,
        );
      }
      const animal = this.animalRepository.create({
        ...data,
        owner, // je fournis la relation à typeORM sous forme d'objet
      });
      return await this.animalRepository.save(animal);
    } catch (error) {
      console.error('CREATE ANIMAL ERROR :', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Erreur lors de la création de l’animal',
      );
    }
  }

  /**
   * Met à jour un animal existant.
   * @param {number} id - Identifiant de l’animal à modifier.
   * @param {UpdateAnimalInput} data - Données à modifier (tous les champs sont optionnels).
   * @returns {Promise<boolean>} L’animal mis à jour.
   * @throws {NotFoundException} NotFoundException si l’animal ou le propriétaire n’existe pas.
   * @throws {InternalServerErrorException} InternalServerErrorException en cas d’erreur inattendue.
   */
  async update(id: number, data: UpdateAnimalInput): Promise<Animal> {
    try {
      const animal = await this.animalRepository.findOne({
        where: { id },
        relations: ['owner'],
      });
      if (!animal) {
        throw new NotFoundException(`Animal avec l'id ${id} non trouvé`);
      }
      if (data.ownerId) {
        const owner = await this.personRepository.findOneBy({
          id: data.ownerId,
        });
        if (!owner) {
          throw new NotFoundException(
            `Propriétaire avec l'id ${data.ownerId} non trouvé`,
          );
        }
        animal.owner = owner;
      }

      Object.assign(animal, data);
      return await this.animalRepository.save(animal);
    } catch (error) {
      console.error('UPDATE ANIMAL ERROR :', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Erreur lors de la mise à jour de l’animal',
      );
    }
  }

  /**
   * Supprime un animal par son identifiant.
   * @param {number} id - Identifiant de l’animal à supprimer.
   * @returns {Promise<boolean>} `true` si la suppression a réussi, sinon `false`.
   * @throws {NotFoundException} NotFoundException si l’animal n’existe pas.
   * @throws {InternalServerErrorException} InternalServerErrorException en cas d’erreur inattendue.
   */
  async remove(id: number): Promise<boolean> {
    try {
      const animal = await this.animalRepository.findOneBy({ id });
      if (!animal) {
        throw new NotFoundException(`Animal avec l'id ${id} non trouvé`);
      }
      const result = await this.animalRepository.delete(id);
      return !!result.affected && result.affected > 0;
    } catch (error) {
      console.error('REMOVE ANIMAL ERROR :', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Erreur lors de la suppression de l’animal',
      );
    }
  }

  // ---------- Méthodes spécifiques ----------
  /**
   * Récupère le ou les animaux les plus vieux de la base.
   * @returns {Promise<Animal[]>} Tableau contenant tous les animaux ayant la date de naissance la plus ancienne.
   * Retourne un tableau vide si aucun animal n’est trouvé.
   * @throws {InternalServerErrorException} En cas d’erreur inattendue lors de la récupération.
   */
  async findOldest(): Promise<Animal[]> {
    const animals = await this.animalRepository.find();

    if (animals.length === 0) {
      return [];
    }
    // On trouve d'abord la date la plus ancienne
    const oldestDate = animals.reduce(
      (min, animal) =>
        new Date(animal.dateOfBirth) < new Date(min) ? animal.dateOfBirth : min,
      animals[0].dateOfBirth,
    );

    // On retourne tous les animaux ayant cette date
    return animals.filter(
      (animal) =>
        new Date(animal.dateOfBirth).toISOString() ===
        new Date(oldestDate).toISOString(),
    );
  }

  /**
   * Trouve l’espèce la plus représentée dans la base.
   * @returns {Promise<MostCommonSpecies[] | null>} Tableau contenant l'espèce la plus représentée, et son nombre de représentants
   * @throws {InternalServerErrorException} En cas d’erreur inattendue.
   */
  async findMostCommonSpecies(): Promise<MostCommonSpecies[] | null> {
    try {
      const animals = await this.animalRepository.find();
      if (animals.length === 0) {
        return null;
      }
      const speciesCount: Record<string, number> = {};

      for (const animal of animals) {
        speciesCount[animal.species] = (speciesCount[animal.species] || 0) + 1;
      }
      const sorted = Object.entries(speciesCount).sort((a, b) => b[1] - a[1]);
      const topCount = sorted[0][1];
      return sorted
        .filter(([_, count]) => count === topCount)
        .map(([species, count]) => ({ species, count }));
    } catch (error) {
      console.error('FINDMOSTCOMMONSPECIES ERROR :', error);
      throw new InternalServerErrorException(
        "Erreur lors de la recherche de l'espèce la plus représentée",
      );
    }
  }

  /**
   * Trouve l’animal le plus lourd et son propriétaire.
   * @returns {Promise<HeaviestAnimal | null>} Liste des animaux avec le poids maximal, ou `null` si aucun animal.
   * @throws {InternalServerErrorException} En cas d’erreur inattendue.
   */
  async findHeaviestAnimal(): Promise<HeaviestAnimal[] | null> {
    try {
      const animals = await this.animalRepository.find({
        relations: ['owner'],
      });

      if (animals.length === 0) {
        return null;
      }

      const maxWeight = Math.max(...animals.map((animal) => animal.weight));

      return animals
        .filter((animal) => animal.weight === maxWeight)
        .map((animal) => ({
          animalId: animal.id,
          name: animal.name,
          species: animal.species,
          weight: animal.weight,
          ownerFullName: `${animal.owner.firstName} ${animal.owner.lastName}`,
          ownerId: animal.owner.id,
        }));
    } catch (error) {
      console.error('FINDHEAVIESTANIMAL ERROR :', error);
      throw new InternalServerErrorException(
        "Erreur lors de la recherche de l'animal le plus lourd",
      );
    }
  }
}
