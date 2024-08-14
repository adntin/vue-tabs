import { TOKEN_KEY } from './constants';
import type { HttpActionConfig, HttpBody, HttpOptions, HttpRefreshResolve, RefreshTokenQueueRecord } from './types';

export default class Http {
  baseUrl: HttpOptions['baseUrl'];
  headers: HttpOptions['headers'];
  onLogout: HttpOptions['onLogout'];
  onRefreshToken: HttpOptions['onRefreshToken'];
  showErrorMessage: HttpOptions['showErrorMessage'];
  timeout: HttpOptions['timeout'];

  isRefreshingToken: boolean = false;
  waitRefreshTokenQueue: RefreshTokenQueueRecord[] = [];

  static instance: Http;

  constructor(options: HttpOptions) {
    this.baseUrl = options.baseUrl || '';
    this.headers = options.headers;
    this.onLogout = options.onLogout;
    this.onRefreshToken = options.onRefreshToken;
    this.showErrorMessage = options.showErrorMessage;
    this.timeout = options.timeout || 30000;
    Http.instance = this; // 单实例
  }

  setHeader(values: Record<string, string>) {
    this.headers = { ...this.headers, ...values };
  }

  // 单实例
  static getInstance() {
    const instance: Http = Http.instance;
    if (instance) {
      return instance;
    }
    throw new Error('[Http] 未实例化');
  }

  get<T = any>(path: string, body?: HttpBody, config?: HttpActionConfig) {
    return this._fetch<T>('GET', path, body, config);
  }

  post<T = any>(path: string, body?: HttpBody, config?: HttpActionConfig) {
    return this._fetch<T>('POST', path, body, config);
  }

  put<T = any>(path: string, body?: HttpBody, config?: HttpActionConfig) {
    return this._fetch<T>('PUT', path, body, config);
  }

  patch<T = any>(path: string, body?: HttpBody, config?: HttpActionConfig) {
    return this._fetch<T>('PATCH', path, body, config);
  }

  delete<T = any>(path: string, body?: HttpBody, config?: HttpActionConfig) {
    return this._fetch<T>('DELETE', path, body, config);
  }

  _getUrl(method: string, path: string, body?: HttpBody) {
    const url = path.startsWith('http') ? path : this.baseUrl + path;
    if (method === 'GET') {
      if (body === undefined || body === null) {
        return url;
      }
      let u: URL;
      if (url.startsWith('http')) {
        u = new URL(url);
      } else {
        u = new URL(url, window.location.origin);
      }
      const keys = Object.keys(body) as (keyof typeof body)[];
      keys.forEach((key) => {
        let value: any = body[key];
        if (
          Object.prototype.toString.call(value) === '[object Object]' ||
          Object.prototype.toString.call(value) === '[object Array]'
        ) {
          value = JSON.stringify(value);
        }
        u.searchParams.append(key, String(value));
      });
      return u.href;
    }
    return url;
  }

  _getRequest(method: string, path: string, body?: HttpBody, config: HttpActionConfig = {}): Request {
    const url = this._getUrl(method, path, body);
    const timeout = typeof config.timeout === 'undefined' ? this.timeout : config.timeout;
    let signal: AbortSignal | null = null;
    if (timeout && timeout > 0) {
      const controller = new AbortController(); // 控制器
      signal = controller.signal;
      setTimeout(() => controller.abort(), timeout); // 超时中止
    }
    const _headers = {
      // traceId: getDateTime() + Math.floor(Math.random() * 1000000),
      ...this.headers,
      ...config.headers,
    };
    const contentType = _headers['Content-Type'];
    const _body = method === 'GET' ? null : contentType === 'application/json' ? JSON.stringify(body) : body;
    const init: RequestInit = {
      method,
      signal,
      mode: 'cors',
      cache: 'default',
      headers: new Headers(_headers),
      body: _body as RequestInit['body'],
    };
    return new Request(url, init);
  }

  async _handleResponse(request: Request, response: Response) {
    // 1. 云端响应没有`Content-Type`字段
    // 2. 云端响应和请求的`Content-type`内容不一样
    const contentType = response.headers.get('Content-Type') || request.headers.get('Content-Type');
    if (contentType?.includes('application/json')) {
      return response.json();
    }
    if (contentType?.includes('application/zip')) {
      return response.blob(); // 文件下载
    }
    return response;
  }

  _refreshToken(record?: RefreshTokenQueueRecord) {
    if (typeof this.onRefreshToken !== 'function') {
      console.error('[Http] 没有 onRefreshToken 方法');
      return this.onLogout();
    }
    if (record) {
      this.waitRefreshTokenQueue.push(record);
    }
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;
      this.onRefreshToken()
        .then((data: HttpRefreshResolve) => {
          this.setHeader({
            [TOKEN_KEY]: data.accessToken,
            // [data.tokenKey as keyof HttpOptions['headers']]: data.token,
          });
          while (this.waitRefreshTokenQueue.length) {
            const item = this.waitRefreshTokenQueue.shift();
            if (item) {
              this._fetch(item.method, item.path, item.body, item.config).then(item.resolve).catch(item.reject);
            }
          }
          this.isRefreshingToken = false;
        })
        .catch((error) => {
          console.error('[Http] 换取令牌失败', record?.path, error);
          this.showErrorMessage('登录已过期，请重新登录', 1).then(() => {
            this.waitRefreshTokenQueue = [];
            this.isRefreshingToken = false;
            this.onLogout();
          });
        })
        .finally(() => {
          // 警告: 标识位不能在这里处理, 因为并发请求时, 每个响应都会进`_refreshToken`和`finally`
          // this.isRefreshingToken = false;
        });
    }
  }

  _fetch<T = any>(method: string, path: string, body?: HttpBody, config?: HttpActionConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      const request = this._getRequest(method, path, body, config);
      fetch(request)
        .then((response) =>
          this._handleResponse(request, response).then((result: { code: number; data: T; [index: string]: any }) => {
            // 登录失效, HTTP 状态码 2xx 和 4xx, 都有可能有这个 code
            if (result?.code === 600057) {
              this._refreshToken({ resolve, reject, method, path, body, config });
            }
            // response.status === 200
            else if (response.ok) {
              if (result.code === 200) {
                resolve(result.data); // 业务请求，返回 data
              } else if (typeof result.code === 'undefined') {
                resolve(result as any); // 返回原始数据（例如：文件上传服务 S3 请求）
              } else reject(result);
            } else {
              reject(result);
            }
          }),
        )
        .catch((error: any) => {
          switch (error.name) {
            case 'TypeError': {
              // 实际情况: 前端无网络 || 云端无法连通 || 不支持跨域
              reject({ code: -400, data: error });
              break;
            }
            case 'AbortError': {
              // 实际情况: 前端弱网络 || 云端响应超时，业务感知: 请求超时
              reject({ code: -408, data: error });
              break;
            }
            default: {
              reject({ code: -1, data: error });
            }
          }
        });
    });
  }
}
