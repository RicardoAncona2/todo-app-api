import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { ApolloDriver, } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true, // makes env available app-wide
  }),
  GraphQLModule.forRoot({
    driver: ApolloDriver,
    autoSchemaFile: true,
    playground: true,
    introspection: true,
    csrfPrevention: false, // disable CSRF protection

  }),
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'postgres',
    port: 5432,
    url: process.env.DATABASE_URL,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true, // false in production
  }),
    AuthModule,
    UsersModule,
    TasksModule,
  ],
})
export class AppModule { }