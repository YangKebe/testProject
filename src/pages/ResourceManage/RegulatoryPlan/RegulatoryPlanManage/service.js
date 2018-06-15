import request from '/utils/request';
import globalData from '/project.config';
import tableConfig from './config.json';
import fileConfig from '../../PlanFile/FileManage/config.json';


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

export async function getRecordDetail(values) {
    return request(globalData.proxyUrl + `/${tableConfig.pageTag}/query`, {
        method: 'GET',
        body: values,
    });
}

export async function getRecordPicList(values) {
    return request(globalData.proxyUrl + `/${fileConfig.pageTag}/query`, {
        method: 'GET',
        body: values,
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

export async function deletePic(data) {
    return request(globalData.proxyUrl + `/${fileConfig.pageTag}/delete`, {
        method: 'GET',
        body: data,
    });
}