import dynamic from 'dva/dynamic';
import projectConfig from './project.config.json';
import {Select} from 'antd';

let globalData = {
    ...projectConfig, //全局静态配置
    mockUrl: '/api',
    proxyUrl: '/test',
    wuyeUrl: '/wuye',//临时
    userId: localStorage.getItem(projectConfig.sysCode + "userId") || "admin",
    userName: localStorage.getItem(projectConfig.sysCode + "userName") || '管理员',
    orgId: localStorage.getItem(projectConfig.sysCode + "orgId") || "",
    orgName: localStorage.getItem(projectConfig.sysCode + "orgName") || '',
    token: localStorage.getItem(projectConfig.sysCode + "token") || '',
    userModel:null,
    menuData: [], //菜单数据
    routeData: null,
    dicData: [], //全局字典对象，两个属性：typeId,typeName
    upLoadConfig: {
        name: 'file',
        action: this.homeUrl + 'v1/excel',
        showUploadList: false,
    },
    afterLoginSuccess: res => {
        localStorage.setItem(this.default.sysCode + "token", res.token);
        localStorage.setItem(this.default.sysCode + "userId", res.userModel.userId);
        localStorage.setItem(this.default.sysCode + "userName", res.userModel.userId);
        localStorage.setItem(this.default.sysCode + "orgId", res.userModel.orgId);
        localStorage.setItem(this.default.sysCode + "orgName", res.userModel.orgName);
        this.default.token = res.token;
        this.default.userId = res.userModel.userId;
        this.default.userName = res.userModel.userName;
        this.default.orgId = res.userModel.orgId;
        this.default.orgName = res.userModel.orgName;
        this.default.userModel = res.userModel;
    },

}

/**
 * 以下是全局使用的方法
 * 1、字典相关方法
 */

//根据字典ID，获取对应的中文名(原exChangeDictionary)
export function getDicNameById(id) {
    const re = globalData.dicData.find(item => item.typeId == id);
    return re && re.typeName || id;
}

//根据字典中文，获取对应的id
export function getDicIdByName(name) {
    const re = globalData.dicData.find(item => item.typeName === name);
    return re && re.typeId || 0;
}

//根据字典中文，获取对应的keyValue
export function getDicValueByName(name) {
    const re = globalData.dicData.find(item => item.typeName === name);
    return re && re.keyValue || 0;
}

//根据pTypeId，获得所有选择项目,用,分开
export function getSelectionsByPid(pid) {
    let selections = globalData.dicData
        .filter(the => the.pTypeId === pid)
        .map(the => ({
            typeId: the.typeId,
            typeName: the.typeName
        }));
    return selections;
}

//模糊查询,树形结构的时候用
export function getSelectionsTreeByPid(code) {
    return globalData.dicData.filter(the => the.pTypeId.toString().startsWith(code + ''));
}

//根据code获取Select中所有的值
export function getOptionsByPid(code) {
    let re = globalData.dicData.filter(the => the.pTypeId === code)
        .map(the => { return { lable: the.typeName, value: the.typeId } })
    return re;
};

//根据code获取树的路径，返回数组
export function getTreePathByPid(code) {
    let arr = globalData.dicData.filter(the => (code + '').startsWith(the.typeId))
        .map(the => the.typeId);
    arr.sort((a, b) => a.length - b.length);
    if(arr.length>0) arr = arr.slice(1); //
    return arr;
};

/**
 * 输出页面配置参数
 * @param {} app 
 */
export function getRouterData(app) {
    if (!globalData.routeData) {
        globalData.routeData = {};
        Object.keys(projectConfig.pages).forEach(key => {
            let item = projectConfig.pages[key];
            let dynamicPara = { app, component: () => require(`${item.component}`).default };
            if (item.models) {
                if (Array.isArray(item.models)) {
                    dynamicPara['models'] = () => item.models.map(modelStr => require(`${modelStr}`).default);
                }
                else {
                    dynamicPara['models'] = () => [require(`${item.models}`).default];
                }
            }

            globalData.routeData[key] = { ...item, component: dynamic(dynamicPara) };

        });
    }
    return globalData.routeData;
}


/**
     * 生成下拉选项
     * @param {*可以为带typeId和typeName属性的数组，也可以是,分隔的字符串} option 
     */
   export function GetOption(option, typeIsNumber = true) {
        let arr;
        if (!Array.isArray(option)) {
            arr = option.split(',').map(the => {
                const tempArr = the.split('|');
                return {
                    typeId: typeIsNumber ? Number(tempArr[0]) : tempArr[0],
                    typeName: tempArr.length > 0 ? tempArr[1] : tempArr[0],
                }
            });
        } else {
            arr = option;
        }
        return arr.map(
            optionValue => {
                const value = optionValue.typeId;
                const displayName = optionValue.typeName;
                return (<Select.Option value={value} key={Math.random()} style={{ height: '32px' }}>
                    {displayName}
                </Select.Option>)
            }
        );
    }


export default globalData;

