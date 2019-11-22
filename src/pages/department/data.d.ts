export interface TableListItem {
  id: number;
  code: string;
  level: number;
  name: string;
  fullname: string;
  displayOrder: number;
  parent?: number;
  key: number;
  title?: string;
  value?: number;
  children?: TableListItem[];
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  data: TableListItem[];
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
  primary: string;
  [propName: string]: any;
}
