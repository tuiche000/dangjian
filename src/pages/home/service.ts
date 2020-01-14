import request from '@/utils/request';
// import { TableListParams, AddParams } from './data.d';

export async function activity_detail(id: string) {
  return request(`/api/biz/activity/${id}`, {
    method: 'GET',
  });
}
export async function desktop_count() {
  return request(`/api/biz/desktop/count`, {
    method: 'GET',
  });
}
export async function desktop_activity(params: {
  beginDate?: string;
  endDate?: string;
  keyword?: string;
}) {
  return request(`/api/biz/desktop/activity/6`, {
    method: 'POST',
    data: params,
  });
}
export async function desktop_checkin() {
  return request(`/api/biz/desktop/checkin/6`, {
    method: 'GET',
  });
}
export async function desktop_board(params: any) {
  return request(`/api/biz/desktop/board`, {
    method: 'GET',
    params,
  });
}
