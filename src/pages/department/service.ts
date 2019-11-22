import request from '@/utils/request';
import { TableListParams, AddParams } from './data.d';

export async function detail(id: string) {
  return request(`/api/biz/department/${id}`, {
    method: 'GET',
  });
}

export async function query() {
  return request('/api/biz/department/all');
}

export async function remove(ids: string[]) {
  return request(`/api/biz/department/${ids}`, {
    method: 'DELETE',
  });
}

export async function add(params: AddParams) {
  return request('/api/biz/department', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function update(params: TableListParams) {
  return request('/api/biz/department', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
