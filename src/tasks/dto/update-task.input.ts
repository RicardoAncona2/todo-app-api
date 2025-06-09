import { Field, InputType } from '@nestjs/graphql';
import { TaskStatus } from '@tasks/entities';

@InputType()
export class UpdateTaskInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  status: TaskStatus;
}
