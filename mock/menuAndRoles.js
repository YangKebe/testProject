import qs from 'qs';

// 数据持久化   保存在global的全局变量中
let tableListDataForMenu = {};
//
// if (!global.tableListDataForMenu) {
const commonProps = { cUrl: '', icon: null, sort: 1000, isProto: 0, isShow: 0, remark: null, };
const data = [
    { menuId: '102001001', menuName: '资源管理', pMenuId: '102001', menuType: '1', ...commonProps, icon: 'bars', cUrl: '/BasicLayout/ResourceManage' },
    { menuId: '102001001001', menuName: '控制性规划', pMenuId: '102001001', menuType: '1', ...commonProps, icon: 'file-ppt', cUrl: '/BasicLayout/ResourceManage/RegulatoryPlan' },
    { menuId: '102001001001001', menuName: '控规展示', pMenuId: '102001001001', menuType: '0', ...commonProps, icon: 'file-ppt', cUrl: '/BasicLayout/ResourceManage/RegulatoryPlan/RegulatoryPlanView' },
    { menuId: '102001001001002', menuName: '控规管理', pMenuId: '102001001001', menuType: '0', ...commonProps, icon: 'file-ppt', cUrl: '/BasicLayout/ResourceManage/RegulatoryPlan/RegulatoryPlanManage' },
    { menuId: '102001001001003', menuName: '分地块管理', pMenuId: '102001001001', menuType: '0', ...commonProps, icon: 'file-ppt', cUrl: '/BasicLayout/ResourceManage/RegulatoryPlan/RegulatoryPlanSubManage' },
    { menuId: '102001001002', menuName: '专项规划', pMenuId: '102001001', menuType: '1', ...commonProps, icon: 'picture', cUrl: '/BasicLayout/ResourceManage/SubjectPlan' },
    { menuId: '102001001002001', menuName: '雨水', pMenuId: '102001001002', menuType: '0', ...commonProps, icon: 'picture', cUrl: '/BasicLayout/ResourceManage/SubjectPlan/Rain' },
    { menuId: '102001001002002', menuName: '污水', pMenuId: '102001001002', menuType: '0', ...commonProps, icon: 'picture', cUrl: '/BasicLayout/ResourceManage/SubjectPlan/DirtyWater' },
    { menuId: '102001001002003', menuName: '电力', pMenuId: '102001001002', menuType: '0', ...commonProps, icon: 'picture', cUrl: '/BasicLayout/ResourceManage/SubjectPlan/Electric' },
    { menuId: '102001001002004', menuName: '燃气', pMenuId: '102001001002', menuType: '0', ...commonProps, icon: 'picture', cUrl: '/BasicLayout/ResourceManage/SubjectPlan/Gas' },
    { menuId: '102001001002005', menuName: '绿化', pMenuId: '102001001002', menuType: '0', ...commonProps, icon: 'picture', cUrl: '/BasicLayout/ResourceManage/SubjectPlan/Green' },
    { menuId: '102001001002006', menuName: '河道', pMenuId: '102001001002', menuType: '0', ...commonProps, icon: 'picture', cUrl: '/BasicLayout/ResourceManage/SubjectPlan/River' },
    { menuId: '102001001003', menuName: '规划成果', pMenuId: '102001001', menuType: '1', ...commonProps, icon: 'file', cUrl: '/BasicLayout/ResourceManage/PlanFile' },
    { menuId: '102001001003001', menuName: '成果管理', pMenuId: '102001001003', menuType: '1', ...commonProps, icon: 'file', cUrl: '/BasicLayout/ResourceManage/PlanFile/FileManage' },
    { menuId: '102001002', menuName: '系统管理', pMenuId: '102001', menuType: '1', ...commonProps, icon: 'laptop', cUrl: '/BasicLayout/System' },
    { menuId: '102001002001', menuName: '系统配置', pMenuId: '102001002', menuType: '1', ...commonProps, icon: 'laptop', cUrl: '/BasicLayout/System/SysSetting' },
    { menuId: '102001002001001', menuName: '用户管理', pMenuId: '102001002001', menuType: '0', ...commonProps, icon: 'user', cUrl: '/BasicLayout/System/SysSetting/User' },
    { menuId: '102001002001002', menuName: '角色管理', pMenuId: '102001002001', menuType: '0', ...commonProps, icon: 'team', cUrl: '/BasicLayout/System/SysSetting/Role' },
    { menuId: '102001002001003', menuName: '分配角色', pMenuId: '102001002001', menuType: '0', ...commonProps, icon: 'solution', cUrl: '/BasicLayout/System/SysSetting/RoleAssign' },
    { menuId: '102001002001004', menuName: '权限管理', pMenuId: '102001002001', menuType: '0', ...commonProps, icon: 'bank', cUrl: '/BasicLayout/System/SysSetting/Auth' },
    { menuId: '102001002001005', menuName: '菜单管理', pMenuId: '102001002001', menuType: '0', ...commonProps, icon: 'tool', cUrl: '/BasicLayout/System/SysSetting/Menu' },
    { menuId: '102001002001006', menuName: '日志管理', pMenuId: '102001002001', menuType: '0', ...commonProps, icon: 'layout', cUrl: '/BasicLayout/System/SysSetting/Log' },
    { menuId: '102001002002', menuName: '其他设置', pMenuId: '102001002', menuType: '1', ...commonProps, icon: 'file-text', cUrl: '/BasicLayout/System/OtherSetting' },
    { menuId: '102001002002001', menuName: '个人信息', pMenuId: '102001002002', menuType: '0', ...commonProps, icon: 'qq', cUrl: '/BasicLayout/System/OtherSetting/Personal' },
    { menuId: '102001002002002', menuName: '系统信息', pMenuId: '102001002002', menuType: '0', ...commonProps, icon: 'laptop', cUrl: '/BasicLayout/System/OtherSetting/SystemInfo' },
];
tableListDataForMenu = data;
global.tableListDataForMenu = data;
// }
// else {
//   tableListDataForMenu = global.tableListDataForMenu;
//}

