# 🐾 MyPets - Backend API

Backend de l’application **MyPets**.  
Développé avec **NestJS**, **GraphQL**, **TypeORM** et **MySQL**, ce backend gère les entités `Animal` et `Person` ainsi que plusieurs fonctionnalités métier (traduction, statistiques, pagination...).

---

## ⚙️ Technologies utilisées

- [NestJS](https://nestjs.com/) - Framework backend Node.js
- [GraphQL](https://graphql.org/) - API query language
- [TypeORM](https://typeorm.io/) - ORM pour TypeScript
- [MySQL](https://www.mysql.com/) - Base de données relationnelle
- [MyMemory API](https://mymemory.translated.net/) - Service de traduction gratuit

---

## 🚀 Lancer le projet en local

### 1. Cloner le dépôt

```bash
git clone https://github.com/SoleneMarie/mypets-api.git
cd mypets-api
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration de l'environnement local

Créer un fichier .env à la racine en se basant sur .env.example.
Ces variables sont destinées à configurer **la connexion à la base de données MySQL locale** :

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_database_user
DB_PASS=your_database_password
DB_NAME=your_database_name
```

### 4. Démarrer le serveur

```bash
npm run start:dev
```

---

## 🧠 Fonctionnalités principales

- 🔁 CRUD complet sur les entités `Animal` et `Person`
- 🔍 Recherches spécifiques :
  - Animaux les plus vieux
  - Animaux les plus lourds
  - Espèce la plus représentée
  - Propriétaire ayant le plus d'animaux
  - Propriétaire ayant les animaux les plus lourds
  - Propriétaire ayant le plus d'une espèce en particulier
- 🌐 Traduction automatique de certains champs (espèce, race, couleur) via l’API **MyMemory**
- 🔗 Relations `OneToMany` / `ManyToOne` entre `Person` et `Animal`
- 📊 Resolvers GraphQL pour toutes les fonctionnalités

---

## 📁 Structure du projet

```
/src
  /animal
    /dto # Data Transfer Objects, types attendus en entrée des requêtes
    /models # Types attendus en sortie des requêtes
    animal.entity.ts
    animal.module.ts
    animal.service.ts
    animal.resolver.ts

  /person # Logique métier des personnes
    /dto # Data Transfer Objects, types attendus en entrée des requêtes
    /models # Types attendus en sortie des requêtes
    person.entity.ts
    person.module.ts
    person.service.ts
    person.resolver.ts

  /translation # Helper de traduction (MyMemory)

  app.module.ts # Module principal
  main.ts # Point d'entrée de l'application

.env
.env.example

data-SQL.txt #data à insérer en base de données pour tester
```

---

## 🗃️ Modèles de données

### 🐶 `Animal`

```ts
{
  id: number;
  name: string;
  dateOfBirth: Date;
  species: string;
  breed: string;
  color: string;
  weight: number;
  owner: Person;
}
```

### 👤 `Person`

```ts
{
  id: number;
  lastName: string;
  firstName: string;
  email: string;
  phoneNumber: string;
  animals: Animal[];
}
```

## Exemple de requête GraphQL

```graphql
query {
  findAnimalWithOwner(id: 1) {
    id
    name
    species
    specieTranslated
    owner {
      firstName
      lastName
    }
  }
}
```

---

### 🔗 Frontend associé

Cette API est utilisée par une application front-end développée en Next.js :

👉 [Dépôt GitHub – mypets-front](https://github.com/SoleneMarie/mypets-front)

Elle consomme les données via GraphQL et propose une interface utilisateur pour consulter les animaux, leurs propriétaires, et visualiser des statistiques.

---

## 👩‍💻 Auteur

Projet réalisé dans le cadre d’un exercice technique.  
Codé avec ❤️ par **Solène**.
