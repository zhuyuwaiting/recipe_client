import { queryMedicine, removeMedicine, addMedicine, updateMedicine } from '@/services/api';

export default {
  namespace: 'medicine',

  state: {
      list: [],
      pagination: {},
      success:true,
      enumInfos:{},
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
      if(response.success){
        yield put({
          type: 'addSuccess',
          payload: response,
        });
      }
      if (callback) callback(response.success);
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeMedicine, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response.success);
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateMedicine, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response.success);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload.medicineVOS,
        pagination:action.payload.pagination,
        success:action.payload.success,
        enumInfos:action.payload.enumInfos,
      };
    },

    addSuccess(state, action) {
      state.list.unshift(action.payload.medicineVO)
      return {
        ...state,
        success:action.payload.success,
      };
    },
  },
};
