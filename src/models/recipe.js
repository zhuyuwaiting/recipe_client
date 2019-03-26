import { queryRecipeList, 
  queryRecipe, removeRecipe, addRecipe,updateRecipe } from '@/services/api';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
export default {
  namespace: 'recipe',

  state: {
      list: [],
      pagination: {},
      success:true,
      enumInfos:{},
      addObject:{},
      updateObject:{},
      queryObject:{},
  },

  effects: {
    *fetch({ payload ,callback}, { call, put }) {
      const response = yield call(queryRecipeList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response.success);
    },
    *query({ payload ,callback}, { call, put }) {
      const response = yield call(queryRecipe, payload);
      yield put({
        type: 'saveQuery',
        payload: response,
      });
      if (callback) callback(response.success,response);
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRecipe, payload);
      if (callback) callback(response.success);
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRecipe, payload);
      if(response.success){
        yield put({
          type: 'delSuccess',
          payload:payload,
        });
      }
      if (callback) callback(response.success);
    },
    *batchRemove({ payload, callback }, { call, put }) {
      const response = yield call(removeRecipe, payload);
      if(response.success){
        message.success('批量删除成功');
        yield put({
          type: 'fetch',
          payload:{
          },
        });
      }
      if (callback) callback(response.success);
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateRecipe, payload);
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
        list: action.payload.recipeInfoVOS,
        pagination:action.payload.pagination,
        success:action.payload.success,
        enumInfos:action.payload.enumInfos,
      };
    },
    saveQuery(state, action) {
      return {
        ...state,
        queryObject: action.payload.recipeInfoVO,
        success:action.payload.success,
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
