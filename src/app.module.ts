import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppResolver } from './app.resolver';
import { PersonModule } from './person/person.module';
import { AnimalModule } from './animal/animal.module';
import { TypeOrmModule } from '@nestjs/typeorm'; // fournit les données pour se connecter à la base de données
import { Person } from './person/person.entity';
import { Animal } from './animal/animal.entity';

@Module({
  imports: [
    ConfigModule.forRoot(), // permet de lire les fichiers .env
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true, // génère automatiquement un schéma GraphQL basé sur les resolvers
    }),
    TypeOrmModule.forRoot({
      type: 'mysql', //type de bd utilisée
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [Person, Animal], //tables à utiliser avec TypeORM
      synchronize: true, //type ORM va créer automatiquement les tables à partir de mes entités(ok pour local)
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    }),
    PersonModule,
    AnimalModule,
  ],
  providers: [AppResolver],
})
export class AppModule {}
