import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { add, query, remove, update } from './service';

import { TableListData, TableListItem } from './data.d';
import { array } from 'prop-types';

export interface StateType {
  data: {
    list: TableListData[];
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
  namespace: 'namespace_department',

  state: {
    data: {
      list: [],
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response: ResParams<TableListItem[]> = yield call(query, payload);
      // 递归
      function recursive(arr: any) {
        if (arr instanceof Array) {
          arr.forEach(item => {
            // item.key = item.id
            if (item.children.length) {
              item.children = recursive(item.children);
            } else {
              item.children = undefined;
            }
          });
        }
        return arr;
      }
      let list = [];
      list = recursive(response.data);
      console.log(list);
      yield put({
        type: 'save',
        payload: {
          list,
        },
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response: ResParams2 = yield call(add, payload);
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(remove, payload);
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
