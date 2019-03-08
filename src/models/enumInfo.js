import { queryEnumInfo, addEnumInfo, delEnumInfo } from '@/services/api';

export default {
  namespace: 'enumInfo',

  state: {
      list: [],
      pagination: {},
      subList:[],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryEnumInfo, payload);
      yield put({
        type: 'save',
        payload: {
          response:response,
          key:payload.key,
        },
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addEnumInfo, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(delEnumInfo, payload);
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
        list:action.payload.response.enumInfoList,
        pagination : action.payload.response.pagination,
      };
    },
  },
};
