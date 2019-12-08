import request from '@/utils/request';
import { TableListParams, AddParams } from './data.d';

export async function detail(id: string) {
  return request(`/api/biz/user/${id}`, {
    method: 'GET',
  });
}

export async function query(params: TableListParams) {
  return request('/api/biz/user/query', {
    params,
    method: 'POST',
  });
}

export async function remove(ids: string[]) {
  return request(`/api/biz/user/${ids}`, {
    method: 'DELETE',
  });
}

export async function add(params: AddParams) {
  return request('/api/biz/user', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function update(params: TableListParams) {
  return request('/api/biz/user', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
