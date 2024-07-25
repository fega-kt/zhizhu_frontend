import { CrudServiceBase } from '../crud-servicebase';
import { ServiceBase } from '../servicebase';

import { CurrentUser, Signature, UserEntity } from './user';

export class UserService extends CrudServiceBase<UserEntity> {
  constructor() {
    super({
      endpoint: 'account',
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

  /**
   * Get currentUser đồng thời verify token
   * Sửa thành luôn set token mới cho ServiceBase bởi vì
   * một số trường hợp lỗi mạng ko lấy được currentUser nên không update token mới
   */
  async getCurrentUser(token: string) {
    if (token) {
      ServiceBase.setToken(token);
      return this.get<CurrentUser>({
        endpoint: '/profile',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        // passthroughErrorCatcher: true,
      });
    }
    return this.get<CurrentUser>({
      endpoint: '/profile',
    });
  }

  async parseXML(xml: string) {
    return this.post(
      { xml },
      {
        endpoint: '/parseXMLToJSON',
      },
    );
  }

  async updateAvatar(avatar: string) {
    return this.post(
      {
        avatar,
      },
      {
        endpoint: '/updateAvatar',
      },
    );
  }

  async updateSignatures(
    signatures: Pick<Signature, 'name' | 'description' | 'signatureUrl' | 'username'>[],
    action: 'ADD' | 'REMOVE',
    updateUserId: string,
  ): Promise<Signature[]> {
    return this.post(
      {
        signatures,
        action,
        updateUserId,
      },
      {
        endpoint: '/updateSignatures',
      },
    );
  }
}

export const userService = new UserService();
