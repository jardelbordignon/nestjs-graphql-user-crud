import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'

import { UserService } from '../user/user.service'

import { AuthInput } from './auth.dto'
import { AuthType } from './auth.type'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser({ email, password }: AuthInput): Promise<AuthType> {
    const user = await this.userService.findUserByEmail(email)

    if (!user)
      throw new UnauthorizedException('Email and password do not match')

    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch)
      throw new UnauthorizedException('Email and password do not match')

    const payload = { username: user.name, sub: user.id }

    const token = await this.jwtService.signAsync(payload)

    return { user, token }
  }
}
