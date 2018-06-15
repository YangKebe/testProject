import React from 'react';
import { Route, Switch, Router, routerRedux, withRouter } from 'dva/router';
import { getRouterData } from './project.config';

function RouterConfig({ history, app }) {

  let routeData = getRouterData(app); //加载路由配置数据
  let WelcomePage = routeData['welcome'].component;
  let LoginPage = routeData['login'].component;
  let BasicLayout = routeData['basicLayout'].component;
  let LoginControl = routeData['loginControl'].component;
  let E403 = routeData['403'].component;
  let E404 = routeData['403'].component;
  let E500 = routeData['500'].component;
  

  if (history.location.pathname === '/') history.replace('/BasicLayout/System/SysSetting/Auth'); //首页定位信息
  return (
    <Router history={history}>
      <LoginControl
        welcomePage={<WelcomePage />}
        loginPage={<LoginPage />}
      >
        <Switch>
          {/* 如果有其他类型的主布局，在基础布局之上添加 */}
          <Route path="/BasicLayout" render={props => <BasicLayout {...props} routeData={routeData} />} />          
          <Route path="/exception/403" render={props => <E403 />} />
          <Route path="/exception/404" render={props => <E404 />} />
          <Route path="/exception/500" render={props => <E500 />} />
        </Switch>
      </LoginControl>
    </Router>
  );
}

export default RouterConfig;
