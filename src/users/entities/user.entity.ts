import { ObjectType, Field, ID, HideField } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Task } from 'src/tasks';

@ObjectType()
@Entity()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column()
  name: string;

  @HideField()
  @Column()
  password: string;

  @Field(() => [Task], { nullable: true })
  @OneToMany(() => Task, task => task.user)
  tasks: Task[];
}
