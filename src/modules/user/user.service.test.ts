import { NotFoundException } from '@nestjs/common'
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

  // describe('', () => {
  //   it('', async () => {})
  // })
})
