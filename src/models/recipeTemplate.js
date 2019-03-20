import { queryRecipeTemplate, removeRecipeTemplate, addRecipeTemplate, updateRecipeTemplate } from '@/services/api';
import { message } from 'antd';
export default {
  namespace: 'recipeTemplate',

  state: {
      list: [],
      pagination: {},
      success:true,
      enumInfos:{},
      addObject:{},
      updateObject:{}
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRecipeTemplate, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRecipeTemplate, payload);
      if(response.success){
        yield put({
          type: 'addSuccess',
          payload: response,
        });
      }
      if (callback) callback(response.success);
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRecipeTemplate, payload);
      if(response.success){
        yield put({
          type: 'delSuccess',
          payload:payload,
        });
      }
      if (callback) callback(response.success);
    },
    *batchRemove({ payload, callback }, { call, put }) {
      const response = yield call(removeRecipeTemplate, payload);
      if(response.success){
        message.success('批量删除成功');
        yield put({
          type: 'fetch',
          payload:{
            type:"WESTERN_MEDICINE",
          },
        });
      }
      if (callback) callback(response.success);
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateRecipeTemplate, payload);
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
        list: action.payload.recipeTemplateVOS,
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
