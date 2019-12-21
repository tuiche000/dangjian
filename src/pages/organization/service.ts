import request from '@/utils/request';
import { TableListParams, AddParams } from './data.d';

export async function detail(id: string) {
  return request(`/api/biz/organization/${id}`, {
    method: 'GET',
  });
}

// 单位树结构
export async function department_query() {
  return request('/api/biz/department/all');
}
export async function query(params: {
  orgfrom: 'TREETS' | 'CHECKIN'
}) {
  return request('/api/biz/organization/all', {
    params
  });
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
