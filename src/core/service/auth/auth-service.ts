import { CrudServiceBase } from '../crud-servicebase';
import { UserEntity } from '../user';

import { CaptchaReq, ICaptcha, Register, SignInReq, UserToken } from './auth';

import { Permission } from '#/entity';

export class AuthService extends CrudServiceBase<UserEntity> {
  constructor() {
    super({
      endpoint: 'auth',
      populateKeys: [
        // 'groups',
        // 'department',
        // 'pnl',
        'directManager',
        'dottedLineManager',
        // 'principal',
      ],
    });
  }

  async getCaptcha(data: ICaptcha) {
    const { type, width, height } = data;
    return this.get<CaptchaReq>({
      endpoint: `/captcha/${type}?width=${width}&height=${height}`,
    });
  }

  async getCurrentRole() {
    return this.post<Permission[]>(
      {},
      {
        endpoint: '/roles',
      },
    );
  }

  async login(data: SignInReq) {
    return this.post<UserToken>(
      { ...data },
      {
        endpoint: `/login`,
      },
    );
  }

  async register(data: Register) {
    return this.post<Register>(
      { ...data },
      {
        endpoint: `/email/register`,
      },
    );
  }
}

export const authService = new AuthService();
