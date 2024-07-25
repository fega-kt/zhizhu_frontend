// eslint-disable-next-line import/no-cycle

export interface ICaptcha {
  type: 'img';
  width: number;
  height: number;
}

export interface CaptchaReq {
  id: string;
  img: string;
}

export interface SignInReq {
  username: string;
  password: string;
  verifyCode: string;
  captchaId: string;
}

export interface UserToken {
  accessToken: string;
  refreshToken: string;
}

export interface MenuRole {
  id: string;
  parentId: string;
  label: string;
  name: string;
  type: number;
  route: string;
  component?: string;
  newFeature?: boolean;
  icon?: string;
  status?: number;
  children?: MenuRole[];
}

export interface Register {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}
