import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'

import { User } from '../user/user.entity'
import { UserService } from '../user/user.service'

import { JwtStrategy } from './auth.jwt-strategy'
import { AuthResolver } from './auth.resolver'
import { AuthService } from './auth.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: '30s',
        },
      }),
    }),
  ],
  providers: [AuthResolver, AuthService, JwtStrategy, UserService],
})
export class AuthModule {}
