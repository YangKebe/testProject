import { loginByPwd, getMenuData } from './service';
import globalData from '/project.config';

export default {
  namespace: 'login',

  state: {
    isLogin: false,
    isReady: false,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const res = yield call(loginByPwd, payload);
      if (res && res.retCode && res.retCode.status === '0000') {
        globalData.afterLoginSuccess.call(globalData, res.data);
        yield put({
          type: 'getMenuAndDic',
          payload: {
            sysCode: globalData.sysCode,
          },
        });
      }
      else {
      }
    },

    *getMenuAndDic({ payload }, { call, put }) {
      const response = yield call(getMenuData, payload);
      globalData.menuData = response && response.data || [];

      if (response.data) {
        globalData.menuData = response.data || [];
        yield put({
          type: 'setLoginState',
          payload: {
            isLogin: true,
            isReady: true,
          },
        });
      }
    },
  },

  reducers: {
    'setLoginState'(state, { payload }) {
      state.isReady = payload.isReady;
      state.isLogin = payload.isLogin;
      return { ...state };
    },
    'logout'(state, { payload }) {
      console.log(123123)
      state.isReady = true;
      state.isLogin = false;
      return { ...state };
    }
  },
};
