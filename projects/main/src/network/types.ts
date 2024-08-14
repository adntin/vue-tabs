import type { TOKEN_KEY } from './constants';

export declare type HttpHeaders = (HeadersInit | Record<string, any>) & {
  'Content-Type': string;
  [TOKEN_KEY]: string | null;
};

export declare type HttpBody = BodyInit | Record<string, any>;

export declare interface HttpRefreshResponse {
  accessToken: string;
  expireTime: number;
  refreshToken: string;
  refreshExpireTime: number;
}

export declare interface HttpRefreshResolve {
  accessToken: string;
  accessExpire?: number;
  refreshToken?: string;
  refreshExpire?: number;
}

export declare interface HttpOptions {
  baseUrl?: string;
  headers: HttpHeaders;
  onLogout: VoidFunction;
  onRefreshToken?: () => Promise<HttpRefreshResolve>;
  showErrorMessage: (msg: string, duration?: number) => any; // 返回值需要是 Promise<void>, 显示完消息后退出到登录页
  timeout?: number;
}

export declare interface HttpActionConfig {
  headers?: Record<string, any>;
  timeout?: number;
}

export interface RefreshTokenQueueRecord {
  resolve: (res: any) => void;
  reject: (err?: any) => void;
  method: string;
  path: string;
  body?: HttpBody;
  config?: HttpActionConfig;
}