const myExport = {

    'POST /api/v1/Auth/setRoleMenus'(req, res) {
        setTimeout(() =>
            res.json({
                "retCode": { "status": "0000" },
                "data": '设置成功',
            }));
    },

    'GET /api/v1/Auth/queryRecords'(req, res) {

        let testData = [
            { roleId: '0', pRoleId: '-1', roleName: '管理员角色组', remark: '管理员角色组', operator: 'admin', operateTime: 32000 },
            { roleId: '0-1', pRoleId: '0', roleName: '系统管理员', remark: '系统管理员', operator: 'admin', operateTime: 32000 },
            { roleId: '0-2', pRoleId: '0', roleName: '部门管理员', remark: '部门管理员', operator: 'admin', operateTime: 32000 },
            { roleId: '1', pRoleId: '-1', roleName: '项目经理组', remark: '项目经理组', operator: 'admin', operateTime: 32000 },
            { roleId: '1-1', pRoleId: '1', roleName: '项目经理', remark: '项目经理', operator: 'admin', operateTime: 32000 },
            { roleId: '1-2', pRoleId: '1', roleName: '技术经理', remark: '技术经理', operator: 'admin', operateTime: 32000 },
            { roleId: '2', pRoleId: '-1', roleName: '设计人员', remark: '设计人员', operator: 'admin', operateTime: 32000 },
            { roleId: '2-1', pRoleId: '2', roleName: '查勘人员', remark: '查勘人员', operator: 'admin', operateTime: 32000 },
            { roleId: '2-2', pRoleId: '2', roleName: '绘图人员', remark: '绘图人员', operator: 'admin', operateTime: 32000 },
        ];

        setTimeout(() =>
            res.json({
                "retCode": { "status": "0000" },
                "data": {
                    resultList: testData,
                    totalRecord: 100
                },
            }));
    },
    'POST /api/v1/Auth/del'(req, res) {

        setTimeout(() =>
            res.json({
                "retCode": { "status": "0000" },
                "data": ''
            }));
    },

    'GET /api/v1/Auth/getMenuKeysByRoleId'(req, res) {
        setTimeout(() =>
            res.json({
                "retCode": { "status": "0000" },
                "data": ['0', '0-1'],
            }));
    },

    'GET /api/v1/menus/userMenusInfo'(req, res) {

        // let newData = [...tableListDataForMenu];

        setTimeout(() => {
            res.json({
                "retCode": {
                    "status": "0000"
                },
                "data": [
                    {
                        "menuId": "111001001",
                        "menuName": "资源管理",
                        "pMenuId": "111001",
                        "cUrl": "/BasicLayout/ResourceManage",
                        "icon": "bars"
                    },
                    {
                        "menuId": "111001002",
                        "menuName": "系统管理",
                        "pMenuId": "111001",
                        "cUrl": "/BasicLayout/System",
                        "icon": "laptop"
                    },
                    {
                        "menuId": "111001002001",
                        "menuName": "系统配置",
                        "pMenuId": "111001002",
                        "cUrl": "/BasicLayout/System/SysSetting",
                        "icon": "laptop"
                    },
                    {
                        "menuId": "111001002001007",
                        "menuName": "机构管理",
                        "pMenuId": "111001002001",
                        "cUrl": "/BasicLayout/System/SysSetting/Org",
                        "icon": "home"
                    },
                    {
                        "menuId": "111001002001001",
                        "menuName": "用户管理",
                        "pMenuId": "111001002001",
                        "cUrl": "/BasicLayout/System/SysSetting/User",
                        "icon": "user"
                    },
                    {
                        "menuId": "111001002001002",
                        "menuName": "角色管理",
                        "pMenuId": "111001002001",
                        "cUrl": "/BasicLayout/System/SysSetting/Role",
                        "icon": "team"
                    },
                    {
                        "menuId": "111001002001004",
                        "menuName": "权限管理",
                        "pMenuId": "111001002001",
                        "cUrl": "/BasicLayout/System/SysSetting/Auth",
                        "icon": "bank"
                    },
                    {
                        "menuId": "111001002001005",
                        "menuName": "菜单管理",
                        "pMenuId": "111001002001",
                        "cUrl": "/BasicLayout/System/SysSetting/Menu",
                        "icon": "tool"
                    },
                    {
                        "menuId": "111001002002",
                        "menuName": "其他设置",
                        "pMenuId": "111001002",
                        "cUrl": "/BasicLayout/System/OtherSetting",
                        "icon": "file-text"
                    },
                    {
                        "menuId": "111001002002001",
                        "menuName": "个人信息",
                        "pMenuId": "111001002002",
                        "cUrl": "/BasicLayout/System/OtherSetting/Personal",
                        "icon": "qq"
                    },
                    {
                        "menuId": "111001002002002",
                        "menuName": "系统信息",
                        "pMenuId": "111001002002",
                        "cUrl": "/BasicLayout/System/OtherSetting/SystemInfo",
                        "icon": "laptop"
                    }
                ]
            });
        }, 200);
    }
}

export default myExport;
