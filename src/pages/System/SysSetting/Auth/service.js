import request from '/utils/request';
import globalData from '/project.config';


// let thisInterface = {
//     para: {
//         rows: 999, //一页多少行
//         page:1, //第几页
//         key1:'admin', //查询条件1
//         key2:'122'//查询条件2
//     },
//     res: {
//         "retCode": { "status": "0000" },
//         "data": ['表格信息'],
//     }
// }

export async function queryRecords(data) {
    return request(globalData.proxyUrl + `/v1/roleInfo`, {
        method: 'GET',
        body: {...data, sysCode:111001}
    });
}


// let thisInterface = {
//     para: {
//         keys: '12001,13002,13004',
//         operator: 'userId',
//         status: 101003
//     },
//     res: {
//         "retCode": { "status": "0000" },
//         "data": '',
//     }
// }
export async function deleteRecord(data) {
    return request(globalData.proxyUrl + `/v1/roleInfo/del`, {
        method: 'POST',
        body: data,
    });
}


// let thisInterface = {
//     para: {
//         roleId: 'admin',
//         menus: ['0', '0-1']
//     },
//     res: {
//         "retCode": { "status": "0000" },
//         "data": '设置成功',
//     }
// }

export async function setRoleMenus(data) {
    return request(globalData.proxyUrl + `/v1/menus/roleMenusInfo`, {
        method: 'POST',
        body: {...data,sysCode:111001}
    });
}


// let thisInterface = {
//     para: 'admin',
//     res: {
//         "retCode": { "status": "0000" },
//         "data": ['0', '0-1'],
//     }
// }

export async function getMenuKeysByRoleId(roleId) {
    let res = request(globalData.proxyUrl + `/v1/menus/roleMenusInfo`, {
        method: 'GET',
        body: {roleId,sysCode:111001},
    })

    return res;
}

