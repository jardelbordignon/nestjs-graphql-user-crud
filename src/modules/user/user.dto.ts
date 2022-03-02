import { InputType, PartialType } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

@InputType()
export class CreateUserInput {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsEmail()
  @IsNotEmpty()
  email: string
}

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  id: string
}
