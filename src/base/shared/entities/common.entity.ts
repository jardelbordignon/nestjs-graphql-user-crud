import { Field, ObjectType } from '@nestjs/graphql'
import { CreateDateColumn, UpdateDateColumn } from 'typeorm'

import { BasicEntity } from './basic.entity'

@ObjectType()
export class CommonEntity extends BasicEntity {
  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date

  @UpdateDateColumn()
  @Field(() => Date, { nullable: true })
  updatedAt?: Date
}
