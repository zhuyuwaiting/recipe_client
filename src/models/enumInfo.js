import { queryEnumInfo, addEnumInfo, delEnumInfo } from '@/services/api';
import { message } from 'antd';
export default {
  namespace: 'enumInfo',

  state: {
      list: [],
      pagination: {},
      subList:[],
      success:true,
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
      if(response.success){
        yield put({
          type: 'addSuccess',
          payload: response,
        });
      }
      if (callback) callback(response.success);
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(delEnumInfo, payload);
      if(response.success){
        yield put({
          type: 'removeUpdate',
          payload: {
            findex:payload.findex,
            index:payload.index,
            success:true
          },
        });
      }
      if (callback) callback(response.success);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list:action.payload.response.enumInfoList,
        pagination : action.payload.response.pagination,
        success:action.payload.response.success,
      };
    },

    removeUpdate(state,action){
      state.list[action.payload.findex].enumInfoVOList.splice(action.payload.index,1);
      return {
        ...state,
        success:action.payload.success,
      };
    },

    addSuccess(state,action){
      for(var i = 0; i < state.list.length; i++) {
        if(state.list[i].key == action.payload.enumInfo.key){
          if(!state.list[i].enumInfoVOList){
            state.list[i].enumInfoVOList[0]=(action.payload.enumInfo);
          }else{
            state.list[i].enumInfoVOList.unshift(action.payload.enumInfo);
          }
        }
     };  
       return {
        ...state,
        success:action.payload.success,
      };
    },
  },
};
