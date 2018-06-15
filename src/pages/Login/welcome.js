import React from 'react';
import { connect } from 'dva';
import styles from './welcome.css';
import { stateControl } from '/components/LoginControl';
import { loginByToken, getMenuData, getDictionaries } from './service';
import globalData from '/project.config';

class WelcomePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {

    /**
     * 定义欢迎页最短持续时间
     */
    const minDuration = new Promise((resolve) => {

      setTimeout(() => resolve(true), 5000);

    })

    /**
     * token检测程序需要重写，建议增加timeout时间控制
     */
    const tokenKey = ''; //从本地存储取出token
    let isLogin = false;
    const checkToken = loginByToken({
      userId: globalData.userId,
      deviceId: globalData.deviceId,
      token: globalData.token
    })
      .then(res => {
        if (res.retCode.status === '0000') {
          isLogin = true;
          globalData.afterLoginSuccess.call(globalData, res.data);
          return getMenuData({ //获取菜单数据
            sysCode: globalData.sysCode
          });
        }
      })
      .then(res => {
        globalData.menuData = res.data || [];
        return getDictionaries({
          sysCode: globalData.sysCode
        });
      })
      .then(res => globalData.dicData = res.data || [])
      .catch(err => console.log(err));

    Promise.all([minDuration, checkToken]).then(result => {
      this.props.dispatch({
        type: 'login/setLoginState',
        payload: {
          isReady: true,
          isLogin
        }
      });
    })
  }

  render() {
    return (
      <div className={styles.normal}>
        <h1 className={styles.title}>{`欢迎登录${globalData.systemName}`}</h1>

        <div
          className={styles.welcome}
          style={{
            background: `url(${require("/assets/welcome-bg.png")}) no-repeat center 0`,
          }} />
        <div className={styles.welcomeLoginText}>欢迎登录系统</div>
        <ul className={styles.list}>
          <li>程序加载中，请稍等...</li>
          <li>版权所有：中通服咨询设计研究院有限公司</li>
        </ul>
      </div>
    );
  }
}

WelcomePage.propTypes = {
};

export default connect()(WelcomePage);
