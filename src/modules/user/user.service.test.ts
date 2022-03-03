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

  beforeEach(async () => {
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

  it('service deve estar definida', () => {
    expect(service).toBeDefined()
  })

  describe('findUsers', () => {
    it('deve listar todos os usuários', async () => {
      // mock do método find que é utilizado pelo findUsers
      mockedRepository.find.mockReturnValue([
        TestUtil.giveAnUser('Jardel Bordignon'),
        TestUtil.giveAnUser('Sabrina de Arruda'),
      ])

      const users = await service.findUsers()

      expect(users.length).toBe(2)
      expect(users[0]).toHaveProperty('id')
      expect(users[0].email).toBe('jardelbordignon@email.com')
      expect(mockedRepository.find).toHaveBeenCalledTimes(1)
    })
  })
})
