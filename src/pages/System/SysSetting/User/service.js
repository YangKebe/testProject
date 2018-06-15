import request from '/utils/request';
import globalData from '/project.config';
import tableConfig from './config.json';


export async function queryRecords(whereStr) {
    return request(globalData.proxyUrl + `/v1/${tableConfig.pageTag}`, {
        method: 'GET',
        body: whereStr,
    });
}

export async function deleteRecord(data) {
    return request(globalData.proxyUrl + `/v1/${tableConfig.pageTag}/del`, {
        method: 'POST',
        body: data,
    });
}

export async function submitNew(values) {
    return request(globalData.proxyUrl + `/v1/${tableConfig.pageTag}`, {
        method: 'POST',
        body: values,
    });
}

export async function modifyRecord(values) {
    return request(globalData.proxyUrl + `/v1/${tableConfig.pageTag}/upd`, {
        method: 'POST',
        body: values,
    });
}

/**
 *  密码修改接口
 * @returns {Promise.<Object>}
 */
export async function queryPasswordModify(payload) {
    return request(globalData.proxyUrl + '/v1/password/modify', {
        method: 'POST',
        body: payload,
    });
}


/**
 * 密码重置接口
 * @returns {Promise.<Object>}
 */
export async function queryPasswordReset(payload) {
    return request(globalData.proxyUrl + `/v1/password/reset`, {
        method: 'POST',
        body: payload,
    });
}



/**
 *账号状态变更接口（账号冻结）
 * @returns {Promise.<Object>}
 */
export async function queryAmendUserStatus(payload) {
    return request(globalData.proxyUrl + `/v1/userInfo/userStatus`, {
        method: 'POST',
        body: payload,
    });
}

/**
 * 单用户分配多角色接口
 * @returns {Promise.<Object>}
 */
export async function queryOneUserRoleAllot(payload) {
    return request(globalData.proxyUrl + `/v1/userRoleInfo/oneUserRoleInfo`, {
        method: 'POST',
        body: payload,
    });
}

/**
 *  单用户所属角色查询接口
 * @returns {Promise.<Object>}
 */
export async function queryOneUserRoleInfo(payload) {
    return request(globalData.proxyUrl + `/v1/userRoleInfo/oneUserRoleInfo`, {
        method: 'GET',
        body: payload,
    });
  }
  