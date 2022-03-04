import { User } from 'src/modules/user/user.entity'

export class TestUtil {
  static giveAnUser(name = 'John Doe'): User {
    const email = `${name.toLowerCase().replace(/\s/g, '')}@email.com`

    const user = new User()
    user.name = name
    user.email = email
    user.password = '123456'

    return user
  }
}
