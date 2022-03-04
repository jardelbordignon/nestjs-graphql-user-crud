import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateUserInput, UpdateUserInput } from './user.dto'
import { User } from './user.entity'

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  async findUsers(): Promise<User[]> {
    const users = await this.repository.find()
    return users
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.repository.findOne(id)
    if (!user) throw new NotFoundException('User not found')
    return user
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.repository.findOne({ where: { email } })
    if (!user) throw new NotFoundException('User not found')
    return user
  }

  async createUser(data: CreateUserInput): Promise<User> {
    const createdUser = this.repository.create(data)
    const user = await this.repository.save(createdUser)
    if (!user) throw new InternalServerErrorException('Error creating user')
    return user
  }

  async updateUser(data: UpdateUserInput): Promise<User> {
    const user = await this.findUserById(data.id)
    const mergedUser = Object.assign(user, { ...data })
    return this.repository.save(mergedUser)
  }

  async deleteUser(id: string, soft: boolean): Promise<boolean> {
    await this.findUserById(id)
    if (soft) {
      return !!this.repository.softDelete(id)
    }
    return !!this.repository.delete(id)
  }

  async restoreUser(id: string): Promise<User> {
    const user = await this.repository.findOne(id, { withDeleted: true })
    if (!user) throw new NotFoundException('User not found')
    const restoredUser = Object.assign(user, { deletedAt: null })
    return this.repository.save(restoredUser)
  }
}
