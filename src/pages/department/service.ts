import request from '@/utils/request';
import { TableListParams, AddParams } from './data.d';

export async function detail(id: string) {
  return request(`/api/biz/organization/${id}`, {
    method: 'GET',
  });
}

// 通过组织ID搜索用户分页记录
export async function user_node(id: string) {
  return request(`/api/biz/user/node/${id}`, {
    params: {
      flag: true
    },
    method: 'POST'
  });
}

// 单位树结构
export async function department_query() {
  return request('/api/biz/department/all');
}
export async function query(data: {
  orgfrom: 'TREETS' | 'CHECKIN'
}) {
  return request('/api/biz/organization/query', {
    data,
    method: 'POST'
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
