import request from '@/utils/request';
import { TableListParams, AddParams } from './data.d';

export async function detail(id: string) {
  return request(`/api/biz/menu/${id}`, {
    method: 'GET',
  });
}

export async function query() {
  return request('/api/biz/menu/all');
}

export async function remove(ids: string[]) {
  return request(`/api/biz/menu/${ids}`, {
    method: 'DELETE',
  });
}

export async function add(params: AddParams) {
  return request('/api/biz/menu', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function update(params: TableListParams) {
  return request('/api/biz/menu', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
