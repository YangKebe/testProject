import {
  setRoleMenus, queryRecords, deleteRecord, getMenuKeysByRoleId
} from './service';
import {
  queryOrganizationTreeList
} from './../Org/service';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import globalData from "/project.config";
import colConfig from './config.json';


const defaultState = {
  curTableList: [],
  curQuryStr: {},
  totalNum: 0,
  curRoleMenuKeys: [],
  curMenuData: [],
};

export default {
  namespace: colConfig.pageTag,
  state: { ...defaultState },
  reducers: {
    'setList'(state, { payload }) {
      state.curTableList = payload.data.resultList;
      state.totalNum = payload.data.totalRecord;
      state.curQuryStr = payload.whereStr;
      return { ...state }
    },
    'clearTableData'(state, { payload: data }) {
      return { ...defaultState };
    },
    'setCurRoleMenuKeys'(state, { payload }) {
      state.curMenuData = payload.concat(); //这里后台接口重新后，要改写
      let curSelectKeys = payload.filter(item => !!item.roleId).map(the => the.menuId);
      state.curRoleMenuKeys = curSelectKeys;
      return { ...state }
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
      yield put({
        type: 'queryByWhere',
        payload: {
          ...curQuryParam,
          ...payload
        }
      })
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

    *getMenuKeysByRoleId({ payload }, { call, put }) {
      const res = yield call(getMenuKeysByRoleId, payload);
      if (res.data) {
        yield put({
          type: 'setCurRoleMenuKeys',
          payload: res.data
        });
      }
    },

    *setRoleMenus({ payload }, { call, put }) {
      const res = yield call(setRoleMenus, payload);
      if (res.data) {
        message.success('设置成功', 1);
      }
      else {
        message.error('设置失败', 1);
      }
    },




  },
  subscriptions: {
  },
};
