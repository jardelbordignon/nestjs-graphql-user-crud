import { Args, Mutation, Resolver } from '@nestjs/graphql'

import { AuthInput } from './auth.dto'
import { AuthService } from './auth.service'
import { AuthType } from './auth.type'

@Resolver('Auth')
export class AuthResolver {
  constructor(private service: AuthService) {}

  @Mutation(() => AuthType)
  public async login(@Args('data') data: AuthInput): Promise<AuthType> {
    const { user, token } = await this.service.validateUser(data)

    return { user, token }
  }
}
