import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

import { Parser } from './parser';
import { defaultsDeep, urlJoin } from './utils';

interface Notifier {
  error(message: string): void;
  warn(message: string): void;
}

export interface RequestOptions<T = any> extends AxiosRequestConfig {
  endpoint?: string;
  parser?: Parser<T>;
  passthroughErrorCatcher?: boolean;
}

export type ServiceOptions = {
  endpoint: string;
};

export type RefreshTokenInvoker = () => Promise<void>;

export abstract class ServiceBase {
  private static token?: string;

  private static baseUrl: string;

  private static notifier: Notifier;

  private static refreshTokenInvoking = false;

  private static refreshTokenInvoker: RefreshTokenInvoker | undefined;

  private static refreshTokenQueue: {
    resolver: VoidFunction;
    rejector: VoidFunction;
  }[] = [];

  static setConfig(baseUrl: string, n: Notifier) {
    ServiceBase.baseUrl = baseUrl;
    ServiceBase.notifier = n;
  }

  static setToken(token?: string) {
    ServiceBase.token = token;
  }

  static getToken() {
    return ServiceBase.token;
  }

  static setTokenRefresher(invoker: RefreshTokenInvoker) {
    ServiceBase.refreshTokenInvoker = async () => {
      if (ServiceBase.refreshTokenInvoking) {
        return;
      }
      ServiceBase.refreshTokenInvoking = true;
      try {
        try {
          await invoker();
        } catch {
          // thử lại 5 lần nữa
          const isOk = await [1, 2, 3, 4, 5].reduce(async (acc: Promise<boolean>) => {
            const lastOk = await acc;
            if (lastOk) return true;
            return new Promise<boolean>((r) => {
              setTimeout(async () => {
                try {
                  await invoker();
                  r(true);
                } catch {
                  r(false);
                }
              }, 3000);
            });
          }, Promise.resolve(false));
          if (!isOk) throw new Error();
        }
        ServiceBase.refreshTokenQueue.map(({ resolver }) => resolver());
      } catch {
        ServiceBase.refreshTokenQueue.map(({ rejector }) => rejector());
      } finally {
        ServiceBase.refreshTokenQueue.splice(0, ServiceBase.refreshTokenQueue.length);
        ServiceBase.refreshTokenInvoking = false;
      }
    };
  }

  private static refreshToken() {
    return new Promise<void>((resolver, rejector) => {
      ServiceBase.refreshTokenQueue.push({
        resolver,
        rejector,
      });
      console.log({
        sdvsdv: ServiceBase.refreshTokenInvoking,
        refreshTokenInvoker: ServiceBase.refreshTokenInvoker,
        rejector,
      });
      if (!ServiceBase.refreshTokenInvoking) {
        if (ServiceBase.refreshTokenInvoker) {
          ServiceBase.refreshTokenInvoker();
        } else {
          rejector();
          ServiceBase.refreshTokenQueue.splice(0, ServiceBase.refreshTokenQueue.length);
        }
      }
    });
  }

  protected options: ServiceOptions = { endpoint: '' };

  constructor(
    options?: ServiceOptions,
    private client: AxiosInstance = Axios.create({
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      timeout: 300000,
      transformRequest: [
        (data, headers) => {
          if (data instanceof FormData) {
            if (headers) {
              // eslint-disable-next-line no-param-reassign
              delete headers['Content-Type'];
            }
            return data;
          }
          return JSON.stringify(data);
        },
      ],
    }),
  ) {
    this.options = defaultsDeep(options, {
      endpoint: '',
    });
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        return Promise.reject(error.response ? error.response.data : error);
      },
    );
  }

  /**
   * Trả về kết quả, nếu true thì sẽ gọi lại request, nếu false thì sẽ throw
   */
  private async catchError(e: unknown): Promise<boolean> {
    if (typeof e === 'object' && e) {
      const { code, message } = e as any;
      if (code) {
        // đúng kiểu server trả về
        console.log({ code });
        if (code === 401) {
          // token hết hạn
          try {
            await ServiceBase.refreshToken();
            return true;
          } catch {
            return false;
          }
        }
        if (message) {
          // ServiceBase.notifier.error(message);
          console.log(message);
        }
        return false;
      }
    }
    if (e instanceof Error) {
      if (e.message === 'Network Error') {
        ServiceBase.notifier.error(
          'Máy chủ đang bận hoặc đang bảo trì, vui lòng quay lại trong ít phút',
        );
        return false;
      }
    }
    // ServiceBase.notifier.error(
    //   "Xảy ra một lỗi chưa xác định, vui lòng thử lại hoặc liên hệ bộ phận hỗ trợ"
    // );
    console.log('Xảy ra một lỗi chưa xác định, vui lòng thử lại hoặc liên hệ bộ phận hỗ trợ');
    return false;
  }

  private getOptions(options?: RequestOptions) {
    let headers = options && options.headers;
    if (headers && headers.Authorization) {
      // giữ lại token đã truyền vào
    } else if (ServiceBase.token) {
      // không có token thì dùng token đã lưu
      headers = {
        ...headers,
        Authorization: `Bearer ${ServiceBase.token}`,
      };
    }

    return { ...options, headers };
  }

  private getAbsoluteRequestUrl(options?: RequestOptions) {
    if (options && options.endpoint && options.endpoint.startsWith('http')) {
      return options.endpoint;
    }
    if (this.options.endpoint.startsWith('http')) {
      return urlJoin(this.options.endpoint, (options && options.endpoint) || '');
    }

    return urlJoin(ServiceBase.baseUrl, this.options.endpoint, (options && options.endpoint) || '');
  }

  async get<T = any>(options?: RequestOptions): Promise<T> {
    const opts = this.getOptions(options);
    try {
      const { data } = await this.client.get(this.getAbsoluteRequestUrl(options), opts);
      if (opts.parser) {
        await opts.parser.parse(data);
      }
      return data.data;
    } catch (e) {
      if (opts.passthroughErrorCatcher) throw e;
      const catched = await this.catchError(e);
      if (catched) {
        return this.get(options);
      }
      throw e;
    }
  }

  async post<T = any>(data: any, options?: RequestOptions): Promise<T> {
    const opts = this.getOptions(options);
    try {
      const { data: result } = await this.client.post(
        `${this.getAbsoluteRequestUrl(options)}`,
        data,
        opts,
      );
      if (opts.parser) {
        await opts.parser.parse(result);
      }
      return result.data;
    } catch (e) {
      if (opts.passthroughErrorCatcher) throw e;
      const catched = await this.catchError(e);
      if (catched) {
        return this.post(options);
      }
      throw e;
    }
  }

  async patch<T = any>(data: any, options?: RequestOptions): Promise<T> {
    const opts = this.getOptions(options);
    try {
      const { data: result } = await this.client.patch(
        `${this.getAbsoluteRequestUrl(options)}`,
        data,
        opts,
      );
      if (opts.parser) {
        await opts.parser.parse(result);
      }
      return result.data;
    } catch (e) {
      if (opts.passthroughErrorCatcher) throw e;
      const catched = await this.catchError(e);
      if (catched) {
        return this.patch(options);
      }
      throw e;
    }
  }
}
