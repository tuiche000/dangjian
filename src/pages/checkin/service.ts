import request from '@/utils/request';
import { TableListParams, AddParams } from './data.d';

export async function audit(params: {
  checkinId: string;
  auditType: 'AUDITING' | 'REFUSED' | 'PASSED';
  pointType: 'CHECKIN' | 'ACTIVE';
}) {
  return request(`/api/biz/checkin/audit`, {
    method: 'POST',
    params: params,
  });
}

export async function detail(id: string) {
  return request(`/api/biz/checkin/${id}`, {
    method: 'GET',
  });
}

export async function query(data: TableListParams) {
  return request('/api/biz/checkin/query', {
    method: 'POST',
    params: {
      pageSize: data.pageSize,
      pageNo: data.pageNo,
    },
    data,
  });
}

export async function remove(ids: string[]) {
  return request(`/api/biz/checkin/${ids}`, {
    method: 'DELETE',
  });
}

export async function add(params: AddParams) {
  return request('/api/biz/checkin', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function update(params: TableListParams) {
  return request('/api/biz/checkin', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
