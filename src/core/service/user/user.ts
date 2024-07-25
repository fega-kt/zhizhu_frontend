// eslint-disable-next-line import/no-cycle
import { EntityBase } from '../entity-base';

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export interface Signature {
  name: string;
  username: string;
  description?: string;
  signatureUrl: string;
  signatureSize: {
    width: number;
    height: number;
  };
  fullInfoSignatureUrl: string;
  fullInfoSignatureSize: {
    width: number;
    height: number;
  };
  departmentInfo?: DepartmentInfo;
}

export interface DepartmentInfo {
  departmentId: string;
  departmentCode: string;
  departmentName: string;
  departmentOtherCode?: string;
  employeeCode?: string;
  jobTitle?: string;
  directManager?: string;
}

export interface UserNotInAd {
  Username: string;
  Password: string;
  Email: string;
}

export interface UserEntity extends EntityBase {
  code: string;

  fullName: string;

  // groups: GroupEntity[];

  firstName?: string;

  middleName?: string;

  lastName?: string;

  loginName: string;

  workEmail?: string;

  personalEmail?: string;

  workPhone?: string;

  cellPhone?: string;

  dob?: Date;

  joinDate?: Date;

  gender: Gender;

  jobLevel?: string;

  // department?: DepartmentEntity;

  directManager?: UserEntity;

  // secretaries?: PrincipalEntity[];

  dottedLineManager?: UserEntity;

  jobTitle?: string;

  // principal: PrincipalEntity;

  // pnl?: DepartmentEntity;

  manualCreated?: boolean;

  isNonAD?: boolean;

  avatar?: string;

  signatures?: Signature[];

  allowManageSignature?: boolean;

  departmentInfo?: DepartmentInfo[];

  location?: string;

  locationCode?: string;

  hiddenSubtitle?: boolean;

  groupExpandOrders: GroupExpandOrder[];

  enableOverDateLimits?: boolean;

  timeRangeLimitsFrom?: Date;

  timeRangeLimitsTo?: Date;

  sendReportAfterLimitsTime?: boolean;
}

export interface UserEntityExpand extends UserEntity {
  selectedDepartment?: DepartmentInfo;
}

export interface GroupExpandOrder {
  groupId: string;
  order: number;
}

export interface CurrentUser extends UserEntity {
  token?: string;
}
