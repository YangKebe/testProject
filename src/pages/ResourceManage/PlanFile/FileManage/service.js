import request from '/utils/request';
import globalData from '/project.config';
import tableConfig from './config.json';
import modalConfig from '../../RegulatoryPlan/RegulatoryPlanManage/config.json';


export async function queryRecords(whereStr) {
    return request(globalData.proxyUrl + `/${tableConfig.pageTag}/query`, {
        method: 'GET',
        body: whereStr,
    });
}

export async function deleteRecord(data) {
    return request(globalData.proxyUrl + `/${tableConfig.pageTag}/delete`, {
        method: 'GET',
        body: data,
    });
}

export async function submitNew(values) {
    return request(globalData.proxyUrl + `/${tableConfig.pageTag}/insert`,  {
        method: 'POST-MULTIPART',
        body: values,
    });
}

export async function modifyRecord(values) {
    return request(globalData.proxyUrl + `/${tableConfig.pageTag}/upd`,{
        method: 'POST-MULTIPART',
        body: values,
    });
}

export async function queryPlanfileId(whereStr) {
    return request(globalData.proxyUrl + `/${tableConfig.pageTag}/query`, {
        method: 'GET',
        body: whereStr,
    });
}

export async function queryModalData(whereStr) {
    return request(globalData.proxyUrl + `/${modalConfig.pageTag}/query`, {
        method: 'GET',
        body: whereStr,
    });
}