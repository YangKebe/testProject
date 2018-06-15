import {
  queryRecords, deleteRecord, submitNew, modifyRecord, queryPasswordModify,
  queryPasswordReset, queryAmendUserStatus, queryOneUserRoleAllot,queryOneUserRoleInfo
} from './service';
import {
  queryOrganizationTreeList
} from './../Org/service';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import globalData from "/project.config";
import colConfig from './config.json';


export default {
  namespace: colConfig.pageTag,
  state: {
    pageSize: globalData.pageSize,
    curTableList: [],
    curDetail: {},
    curQuryStr: {},
    totalNum: 0,
    userInfo: null,
    userRoleInfo: [],

    organizationList: [], //多个部门信息
  },
  reducers: {
    'setList'(state, { payload }) {
      state.curTableList = payload.data.resultList;
      state.totalNum = payload.data.totalRecord;
      state.curQuryStr = payload.whereStr;
      return JSON.parse(JSON.stringify(state));
    },

    'setDetail'(state, { payload }) {
      state.curDetail = payload.detailData;
      return JSON.parse(JSON.stringify(state));
    },

    'addSuccess'(state, { payload: data }) {
      if (data.retCode.status === '0000' || data.retCode.status === '1111') {
        message.success("添加成功", 1);
      } else {
        message.error(data.msg);
      }
      return JSON.parse(JSON.stringify(state));
    },

    'clearTableData'(state, { payload: data }) {
      state.curTableList = [];
      return { ...state };
    },

    'userInfo'(state, { payload: data }) {
      state.userInfo = data;
      return { ...state };
    },

    'userRoleInfo'(state, { payload: data }) {
      state.userRoleInfo = data;
      return { ...state };
    },

    'organizationListorganizationList'(state, { payload: data }) {
      state.organizationList = data;
      return { ...state };
    },
  },
  effects: {
    *queryByWhere({ payload }, { call, put }) {
      const res = yield call(queryRecords, payload);
      if (res.data) {
        yield put({
          type: 'setList',
          payload: {
            data: res.data,
            whereStr: payload
          }
        });
      }
    },

    *nextPage({ payload }, { select, call, put }) {
      const curQuryParam = yield select(state => state[colConfig.pageTag].curQuryStr);
      yield put({ type: 'queryByWhere', payload: { ...curQuryParam, ...payload } })
    },

    *deleteRecord({ payload }, { call, put }) {
      const res = yield call(deleteRecord, payload);
      if (res.retCode.status === '0000') {
        message.success('删除成功', 1);
        yield put({
          type: 'nextPage',
          payload: {}
        })
      } else {
        message.error('删除失败', 1);
      }
    },

    *goToDetail({ payload }, { call, put }) {
      //这里可以补充获取详情信息的方法，当前页面传递的参数
      if (payload.detailType !== 'add') {
        let param = {
          userId: payload.record.userId,
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
      }
      yield put(routerRedux.push(
        {
          pathname: payload.pathname,
          state: {
            detailType: payload.detailType
          }
        }
      ));
    },
    *submitNew({ payload }, { call, put }) {
      const data = yield call(submitNew, payload.newValues);
      if (data.retCode.status === '0000') {
        message.success("添加成功", 1);
      } else {
        message.error(data.retCode.msg);
      }
      yield put(routerRedux.push({
        pathname: '/BasicLayout/System/SysSetting/User',
        state: {}
      }));
      yield put({ type: 'nextPage', payload: { data: {}, whereStr: null } })
    },
    *modifyRecord({ payload }, { call, put }) {
      const data = yield call(modifyRecord, payload.newValues);

      if (data.retCode.status === '0000') {
        message.success("修改成功", 1);
      } else {
        message.error(data.retCode.msg);
      }
      yield put(routerRedux.push({
        pathname: '/BasicLayout/System/SysSetting/User',
        state: {}
      }))
      yield put({ type: 'nextPage', payload: { data: {}, whereStr: null } })
    },

    /**修改密码 */
    * queryPasswordModifyEffect({ payload }, { select, call, put }) {
      const response = yield call(queryPasswordModify, payload);
      if (response.retCode.status === '0000') {
        message.success('修改成功', 2);
        yield put({ type: 'nextPage', payload: {} })
      } else {
        message.error(response.retCode.msg)
      }
    },

    /**密码重置 */
    * queryPasswordResetEffect({ payload }, { call, put }) {
      const response = yield call(queryPasswordReset, payload);
      if (response.retCode.status === '0000') {
        message.success('密码重置成功', 2);
        yield put({ type: 'nextPage', payload: {} })
      } else {
        message.error(response.retCode.msg)
      }
    },

    /**账号冻结/启用 */
    * queryAmendUserStatusEffect({ payload }, { select, call, put }) {
      const curQuryParam = yield select(state => state[colConfig.pageTag].curQuryStr);
      const response = yield call(queryAmendUserStatus, payload);
      if (response.retCode.status === '0000') {
        message.success('更改成功', 2);
        yield put({ type: 'userInfo', payload: null })
        yield put({ type: 'queryByWhere', payload: curQuryParam })
      } else {
        message.error(response.retCode.msg)
      }
    },

    * queryOneUserRoleAllotEffect({ payload }, { select, call, put }) {
      const response = yield call(queryOneUserRoleAllot, payload);
      if (response.retCode.status === '0000') {
        message.success('分配成功', 2);
      } else {
        message.error(response.retCode.msg)
      }
    },


    /** 查询部门信息列表（树状） */
    * queryOrganizationTreeListEffect({ payload }, { call, put }) {
      const response = yield call(queryOrganizationTreeList, payload);
      if (response.retCode.status === '0000') {
        yield put({ type: 'organizationList', payload: response.data })
      } else {
        message.error(response.retCode.msg)
      }
    },

    /**查询用户分配角色信息 */
    * queryOneUserRoleInfoEffect({ payload }, { select, call, put }) {
    const response = yield call(queryOneUserRoleInfo, payload);
    if (response.retCode.status === '0000') {
      yield put({ type: 'userRoleInfo', payload: response.data });
    } else {
      message.error(response.data.retCode.msg);
    }
  },
  },
  subscriptions: {
  },
};
