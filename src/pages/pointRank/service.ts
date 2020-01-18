import request from '@/utils/request';
import { TableListParams, AddParams } from './data.d';

export async function detail(id: string) {
  return request(`/api/biz/point/${id}`, {
    method: 'GET',
  });
}

export async function query(params: {
  type: 'CHECKIN_ORGANIZATION' | 'CHECKIN_PERSONAL',
  pageSize?: number;
  pageNo?: number;
}) {
  return request(`/api/biz/desktop/board`, {
    params: {
      boardtype: 'CHECKIN_ORGANIZATION',
      ...params
    }
  });
}

export async function remove(ids: string[]) {
  return request(`/api/biz/point/${ids}`, {
    method: 'DELETE',
  });
}

export async function add(params: AddParams) {
  return request('/api/biz/point', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function update(params: TableListParams) {
  return request('/api/biz/point', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
