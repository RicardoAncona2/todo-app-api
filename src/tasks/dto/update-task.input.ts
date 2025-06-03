import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateTaskInput } from './create-task.input';

@InputType()
export class UpdateTaskInput extends PartialType(CreateTaskInput) {
  // You can add extra fields here if needed, like `updatedAt`
}
