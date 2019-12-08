import request from '@/utils/request';

export async function Common_Enum(name: string) {
  return request(`/api/biz/common/enum/${name}`);
}

export async function Common_Dictionary(name: string) {
  return request(`/api/biz/common/dictionary/${name}`);
}
