import request from '@/utils/request';
import { stringify } from 'qs';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params = {}) {
  return request(`/api/rule?${stringify(params.query)}`, {
    method: 'POST',
    body: {
      ...params.body,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile(id) {
  return request(`/api/profile/basic?id=${id}`);
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function accountLogin(params) {
  return request('/api/user/login', {
    method: 'POST',
    body: params,  
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices(params = {}) {
  return request(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}



// ------------------------medicine---------------------


export async function queryMedicine(params) {
  return request(`/api/medicine/list?${stringify(params)}`);
}

export async function removeMedicine(params) {
  return request('/api/medicine/del', {
    method: 'POST',
    body: params,
  });
}

export async function addMedicine(params) {
  return request('/api/medicine/add', {
    method: 'POST',
    body:params,
  });
}

export async function updateMedicine(params = {}) {
  return request(`/api/medicine/update`, {
    method: 'POST',
    body: params,
  });
}



export async function queryEnumInfo(params) {
  return request(`/api/enumInfo/list?${stringify(params)}`);
}

export async function delEnumInfo(params) {
  return request('/api/enumInfo/del', {
    method: 'POST',
    body: params,
  });
}

export async function addEnumInfo(params) {
  return request('/api/enumInfo/add', {
    method: 'POST',
    body:params,
  });
}



// ------------------------medicine---------------------


export async function queryRecipeTemplateList(params) {
  return request(`/api/recipeTemplate/list?${stringify(params)}`);
}

export async function queryRecipeTemplate(params) {
  return request(`/api/recipeTemplate/query?${stringify(params)}`);
}

export async function removeRecipeTemplate(params) {
  return request('/api/recipeTemplate/del', {
    method: 'POST',
    body: params,
  });
}

export async function addRecipeTemplate(params) {
  return request('/api/recipeTemplate/add', {
    method: 'POST',
    body:params,
  });
}

export async function updateRecipeTemplate(params = {}) {
  return request(`/api/recipeTemplate/update`, {
    method: 'POST',
    body: params,
  });
}

//----------------


export async function queryRecipeList(params) {
  return request(`/api/recipe/list?${stringify(params)}`);
}

export async function queryRecipe(params) {
  return request(`/api/recipe/query?${stringify(params)}`);
}

export async function removeRecipe(params) {
  return request('/api/recipe/del', {
    method: 'POST',
    body: params,
  });
}

export async function addRecipe(params) {
  return request('/api/recipe/add', {
    method: 'POST',
    body:params,
  });
}

export async function updateRecipe(params = {}) {
  return request(`/api/recipe/update`, {
    method: 'POST',
    body: params,
  });
}

