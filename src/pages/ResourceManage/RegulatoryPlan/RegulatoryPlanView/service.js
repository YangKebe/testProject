import request from '/utils/request';
import globalData from '/project.config';
import tableConfig from './config.json';


export async function queryPoints(whereStr) {
    return request(globalData.proxyUrl + `/${tableConfig.pageTag}/query`, {
        method: 'GET',
        body: whereStr,
    });
}