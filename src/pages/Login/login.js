import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Checkbox, Alert, Icon } from 'antd';
import Login from '/components/Login';
import styles from './login.less';
import globalData from 'project.config';

const { Tab, UserName, Password, Mobile, Captcha, Submit, CaptchaPic } = Login;

 class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
  }

  onTabChange = (type) => {
    this.setState({ type });
  }

  handleSubmit = (err, values) => {
    if (!err) {
      this.props.dispatch({
        type: 'login/login',
        payload: {
          userId: values.userName,
          password: values.password,
          vcode: values.vcode,
          deviceId: globalData.deviceId,
          sysCode: globalData.sysCode
        },
      });
    }
  }

  changeAutoLogin = (e) => {
    this.setState({
      autoLogin: e.target.checked,
    });
  }

  renderMessage = (content) => {
    return (
      <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
    );
  }

  render() {
    const { login, submitting } = this.props;
    const { type } = this.state;
    const vCodePicUrl = globalData.baseUrl + `/wuye/security/vcode?sysCode=102006&${globalData.sysCode}`;
    // const vCodePicUrl = globalData.baseUrl + '/test/security/vcode?sysCode=102006&';
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
        >
          <Tab key="account" tab="账户密码登录">
            {
              login.status === 'error' &&
              login.type === 'account' &&
              !login.submitting &&
              this.renderMessage('账户或密码错误（admin/888888）')
            }
            <UserName name="userName" placeholder="guest" />
            <Password name="password" placeholder="123456" />
            <CaptchaPic name='vcode' rootUrl={vCodePicUrl} />
          </Tab>
          <Tab key="mobile" tab="手机号登录">
            {
              login.status === 'error' &&
              login.type === 'mobile' &&
              !login.submitting &&
              this.renderMessage('验证码错误')
            }
            <Mobile name="mobile" />
            <Captcha name="captcha" />
          </Tab>
          <div>
            <Checkbox checked={this.state.autoLogin} onChange={this.changeAutoLogin}>自动登录</Checkbox>
            <a style={{ float: 'right' }} href="">忘记密码</a>
          </div>
          <Submit loading={submitting}>登录</Submit>
          <div className={styles.other}>
            其他登录方式
            <Icon className={styles.icon} type="wechat" />
            <Link className={styles.register} to="/user/register">注册账户</Link>
          </div>
        </Login>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    login: state.login,
  };
}

export default connect(mapStateToProps)(LoginPage)
