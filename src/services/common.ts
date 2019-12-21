import request from '@/utils/request';

export async function Common_Enum(name: string) {
  return request(`/api/biz/common/enum/${name}`);
}

export async function Common_Dictionary(name: string) {
  return request(`/api/biz/common/dictionary/${name}`);
}
// 单位树结构
export async function department_query() {
  return request('/api/biz/department/all');
}