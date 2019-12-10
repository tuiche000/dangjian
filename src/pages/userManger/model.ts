import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { add, query, remove, update, status } from './service';

import { TableListData, TableListPagination } from './data.d';

export interface StateType {
  data: {
    list: TableListData[];
    pagination: Partial<TableListPagination>;
  };
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    add: Effect;
    remove: Effect;
    update: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'namespace_userManger',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response: ResParams<TableListData> = yield call(query, payload);
      yield put({
        type: 'save',
        payload: {
          list: response.data.result,
          pagination: {
            total: response.data.totalResults,
            pageSize: response.data.pageSize,
            current: response.data.pageNo,
          },
        },
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response: ResParams2 = yield call(add, payload);
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(status, payload);
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(update, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};

export default Model;
