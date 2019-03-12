import { queryMedicine, removeMedicine, addMedicine, updateMedicine } from '@/services/api';

export default {
  namespace: 'medicine',

  state: {
      list: [],
      pagination: {},
      success:true,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryMedicine, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addMedicine, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeMedicine, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateMedicine, payload);
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
        list: action.payload.medicineVOS,
        pagination:action.payload.pagination,
        success:action.payload.success,
      };
    },
  },
};
