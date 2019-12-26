import request from '@/utils/request';
import { FormDataType } from './index';

export async function fakeAccountLogin(params: FormDataType) {
  return request('/api/biz/user/login', {
    method: 'POST',
    data: params,
  });
}
export async function getUserSelf(token: string) {
  return request('/api/biz/user/self', {
    headers: {
      Authorization: `Bearer ${token || localStorage.getItem('access_token')}`,
    }
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
