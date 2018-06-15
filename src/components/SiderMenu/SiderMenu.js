import React from 'react';
import PropTypes from 'prop-types'
import { Menu, Icon, Layout } from 'antd';
import { Link } from 'dva/router';
import styles from './SiderMenu.less';
import lodash from 'lodash';

const { Sider } = Layout;

/**
 * 获取图标表达式，支持antd图标和http远程图标两种方式
 * @param {图标字符串} icon 
 */
const getIcon = (icon) => {
  if (typeof icon === 'string' && icon.indexOf('http') === 0) {
    return <img src={icon} alt="icon" className={styles.icon} />;
  }
  if (typeof icon === 'string') {
    return <Icon type={icon} />;
  }
  return icon;
};


/**
 * 数组格式转树状结构
 * @param   {array}     array 输入数组
 * @param   {Array}     idsHasLeaf 额外输出包含子节点的所有节点ID
 * @param   {String}    id 唯一标识ID的key
 * @param   {String}    pid 父ID的key
 * @param   {String}    children 子节点的key
 * @return  {Array}
 */
const arrayToTree = (array, idsHasLeaf, id = 'menuId', pid = 'pMenuId', children = 'children') => {
  let result = [];
  if (array) {
    let data = lodash.cloneDeep(array);
    let hash = {};
    data.forEach(item => hash[item[id]] = item);

    data.forEach(item => {
      let hashVP = hash[item[pid]];
      if (hashVP) {
        !hashVP[children] && (hashVP[children] = []) && idsHasLeaf && idsHasLeaf.push(hashVP[id]);
        hashVP[children].push(item);
      } else {
        result.push(item);
      }
    });
  }
  return result
};


/**
 * 自动化菜单，根据树形数据自动生成的菜单
 */
class SiderMenu extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openKeys: this.props.defaultOpenKeys,
    }
  }


  // 递归生成菜单
  getMenus = (menuTree) => {
    return menuTree.map(item => {
      if (item.children) {
        return (
          <Menu.SubMenu
            key={item.menuId}
            title={<span>
              {item.icon ? getIcon(item.icon) : <Icon type="calendar" />}
              <span>{item.menuName}</span>
            </span>}
            style={{ fontSize: '14px' }}
          >
            {this.getMenus(item.children)}
          </Menu.SubMenu>
        )
      } else {
        return (
          <Menu.Item key={item.menuId}>
            {this.getMenuItemPath(item)}
          </Menu.Item>
        )
      }
    })
  };

  /**
  * 判断是否是http链接.返回 Link 或 a
  * Judge whether it is http link.return a or Link
  * @memberof SiderMenu
  */
  getMenuItemPath = (item) => {
    const itemPath = this.conversionPath(item.cUrl);
    const icon = getIcon(item.icon);
    const { target } = item;
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          {item.icon ? icon : <Icon type="calendar" />}
          {<span>{item.menuName}</span>}
        </a>
      );
    }
    return (
      <Link to={itemPath} replace={itemPath === this.props.pathname}>
        {item.icon ? icon : <Icon type="calendar" />}
        {<span>{item.menuName}</span>}
      </Link>
    );
  }

  // conversion Path
  // 转化路径
  conversionPath = (path) => {
    if (path && path.indexOf('http') === 0) {
      return path;
    } else {
      return `/${path || ''}`.replace(/\/+/g, '/');
    }
  }

  /**判断当前打开的目录是否为一级目录，如果是，则关闭其他打开的菜单,如果不是
   * 说明有可能打开的是二级目录，那么打开相应的二级目录
   */
  onOpenChange = (openKeys) => {
    const lastOpenKey = openKeys[openKeys.length - 1];
    const isMainMenu = this.rootSubmenuKeys.some(
      item => lastOpenKey && (item === lastOpenKey)
    );
    this.setState({
      openKeys: isMainMenu ? [lastOpenKey] : [...openKeys],
    });
  }


  render() {

    //计算props的衍生变量，注意顺序
    const { menuData, collapsed, pathname, acitveMenuKeys, ...rest } = this.props;
    if (!menuData) return null; //如果menuData为空，则不渲染此组件

    this.rootSubmenuKeys = menuData.map(item => item.menuId); //一级目录的key数组，onChange方法要用到 
    const menuItems = this.getMenus(arrayToTree(menuData)) || [];

    //开始渲染
    return (
      <div>

        <Sider
          trigger={null}
          width={220}
          collapsible
          collapsed={collapsed || false}
          style={{ display: menuItems.length === 0 && 'none', background: '#FFFFFF' }}
          className={styles.sider}
        >
          <Menu
            mode='inline'
            defaultOpenKeys={this.props.defaultOpenKeys}
            selectedKeys={acitveMenuKeys}
            onOpenChange={this.onOpenChange}
            openKeys={this.state.openKeys}
            {...rest}
          >
            {menuItems}
          </Menu>
        </Sider>
      </div>
    );
  }
}

SiderMenu.propTypes = {
  menuData: PropTypes.array,
  acitveMenuKeys: PropTypes.array,
  pathname: PropTypes.string,
  theme: PropTypes.string,
  collapsed: PropTypes.bool,
};

SiderMenu.defaultProps = {
  theme: 'light',
};

export default SiderMenu;
