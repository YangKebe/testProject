import pathToRegexp from 'path-to-regexp';



let menuPropsDic = {};
/**
 * 根据原始菜单数据和当前路径获取一二级菜单的属性，主要针对basicLayout
 * @param {*} menuData 
 * @param {*} pathName 
 */
export function getMenuProps(menuData, pathname, pageData) {
    if (!menuData) {
        return null;
    }

    // if (menuPropsDic.hasOwnProperty(pathname)) {
    //     return menuPropsDic[pathname];
    // }

    //计算一级菜单列表，当前使用的规则是：一级菜单的pMenuId为6位数，例如210006
    const topLevelMenus = menuData.filter(item => item.pMenuId.length < 7);

    //计算一级菜单当前选择项
    const topLevelMenuAcitveKey = getCurActiveMainMenuKey(topLevelMenus, pathname, 1);

    //计算二级菜单列表
    const secondLevelMenus = topLevelMenuAcitveKey && menuData.filter(item => item.pMenuId.startsWith(topLevelMenuAcitveKey)) || [];

    //根据当前pathName，计算二级菜单默认打开的keys
    const defaultSecondOpenKeys = getDefaultCollapsedSubMenus(secondLevelMenus, pathname);

    //根据当前pathName，计算二级菜单中当前选中的key
    // const secondLevelMenuAcitveKey = getSelectedMenuKey(pathname, secondLevelMenus);
    const selectedKeys = getSelectedMenuKeys(pathname, secondLevelMenus);
    const secondLevelMenuAcitveKey = selectedKeys[0] || defaultSecondOpenKeys[defaultSecondOpenKeys.length - 1];

    //根据当前的MenuKey，获取对应的入口page对象
    let activeKey = secondLevelMenuAcitveKey || topLevelMenuAcitveKey;
    const theMenu = activeKey && secondLevelMenus.find(the => the.menuId === activeKey);
    const pageObjKey = theMenu && Object.keys(pageData).find(key => pageData[key].path === theMenu.cUrl);
    const pageObj = pageObjKey ? pageData[pageObjKey] : null;

    const mProps = {
        topLevelMenus,
        topLevelMenuAcitveKey,
        secondLevelMenus,
        defaultSecondOpenKeys,
        secondLevelMenuAcitveKey: [secondLevelMenuAcitveKey],
        pageObj,
    };
    menuPropsDic[pathname] = mProps;
    return mProps;
}


/*
*根据history变化获得当前的一级菜单
*默认规则：一级菜单的cUrl的等于当前路径pathname的第三个/之前内容，eg. /basicLayout/System/User =>  /basicLayout/System
*/
function getCurActiveMainMenuKey(mainMenuData, pathname) {
    if (mainMenuData.length === 0) {
        return "";
    }

    let defaultAk = mainMenuData[0].menuId || '';
    let snippets = pathname.split('/');
    if (snippets.length < 3) {
        return defaultAk;
    }

    let curPath = `/${snippets[1]}/${snippets[2]}`;
    let findResult = mainMenuData.find(item => item.cUrl === curPath);

    return findResult && findResult.menuId || defaultAk;
}

/**
 * 根据菜单对象以及路径字符串，获取默认打开的菜单项
 * @param {二级菜单对象，平铺方式，非树状} menuData 
 * @param {history的路径字符串} pathname 
 */
function getDefaultCollapsedSubMenus(menuData, pathname) {
    if (menuData.length === 0) {
        return [];
    };

    let snippets = pathname.split('/');
    snippets.pop();
    snippets.shift();
    snippets = snippets.map((item, index) => {
        if (index > 0) {
            return snippets.slice(0, index + 1).join('/');
        }
        return item;
    });
    let resArr = [];
    snippets.forEach(item => {
        let sKeys = getSelectedMenuKeys(`/${item}`, menuData);
        if (sKeys.length > 0) {
            resArr.push(sKeys[0]);
        }
    });
    return resArr;
}

/**
 * 寻找flatMenus中与path匹配的项
 * eg. /basicLayout/System vs /basicLayout/System/User:id1 => true
 * @param {测试路径} path 
 * @param {菜单对象} flatMenus 
 */
function getSelectedMenuKeys(path, flatMenus) {
    if (flatMenus.length === 0) {
        return [];
    }
    let result = flatMenus.filter(item => pathToRegexp(`${item.cUrl}`).test(path));
    return result.map(item => item.menuId);
}

