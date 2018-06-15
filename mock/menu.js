import qs from 'qs';

// 数据持久化   保存在global的全局变量中
let tableListDataForMenu = {};
//
// if (!global.tableListDataForMenu) {
const commonProps = { cUrl: '', icon: null, sort: 1000, isProto: 0, isShow: 0, remark: null, };
const data = [
    { menuId: '102001001', menuName: '资源管理', pMenuId: '102001', menuType: '1', ...commonProps, icon: 'bars', cUrl: '/BasicLayout/ResourceManage' },
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

    'POST /api/getMenuData'(req, res) {
        // const param = qs.parse(req.query);
        // let menuType = param.menuType;

        let newData = [...tableListDataForMenu];

        setTimeout(() => {
            res.json({      //将请求json格式返回
                success: true,
                data: newData,
            });
        }, 200);
    }
}

export default myExport;
