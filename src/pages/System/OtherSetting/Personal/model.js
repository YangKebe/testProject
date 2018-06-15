import {
  queryRecords, deleteRecord, submitNew, modifyRecord, queryPasswordModify,
  queryPasswordReset, queryAmendUserStatus, queryOneUserRoleAllot, queryOneUserRoleInfo
} from '../../SysSetting/User/service';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import globalData from "/project.config";
import colConfig from './config.json';


export default {
  namespace: colConfig.pageTag,
  state: {
    curDetail: {},
  },
  reducers: {
    'setDetail'(state, { payload }) {
      state.curDetail = payload.detailData;
      return JSON.parse(JSON.stringify(state));
    },
  },
  effects: {
    *goToDetail({ payload }, { call, put }) {
      let param = {
        userId: payload.userId,
        rows: 1,
        page: 1,
      };
      const detailData = yield call(queryRecords, param);
      yield put({
        type: 'setDetail',
        payload: {
          detailData: detailData.data.resultList[0],
        }
      });
    },

    *modifyRecord({ payload }, { call, put }) {
      const data = yield call(modifyRecord, payload.newValues);

      if (data.retCode.status === '0000') {
        message.success("修改成功", 1);
      } else {
        message.error(data.retCode.msg);
      }
      yield put(routerRedux.push({
        pathname: '/BasicLayout/System/OtherSetting/Personal',
        state: {}
      }))
    },

    /**修改密码 */
    * queryPasswordModifyEffect({ payload }, { select, call, put }) {
      const response = yield call(queryPasswordModify, payload);
      if (response.retCode.status == '0000') {
        message.success('修改成功', 2);
        yield put({ type: 'nextPage', payload: {} })
      } else {
        message.error(response.retCode.msg)
      }
    },
  },
  subscriptions: {
  },
};
