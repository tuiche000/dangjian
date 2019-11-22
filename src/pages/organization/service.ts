import request from '@/utils/request';
import { TableListParams, AddParams } from './data.d';

export async function detail(id: string) {
  return request(`/api/biz/organization/${id}`, {
    method: 'GET',
  });
}

export async function query() {
  return request('/api/biz/organization/all');
}

export async function remove(ids: string[]) {
  return request(`/api/biz/organization/${ids}`, {
    method: 'DELETE',
  });
}

export async function add(params: AddParams) {
  return request('/api/biz/organization', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function update(params: TableListParams) {
  return request('/api/biz/organization', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
