import request from '@/utils/request';
import { TableListParams, AddParams } from './data.d';

export async function detail(id: string) {
  return request(`/api/biz/organization/${id}`, {
    method: 'GET',
  });
}

// 通过组织ID搜索用户分页记录
export async function user_node(id: string, params: {
  flag: boolean;
}) {
  return request(`/api/biz/user/node/${id}`, {
    params,
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
  return request('/api/biz/organization/querylist', {
    data,
    method: 'POST'
  });
}

export async function userQuery(id: string) {
  return request('/api/biz/user/query', {
    data: {
      organizationId: id,
      organizationFrom: 'TREETS'
    },
    params: {
      pageSize: 999
    },
    method: 'POST'
  });
}


// 根据条件导出组织机构报表
export async function organizationExport(data: {
  orgfrom: 'TREETS' | 'CHECKIN'
}) {
  return request('/api/biz/organization/query/export', {
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
