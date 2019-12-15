import request from '@/utils/request';
import { TableListParams, AddParams } from './data.d';

export async function departmentAll() {
  return request('/api/biz/department/all');
}

export async function notice(params: { activeId: string; departmentIds?: string }) {
  return request(`/api/biz/activity/notice/${params.activeId}`, {
    method: 'GET',
    params: {
      departmentIds: params.departmentIds,
    },
  });
}

export async function qrcode(
  params: {
    code: string;
    width?: string;
    channel: 'CHECKIN' | undefined;
  } = {
      code: '',
      width: '100',
      channel: 'CHECKIN',
    },
) {
  let path = params.channel
    ? `pages/huodongba/detail/index?channel=CHECKIN&code=${params.code}`
    : `pages/huodongba/detail/index?code=${params.code}`;
  return request('/api/biz/wechat/limited', {
    method: 'POST',
    data: {
      ...params,
      path,
    },
    responseType: 'blob',
  });
}

export async function apply(
  data: {
    activeId?: string;
    pageNo?: number;
    pageSize?: number;
  } = {},
) {
  return request('/api/biz/apply/query', {
    method: 'POST',
    data,
  });
}

export async function audit(
  data: {
    activity?: string;
    member?: string;
    point?: string;
  } = {},
) {
  return request('/api/biz/apply/audit', {
    method: 'POST',
    data: [data],
  });
}

export async function check(params: { pageSize: number; pageNo: number; activeId: string }) {
  return request(`/api/biz/activity/check`, {
    data: params,
    method: 'POST',
  });
}

export async function detail(id: string) {
  return request(`/api/biz/activity/${id}`, {
    method: 'GET',
  });
}

export async function status(params: {
  id: string;
  enabled: boolean;
}) {
  return request(`/api/biz/activity/status/${params.id}`, {
    method: 'GET',
    params: {
      enabled: params.enabled
    }
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
