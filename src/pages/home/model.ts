import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { desktop_count } from './service';

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
    count: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'namespace_home',

  state: {
    data: {
      list: [],
    },
  },

  effects: {
    *count({ payload }, { call, put }) {
      const response: ResParams<TableListItem[]> = yield call(desktop_count);
      console.log(response)
      yield put({
        type: 'save',
        payload: {
          response,
        },
      });
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
