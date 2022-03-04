import { InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

import { TestUtil } from 'src/base/shared/test/util'

import { User } from './user.entity'
import { UserService } from './user.service'

describe('UserService', () => {
  let service: UserService

  const mockedRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    softDelete: jest.fn(),
  }

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockedRepository,
        },
      ],
    }).compile()

    service = module.get<UserService>(UserService)
  })

  beforeEach(async () => {
    mockedRepository.create.mockClear()
    mockedRepository.delete.mockClear()
    mockedRepository.find.mockClear()
    mockedRepository.findOne.mockClear()
    mockedRepository.save.mockClear()
    mockedRepository.softDelete.mockClear()
    mockedRepository.update.mockClear()
  })

  it('service deve estar definida', () => {
    expect(service).toBeDefined()
  })

  describe('findUsers', () => {
    it('deve listar todos os usuários', async () => {
      // mock do método find que é utilizado pelo findUsers
      mockedRepository.find.mockReturnValue([
        TestUtil.giveAnUser(),
        TestUtil.giveAnUser('Ana'),
      ])

      const users = await service.findUsers()

      expect(users.length).toBe(2)
      expect(users[0]).toHaveProperty('id')
      expect(users[1].email).toBe('ana@email.com')
      expect(mockedRepository.find).toHaveBeenCalledTimes(1)
    })
  })

  describe('findUserById', () => {
    it('deve encontrar um usuário existente', async () => {
      mockedRepository.findOne.mockReturnValue(TestUtil.giveAnUser())

      const user = await service.findUserById('some-user-uuid')

      expect(user).toHaveProperty('id')
      expect(user.email).toBe('johndoe@email.com')
      expect(mockedRepository.findOne).toHaveBeenCalledTimes(1)
    })

    it('deve retornar uma exceção quando não encontrar um usuário', async () => {
      mockedRepository.findOne.mockReturnValue(null)

      expect(service.findUserById('some-user-uuid')).rejects.toEqual(
        new NotFoundException('User not found')
      )
      expect(mockedRepository.findOne).toHaveBeenCalledTimes(1)
    })
  })

  describe('findUserByEmail', () => {
    it('deve encontrar um usuário existente pelo email', async () => {
      mockedRepository.findOne.mockReturnValue(TestUtil.giveAnUser())

      const user = await service.findUserByEmail('some-user-uuid')

      expect(user).toHaveProperty('id')
      expect(user.email).toBe('johndoe@email.com')
      expect(mockedRepository.findOne).toHaveBeenCalledTimes(1)
    })

    it('deve retornar uma exceção quando não encontrar um usuário', async () => {
      mockedRepository.findOne.mockReturnValue(null)

      expect(service.findUserByEmail('some-user-uuid')).rejects.toEqual(
        new NotFoundException('User not found')
      )
      expect(mockedRepository.findOne).toHaveBeenCalledTimes(1)
    })
  })

  describe('createUser', () => {
    it('deve criar um usuário', async () => {
      const user = TestUtil.giveAnUser()

      mockedRepository.create.mockReturnValue(user)
      mockedRepository.save.mockReturnValue(user)

      const savedUser = await service.createUser(user)

      expect(savedUser).toMatchObject(user)
      expect(mockedRepository.create).toHaveBeenCalledTimes(1)
      expect(mockedRepository.save).toHaveBeenCalledTimes(1)
    })

    it('deve retornar uma exceção quanto ocorrer um erro ao criar um usuário', async () => {
      const user = TestUtil.giveAnUser()

      mockedRepository.create.mockReturnValue(user)
      mockedRepository.save.mockReturnValue(null)

      await service.createUser(user).catch((err) => {
        expect(err).toBeInstanceOf(InternalServerErrorException)
        expect(err).toEqual(
          new InternalServerErrorException('Error creating user')
        )
        expect(err.message).toBe('Error creating user')
        expect(err).toMatchObject({
          message: 'Error creating user',
        })
        expect(mockedRepository.create).toHaveBeenCalledTimes(1)
        expect(mockedRepository.save).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('updateUser', () => {
    it('deve atualizar um usuário', async () => {
      const user = TestUtil.giveAnUser()
      const mergedUser = Object.assign(user, { name: `${user.name} updated` })

      mockedRepository.findOne.mockReturnValue(user)
      mockedRepository.save.mockReturnValue(mergedUser)

      const updatedUser = await service.updateUser(mergedUser)

      expect(updatedUser).toHaveProperty('id')
    })
  })

  describe('deleteUser', () => {
    it('deve deletar definitivamente um usuário quando o parâmetro soft for false', async () => {
      const user = TestUtil.giveAnUser()

      mockedRepository.findOne.mockReturnValue(user)
      mockedRepository.delete.mockReturnValue(user)

      const isDeleted = await service.deleteUser(user.id, false)

      expect(isDeleted).toBe(true)
    })

    it('deve deletar (soft delete) um usuário quando o parâmetro soft for true', async () => {
      const user = TestUtil.giveAnUser()

      mockedRepository.findOne.mockReturnValue(user)
      mockedRepository.softDelete.mockReturnValue(user)

      const isDeleted = await service.deleteUser(user.id, true)

      expect(isDeleted).toBe(true)
    })
  })

  describe('restoreUser', () => {
    it('deve restaurar um usuário que tenha sido deletado com soft delete', async () => {
      const user = TestUtil.giveAnUser()
      const deletedUser = Object.assign(user, { deletedAt: new Date() })
      const restoredUser = Object.assign(deletedUser, { deletedAt: null })

      mockedRepository.findOne.mockReturnValue(deletedUser)
      mockedRepository.save.mockReturnValue(restoredUser)

      const restored = await service.restoreUser(user.id)

      expect(restored.deletedAt).toBe(null)
      expect(mockedRepository.findOne).toHaveBeenCalledTimes(1)
      expect(mockedRepository.save).toHaveBeenCalledTimes(1)
    })

    it('deve retornar uma exceção quando não encontrar um usuário', async () => {
      mockedRepository.findOne.mockReturnValue(null)

      expect(service.restoreUser('some-user-uuid')).rejects.toEqual(
        new NotFoundException('User not found')
      )
      expect(mockedRepository.findOne).toHaveBeenCalledTimes(1)
    })
  })
})
