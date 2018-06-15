import globalData from "/project.config";
import request from '/utils/request';

export async function queryRoleList(values) {
    return request(globalData.proxyUrl + '/v1/roleInfo/', {
        method: 'GET',
        body: values,
    });
}

/***
 * @name 新增角色接口
 * @param values
 */

export async function addRoleService(values) {
    return request(globalData.proxyUrl + '/v1/roleInfo/', {
        method: 'POST',
        body: values,
    });
}


/**
 * @name 删除角色
 * @param values
 */
export async function removeRoleService(values) {
    return request(globalData.proxyUrl + '/v1/roleInfo/del', {
        method: 'POST',
        body: values,
    });
}



/**
 * 修改角色
 * @param values
 */
export async function changeRoleService(values) {
    return request(globalData.proxyUrl + '/v1/roleInfo/upd', {
        method: 'POST',
        body: values,
    });
}


/**
 * 查询
 * @param values
 */
export async function queryRoleManageList(whereStr) {
    return request(globalData.proxyUrl + '/v1/userRoleInfo/', {
        method: 'GET',
        body: whereStr,
    });
}

/**
 * 获取用户列表
 * @param values
 */
export async function getUsers(values) {
    return request(globalData.proxyUrl + '/v1/userInfo/', {
        method: 'GET',
        body: values,
    });
}

/**
 * 多用户分配给单角色接口
 * @param values
 */
export async function setRoles(values) {
    return request(globalData.proxyUrl + '/v1/userRoleInfo/', {
        method: 'POST',
        body: values,
    });
}

/**
 * @name 删除用户角色关联关系接口
 * @param values
 * @returns {Promise.<Object>}
 */
export async function deleteRoleAndUser(values) {
    return request(globalData.proxyUrl + '/v1/userRoleInfo/del', {
        method: 'POST',
        body: values,
    });
}


