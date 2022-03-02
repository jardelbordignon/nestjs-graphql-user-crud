import { Field, ID, ObjectType } from '@nestjs/graphql'
import { BaseEntity, PrimaryGeneratedColumn } from 'typeorm'
import { v4 as uuid } from 'uuid'

@ObjectType()
export class BasicEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string

  constructor() {
    super()
    if (!this.id) this.id = uuid()
  }
}
