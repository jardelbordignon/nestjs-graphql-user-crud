import { Field, ObjectType } from '@nestjs/graphql'
import { DeleteDateColumn } from 'typeorm'

import { CommonEntity } from './common.entity'

@ObjectType()
export class SoftEntity extends CommonEntity {
  @DeleteDateColumn()
  @Field(() => Date, { nullable: true })
  deletedAt?: Date
}
