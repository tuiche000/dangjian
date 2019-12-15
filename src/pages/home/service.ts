import request from '@/utils/request';
// import { TableListParams, AddParams } from './data.d';

export async function desktop_count() {
  return request(`/api/biz/desktop/count`, {
    method: 'GET',
  });
}