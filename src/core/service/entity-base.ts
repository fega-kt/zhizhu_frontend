// eslint-disable-next-line import/no-cycle
import { UserEntity } from './user/user';

export interface EntityBase {
  id: string;

  created: Date;

  createdBy: UserEntity;

  modified: Date;

  modifiedBy: UserEntity;

  deleted: boolean;
}
