import { HideField, ObjectType } from '@nestjs/graphql'
import { Column, Entity } from 'typeorm'

import { SoftEntity } from 'src/base/shared/entities/soft.entity'
import { hashPasswordTransform } from 'src/base/shared/utils/hashPasswordTransform'

@ObjectType()
@Entity({ name: 'users' })
export class User extends SoftEntity {
  @Column()
  name: string

  @Column()
  email: string

  @Column({ transformer: hashPasswordTransform })
  @HideField()
  password: string
}
