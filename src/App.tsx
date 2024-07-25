import { App as AntdApp } from 'antd';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';

import Logo from '@/assets/images/logo.png';
import Router from '@/router/index';
import AntdConfig from '@/theme/antd';

import { MotionLazy } from './components/animate/motion-lazy';
import { CircleLoading } from './components/loading';
import { UserToken } from './core/service/auth/auth';
import { authService } from './core/service/auth/auth-service';
import { userService } from './core/service/user';
import { useUserActions } from './store/userStore';
import { resetAll, setPermission, setUser } from './store/userStoreRedux';
import { getItem } from './utils/storage';

import { StorageEnum } from '#/enum';

function App() {
  const { setUserToken } = useUserActions();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(true);

  const handleGetCurrentUser = useCallback(async () => {
    const currentUrl = window.location;
    console.log({ currentUrl });
    const { accessToken, refreshToken } = getItem<UserToken>(StorageEnum.Token) || {};
    setLoading(true);
    try {
      const [user, roles] = await Promise.all([
        userService.getCurrentUser(accessToken ?? ''),
        authService.getCurrentRole(),
      ]);
      setUserToken({ accessToken, refreshToken });
      if (!user) {
        dispatch(resetAll());
      } else {
        dispatch(setUser(user));
        dispatch(setPermission(roles ?? []));
      }
    } catch (error) {
      //
    } finally {
      setLoading(false);
    }
  }, [dispatch, setUserToken]);

  useEffect(() => {
    handleGetCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <Suspense fallback={<CircleLoading />}>
        <SuspenseLoading />
      </Suspense>
    );
  }

  return (
    <AntdConfig>
      <AntdApp>
        <MotionLazy>
          <Helmet>
            <title>Slash Admin</title>
            <link rel="icon" href={Logo} />
          </Helmet>

          <Router />
        </MotionLazy>
      </AntdApp>
    </AntdConfig>
  );
}

export default App;

function SuspenseLoading() {
  const ata = useMemo(() => {
    (async () => {
      await setTimeout(() => {
        return '';
      }, 100000000);
    })();
    return '';
  }, []);
  return ata;
}
