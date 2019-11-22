export interface TableListItem {
  id: string;
  menu: number;
  fileType: 'IMAGE' | 'VIDEO' | 'FILE';
  platformType: 'DEFAULT' | 'ANDROID' | 'IOS' | 'WAP' | 'WEB';
  name: string;
  slogan: string;
  targetType: string;
  image: string;
  target: string;
  displayOrder: number;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  pageNo: number;
  pageSize: number;
  totalPage: number;
  totalResults: number;
  tookInMillis: number;
  result: TableListItem[];
}

export interface TableListParams {
  keyword: string;
  pageNo: number;
  pageSize: number;
}

export interface AddParams {
  name: string;
  fileType: 'IMAGE' | 'VIDEO' | 'FILE';
  displayOrder: number;
  image: string;
  [propName: string]: any;
}
