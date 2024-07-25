import apiClient from '../apiClient';

import { UserInfo, UserToken } from '#/entity';

export interface SignInReq {
  username: string;
  password: string;
  verifyCode: string;
  captchaId: string;
}
export interface SizeCaptcha {
  width: number;
  height: number;
}

export interface CaptchaReq {
  id: string;
  img: string;
}

export interface SignUpReq extends Pick<SignInReq, 'username' | 'password'> {
  email: string;
}
export type SignInRes = UserToken;

export enum UserApi {
  SignIn = '/auth/login',
  SignUp = '/auth/signup',
  Logout = '/auth/logout',
  Refresh = '/auth/refresh',
  User = '/user',
  Captcha = '/auth/captcha/img',
  Profile = '/account/profile',
}

const signin = (data: SignInReq) => apiClient.post<SignInRes>({ url: UserApi.SignIn, data });
const signup = (data: SignUpReq) => apiClient.post<SignInRes>({ url: UserApi.SignUp, data });
const logout = () => apiClient.get({ url: UserApi.Logout });
const findById = (id: string) => apiClient.get<UserInfo[]>({ url: `${UserApi.User}/${id}` });
const profile = () => apiClient.get<UserInfo>({ url: `${UserApi.Profile}` });

const captcha = ({ width, height }: SizeCaptcha) =>
  apiClient.get<CaptchaReq>({ url: `${UserApi.Captcha}?width=${width}&height=${height}` });

export default {
  signin,
  signup,
  findById,
  logout,
  captcha,
  profile,
};
