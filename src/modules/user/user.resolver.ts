import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { GqlAuthGuard } from '../auth/auth.guard'

import { CreateUserInput, UpdateUserInput } from './user.dto'
import { User } from './user.entity'
import { UserService } from './user.service'

@Resolver(() => User)
export class UserResolver {
  constructor(private service: UserService) {}

  @Query(() => [User])
  async findUsers(): Promise<User[]> {
    return this.service.findUsers()
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => User)
  async findUserById(@Args('id') id: string): Promise<User> {
    return this.service.findUserById(id)
  }

  @Query(() => User)
  async findUserByEmail(@Args('email') email: string): Promise<User> {
    return this.service.findUserByEmail(email)
  }

  @Mutation(() => User)
  async createUser(@Args('data') data: CreateUserInput): Promise<User> {
    return this.service.createUser(data)
  }

  @Mutation(() => User)
  async updateUser(@Args('data') data: UpdateUserInput): Promise<User> {
    return this.service.updateUser(data)
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args('id') id: string): Promise<boolean> {
    return this.service.deleteUser(id, false)
  }

  @Mutation(() => Boolean)
  async softDeleteUser(@Args('id') id: string): Promise<boolean> {
    return this.service.deleteUser(id, true)
  }

  @Mutation(() => User)
  async restoreUser(@Args('id') id: string): Promise<User> {
    return this.service.restoreUser(id)
  }
}
