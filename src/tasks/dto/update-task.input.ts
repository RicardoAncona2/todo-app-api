import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class UpdateTaskInput {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE';

}
