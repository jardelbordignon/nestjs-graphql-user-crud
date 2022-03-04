import { hashSync } from 'bcryptjs'

export const hashPasswordTransform = {
  from(hash: string): string {
    return hash
  },
  to(password: string): string {
    return hashSync(password, 10)
  },
}
