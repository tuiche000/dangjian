import request from '@/utils/request';
import { TableListParams, AddParams } from './data.d';

export async function departmentAll() {
  return request('/api/biz/department/all');
}

export async function notice(params: {
  activeId: string;
  departmentIds?: string;
}) {
  return request(`/api/biz/activity/notice/${params.activeId}`, {
    method: 'GET',
    params: {
      departmentIds: params.departmentIds
    }
  });
}

export async function qrcode(params: {
  code: string;
  width?: string;
} = {
  code: '',
  width: '100'
  }) {
  return request('/api/biz/wechat/limited', {
    method: 'POST',
    data: {
      ...params,
      path: `pages/huodongba/detail/index?channel=CHECKIN&code=${params.code}`
    },
    responseType: 'blob'
  });
}

export async function detail(id: string) {
  return request(`/api/biz/activity/${id}`, {
    method: 'GET',
  });
}

export async function query(params: TableListParams) {
  return request('/api/biz/activity/query', {
    params,
  });
}

export async function remove(ids: string[]) {
  return request(`/api/biz/activity/${ids}`, {
    method: 'DELETE',
  });
}

export async function add(params: AddParams) {
  return request('/api/biz/activity', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function update(params: TableListParams) {
  return request('/api/biz/activity', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
