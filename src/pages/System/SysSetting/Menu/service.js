import globalData from "/project.config";
import request from '/utils/request';

/**
 * 获取菜单信息接口
 * @param payload
 * @returns {Promise.<Object>}
 */
export async function queryMenusTreeData(values) {
    return request(globalData.proxyUrl + '/v1/menus', {
        method: 'GET',
        body: values,
    });
}

/**
 *根据ID查询菜单信息
 * @param payload
 * @returns {Promise.<Object>}
 */
export async function queryMenusInfoById(values) {
    return request(globalData.proxyUrl + '/v1/menus', {
        method: 'GET',
        body: values,
    });
}

/**
 * 新增菜单信息接口
 * @param payload
 * @returns {Promise.<Object>}
 */
export async function queryAddChildrenMenu(values) {
    return request(globalData.proxyUrl + '/v1/menus', {
        method: 'POST',
        body: values,
    });
}

/**
 * 删除菜单信息接口
 * @param payload
 * @returns {Promise.<Object>}
 */
export async function queryDeleteMenusInfo(values) {
    return request(globalData.proxyUrl + '/v1/menus/del', {
        method: 'POST',
        body: values,
    });
}

/**
 * 修改菜单信息接口
 * @param payload
 * @returns {Promise.<Object>}
 */
export async function queryUpdataMenusInfo(values) {
    return request(globalData.proxyUrl + '/v1/menus/upd', {
        method: 'POST',
        body: values,
    });
}