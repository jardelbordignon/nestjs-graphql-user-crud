import { ObjectType } from '@nestjs/graphql'
import { Column, Entity } from 'typeorm'

import { SoftEntity } from 'src/base/shared/entities/soft.entity'

@ObjectType()
@Entity({ name: 'users' })
export class User extends SoftEntity {
  @Column()
  name: string

  @Column()
  email: string
}
