import React from 'react';
import Styles from './index.less';
import { Layout, Menu, Icon, Modal } from 'antd';
import PropTypes from 'prop-types';
import { Link } from 'dva/router';

const { Header } = Layout;

export default class MyHeader extends React.PureComponent {

  constructor() {
    super();
    this.state = {
      modalVisible: false,
    }
  }

  static defaultProps = {
    menuData: [],
    curMenuIndex: '',
    onQuitSystem: () => false,
    userName: 'Admin',
    backImgUrl: ''
  }

  static propTypes = {
    menuData: PropTypes.array,
    onQuitSystem: PropTypes.func,
    backImgUrl: PropTypes.string
  }


  //点击一级菜单的动作
  // onClickMenu = (e) => {
  //   let findItem = this.props.menuData.find(item => item.menuId === e.key);
  //   if (findItem) {
  //     window.location.hash = findItem.cUrl;
  //   }
  // }

  //点击退出系统的动作
  quitSystem = (e) => {
    this.setState({ modalVisible: true });
  }


  /**
   * 自动生成一级菜单按钮项
   */
  getMenuItems = () => {
    const { menuData } = this.props;

    if (menuData) {
      const menuItems = menuData.map(v => {
        return (
          <Menu.Item key={v.menuId}>
            <Link to={v.cUrl}>
              <Icon type={v.icon} /><span>{v.menuName}</span>
            </Link>
          </Menu.Item>
        )
      });
      return menuItems;
    }
  }

  render() {
    const { acitveMenuKey, backImgUrl, onQuitSystem, userName } = this.props;
  
 
    return (  
     
      <Header className={Styles.header} style={{ backgroundImage: `url(${backImgUrl})` }} ref="myHeader">
        <Modal
          title="退出系统"
          visible={this.state.modalVisible}
          onOk={onQuitSystem}
          onCancel={() => { this.setState({ modalVisible: false }) }}
        >
          <p>你即将退出系统！请确认</p>
        </Modal>
        <Menu
          mode="horizontal"
          className={Styles.menu}
          // onClick={this.onClickMenu}
          selectedKeys={[acitveMenuKey]}
        >
          {this.getMenuItems()}
        </Menu>

        <div className={Styles.info}>
          <span><Icon type="user" style={{ fontSize: '18px', marginRight: '10px' }} />欢迎您，{userName}！</span>
          <span style={{ marginLeft: '20px' }} onClick={this.quitSystem}><Icon type="poweroff" style={{ fontSize: '18px', marginRight: '10px' }} /><span >退出系统</span></span>
        </div>
      </Header>
    );
  }
}

