import globalData from "/project.config";
import request from '/utils/request';

/**
 * 获取组织机构集合
 * @param payload
 * @returns {Promise.<Object>}
 */
export async function queryOrganizationTreeList(values) {
    return request(globalData.proxyUrl + '/v1/organization/', {
        method: 'GET',
        body: values,
    });
}

/**
 *根据ID查询组织机构
 * @param payload
 * @returns {Promise.<Object>}
 */
export async function queryOrganizationById(values) {
    return request(globalData.proxyUrl + '/v1/organization/', {
        method: 'GET',
        body: values,
    });
}

/**
 * 添加组织机构
 * @param payload
 * @returns {Promise.<Object>}
 */
export async function queryAddChildrenOrganization(values) {
    return request(globalData.proxyUrl + '/v1/organization/', {
        method: 'POST',
        body: values,
    });
}

/**
 * 删除组织机构
 * @param payload
 * @returns {Promise.<Object>}
 */
export async function queryDeleteOrganization(values) {
    return request(globalData.proxyUrl + '/v1/organization/del', {
        method: 'POST',
        body: values,
    });
}

/**
 * 修改组织机构信息接口
 * @param payload
 * @returns {Promise.<Object>}
 */
export async function queryUpDataOrganizationInfo(values) {
    return request(globalData.proxyUrl + '/v1/organization/upd', {
        method: 'POST',
        body: values,
    });
}