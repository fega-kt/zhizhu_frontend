import { SafetyOutlined } from '@ant-design/icons';
import { Alert, Button, Checkbox, Col, Divider, Form, Input, Row } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiFillGithub, AiFillGoogleCircle, AiFillWechat } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { DEFAULT_USER, TEST_USER } from '@/_mock/assets';
import { CaptchaReq, SignInReq } from '@/api/services/userService';
import { authService } from '@/core/service/auth/auth-service';
import { ServiceBase } from '@/core/service/servicebase';
import { userService } from '@/core/service/user';
import { useUserActions } from '@/store/userStore';
import { resetAll, setPermission, setUser } from '@/store/userStoreRedux';
import ProTag from '@/theme/antd/components/tag';
import { useThemeToken } from '@/theme/hooks';

import { LoginStateEnum, useLoginStateContext } from './providers/LoginStateProvider';

function LoginForm() {
  const { t } = useTranslation();
  const themeToken = useThemeToken();
  const [loading, setLoading] = useState<boolean>(false);
  const [dataCaptcha, setDataCaptcha] = useState<CaptchaReq | null>();
  const navigatge = useNavigate();
  const { setUserToken } = useUserActions();

  const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env;

  const { loginState, setLoginState } = useLoginStateContext();
  const dispatch = useDispatch();
  const handleGetCaptcha = useCallback(async () => {
    const res = await authService.getCaptcha({ type: 'img', width: 50, height: 50 });
    setDataCaptcha(res);
  }, []);

  useEffect(() => {
    handleGetCaptcha();
  }, [handleGetCaptcha]);

  const handleFinish = async ({ username, password, verifyCode }: SignInReq) => {
    setLoading(true);
    try {
      if (!dataCaptcha?.id) {
        return;
      }

      const { accessToken, refreshToken } = await authService.login({
        username,
        password,
        verifyCode,
        captchaId: dataCaptcha?.id,
      });
      ServiceBase.setToken(accessToken);

      const [user, roles] = await Promise.all([
        userService.getCurrentUser(accessToken),
        authService.getCurrentRole(),
      ]);
      setUserToken({ accessToken, refreshToken });
      if (!user) {
        dispatch(resetAll());
      } else {
        dispatch(setUser(user));
        dispatch(setPermission(roles ?? []));
        navigatge(HOMEPAGE, { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };
  if (loginState !== LoginStateEnum.LOGIN) return null;

  return (
    <>
      <div className="mb-4 text-2xl font-bold xl:text-3xl">{t('sys.login.signInFormTitle')}</div>
      <Form
        name="login"
        size="large"
        initialValues={{
          remember: true,
          username: DEFAULT_USER.username,
          password: DEFAULT_USER.password,
        }}
        onFinish={handleFinish}
      >
        <div className="mb-4 flex flex-col">
          <Alert
            type="info"
            description={
              <div className="flex flex-col">
                <div className="flex">
                  <ProTag className="flex-shrink-0">Admin {t('sys.login.userName')}:</ProTag>
                  <strong className="ml-1" style={{ color: themeToken.colorInfoTextHover }}>
                    <span>{DEFAULT_USER.username}</span>
                  </strong>
                </div>

                <div className="flex">
                  <ProTag className="flex-shrink-0">Test {t('sys.login.userName')}:</ProTag>
                  <strong className="ml-1" style={{ color: themeToken.colorInfoTextHover }}>
                    <span>{TEST_USER.username}</span>
                  </strong>
                </div>

                <div>
                  <ProTag className="flex-shrink-0">{t('sys.login.password')}:</ProTag>
                  <strong className=" ml-1" style={{ color: themeToken.colorInfoTextHover }}>
                    {DEFAULT_USER.password}
                  </strong>
                </div>
              </div>
            }
            showIcon
          />
        </div>

        <Form.Item
          name="username"
          rules={[{ required: true, message: t('sys.login.accountPlaceholder') }]}
        >
          <Input placeholder={t('sys.login.userName')} />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: t('sys.login.passwordPlaceholder') }]}
        >
          <Input.Password type="password" placeholder={t('sys.login.password')} />
        </Form.Item>
        <Form.Item name="verifyCode" rules={[{ required: true, message: '请输入密码！' }]}>
          <Input
            placeholder="验证码"
            prefix={<SafetyOutlined />}
            size="large"
            maxLength={4}
            suffix={
              <img
                src={dataCaptcha?.img}
                onClick={handleGetCaptcha}
                className="absolute right-0 top-0 h-full cursor-pointer"
                alt="验证码"
              />
            }
          />
        </Form.Item>
        <Form.Item>
          <Row>
            <Col span={12}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>{t('sys.login.rememberMe')}</Checkbox>
              </Form.Item>
            </Col>
            <Col span={12} className="text-right">
              <button className="!underline">{t('sys.login.forgetPassword')}</button>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full" loading={loading}>
            {t('sys.login.loginButton')}
          </Button>
        </Form.Item>

        <Row align="middle" gutter={8}>
          <Col span={9} flex="1">
            <Button
              className="w-full !text-sm"
              onClick={() => setLoginState(LoginStateEnum.MOBILE)}
            >
              {t('sys.login.mobileSignInFormTitle')}
            </Button>
          </Col>
          <Col span={9} flex="1">
            <Button
              className="w-full !text-sm"
              onClick={() => setLoginState(LoginStateEnum.QR_CODE)}
            >
              {t('sys.login.qrSignInFormTitle')}
            </Button>
          </Col>
          <Col span={6} flex="1" onClick={() => setLoginState(LoginStateEnum.REGISTER)}>
            <Button className="w-full !text-sm">{t('sys.login.signUpFormTitle')}</Button>
          </Col>
        </Row>

        <Divider className="!text-xs">{t('sys.login.otherSignIn')}</Divider>

        <div className="flex cursor-pointer justify-around text-2xl">
          <AiFillGithub />
          <AiFillWechat />
          <AiFillGoogleCircle />
        </div>
      </Form>
    </>
  );
}

export default LoginForm;
