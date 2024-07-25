import { Button, Form, Input } from 'antd';
import { useTranslation } from 'react-i18next';

import { Register } from '@/core/service/auth/auth';
import { authService } from '@/core/service/auth/auth-service';

import { ReturnButton } from './components/ReturnButton';
import { LoginStateEnum, useLoginStateContext } from './providers/LoginStateProvider';

function RegisterForm() {
  const { t } = useTranslation();

  const { loginState, backToLogin } = useLoginStateContext();
  if (loginState !== LoginStateEnum.REGISTER) return null;

  const onFinish = async (value: Register) => {
    console.log(value);
    authService.register(value);
    // backToLogin();
  };

  return (
    <>
      <div className="mb-4 text-2xl font-bold xl:text-3xl">{t('sys.login.signUpFormTitle')}</div>
      <Form name="normal_login" size="large" initialValues={{ remember: true }} onFinish={onFinish}>
        <div className="md:flex md:gap-4">
          <Form.Item
            name="firstName"
            className="w-full md:w-[50%]"
            rules={[{ required: true, message: t('sys.login.firstNamePlaceholder') }]}
          >
            <Input placeholder={t('sys.login.firstName')} />
          </Form.Item>
          <Form.Item
            name="lastName"
            className=" w-full  md:w-[50%]"
            rules={[{ required: true, message: t('sys.login.lastNamePlaceholder') }]}
          >
            <Input placeholder={t('sys.login.lastName')} />
          </Form.Item>
        </div>
        <Form.Item
          name="email"
          rules={[{ required: true, message: t('sys.login.emaildPlaceholder') }]}
        >
          <Input placeholder={t('sys.login.email')} />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: t('sys.login.passwordPlaceholder') }]}
        >
          <Input.Password type="password" placeholder={t('sys.login.password')} />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          rules={[
            { required: true, message: t('sys.login.confirmPasswordPlaceholder') },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (value && value.trim().length < 6) {
                  return Promise.reject(
                    new Error(t('password must be longer than or equal to 6 characters')),
                  );
                }
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(t('sys.login.diffPwd')));
              },
            }),
          ]}
        >
          <Input.Password type="password" placeholder={t('sys.login.confirmPassword')} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            {t('sys.login.registerButton')}
          </Button>
        </Form.Item>

        <div className="mb-2 text-xs text-gray">
          <span>{t('sys.login.registerAndAgree')}</span>
          <a href="./" className="text-sm !underline">
            {t('sys.login.termsOfService')}
          </a>
          {' & '}
          <a href="./" className="text-sm !underline">
            {t('sys.login.privacyPolicy')}
          </a>
        </div>

        <ReturnButton onClick={backToLogin} />
      </Form>
    </>
  );
}

export default RegisterForm;
