import { queryMedicine, removeMedicine, addMedicine, updateMedicine } from '@/services/api';
import { message } from 'antd';
export default {
  namespace: 'medicine',

  state: {
      list: [],
      pagination: {},
      success:true,
      enumInfos:{},
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryMedicine, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response.success);
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
      if(response.success){
        yield put({
          type: 'delSuccess',
          payload:payload,
        });
      }
      if (callback) callback(response.success);
    },
    *batchRemove({ payload, callback }, { call, put }) {
      const response = yield call(removeMedicine, payload);
      if(response.success){
        message.success('批量删除成功');
        yield put({
          type: 'fetch',
          payload:{
            type:"CHINESE_MEDICINE",
          },
        });
      }
      if (callback) callback(response.success);
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateMedicine, payload);
      if(response.success){
        yield put({
          type: 'updateSuccess',
          payload: response,
        });
      }
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

    delSuccess(state, action) {
      state.list.splice(action.payload.index,1);
      return {
        ...state,
        success:action.payload.success,
      };
    },

    updateSuccess(state, action) {
      for(var i = 0; i < state.list.length; i++) {
         if(state.list[i].medicineNo == action.payload.medicineVO.medicineNo){
           state.list[i] = action.payload.medicineVO
         }
      }
      return {
        ...state,
        success:action.payload.success,
      };
    },
  },
};
