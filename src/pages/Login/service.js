
import request from '/utils/request';
import globalData from '/project.config'

export async function loginByToken(params) {
  return request(globalData.mockUrl + '/security/loginByToken', {
    method: 'POST-FORM',
    body: params,
  });
}

export async function loginByPwd(payload) {
  return request(globalData.proxyUrl + '/security/loginByPwd', {
    method: 'POST-FORM',
    body: payload,
  });
}

export async function getMenuData(params) {
  return request(globalData.mockUrl + '/v1/menus/userMenusInfo', {
    method: 'GET',
    body: params,
  });
}

export async function getDictionaries(params) {
  return request(globalData.mockUrl + '/v1/dicList', {
    method: 'GET',
    body: params,
  });
}
