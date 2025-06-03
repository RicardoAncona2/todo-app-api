import { InputType, Field } from '@nestjs/graphql';
import { TaskStatus } from '../entities/task.entity';

@InputType()
export class CreateTaskInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => String, { defaultValue: TaskStatus.PENDING })
  status: TaskStatus;
}
