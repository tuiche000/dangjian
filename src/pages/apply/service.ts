import request from '@/utils/request';
import { TableListParams, AddParams } from './data.d';

export async function userQuery() {
  return request('/api/biz/user/query', {
    params: {
      pageNo: 1,
      pageSize: 999
    },
  });
}

export async function detail(id: string) {
  return request(`/api/biz/apply/${id}`, {
    method: 'GET',
  });
}

export async function query(params: TableListParams) {
  return request('/api/biz/apply/query', {
    params,
  });
}

export async function remove(ids: string[]) {
  return request(`/api/biz/apply/${ids}`, {
    method: 'DELETE',
  });
}

export async function add(params: AddParams) {
  return request('/api/biz/apply', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function update(params: TableListParams) {
  return request('/api/biz/apply', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
