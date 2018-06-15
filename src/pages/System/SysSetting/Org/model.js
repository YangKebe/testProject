import { queryOrganizationTreeList, queryOrganizationById, queryAddChildrenOrganization, queryDeleteOrganization, queryUpDataOrganizationInfo } from './service';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import globalData from "/project.config";
import colConfig from './config.json';
import globalConfig from '/project.config.json';

let orgCache = {};
export default {
  namespace: colConfig.pageTag,
  state: {
    organizationList: [], //多个部门信息
    organizationInfo: null, //单个部门信息
  },
  reducers: {
    'organizationList'(state, { payload: data }) {
      state.organizationList = data;
      return { ...state };
    },

    'organizationInfo'(state, { payload: data }) {
      if (data) {
        let findItem = state.organizationList.find(item => item.orgId === data.pOrgId);
        data['pOrgName'] = findItem && findItem.orgName || '';
        state.organizationInfo = { ...data };
      } else {
        state.organizationInfo = null;
      }
      return { ...state };
    },

    'clearState'(state, { payload: data }) {
      state.organizationList = [];
      state.organizationInfo = null;
      return { ...state };
    },

    'delete0rganization'(state, { payload: data }) {
      state.organizationInfo = null;
      return { ...state };
    },
  },
  effects: {
    /** 查询部门信息列表（树状） */
    * queryOrganizationTreeListEffect({ payload }, { call, put }) {
      const response = yield call(queryOrganizationTreeList, payload);
      if (response.retCode.status == '0000') {
        yield put({ type: 'organizationList', payload: response.data })
      } else {
        message.error(response.retCode.msg)
      }
    },

    /** 查询单个部门信息 */
    * queryOrganizationByIdEffect({ payload }, { call, put }) {
      const response = yield call(queryOrganizationById, payload);
      if (response.retCode.status == '0000') {
        yield put({ type: 'organizationInfo', payload: response.data[0] })
      } else {
        message.error(response.retCode.msg)
      }
    },

    /** 新增部门信息 */
    * queryAddChildrenOrganizationEffect({ payload }, { call, put }) {
      const response = yield call(queryAddChildrenOrganization, payload);
      if (response.retCode.status == '0000') {
        message.success('添加成功');
        yield put({ type: 'queryOrganizationTreeListEffect' })
      } else {
        message.error(response.retCode.msg)
      }
    },

    /** 删除部门信息 */
    * queryDeleteOrganizationEffect({ payload }, { call, put }) {
      const response = yield call(queryDeleteOrganization, payload);
      if (response.retCode.status == '0000') {
        message.success('删除成功');
        yield put({ type: 'delete0rganization' });
        yield put({ type: 'queryOrganizationTreeListEffect' });
      } else {
        message.error(response.retCode.msg)
      }
    },

    /** 修改部门信息 */
    * queryUpDataOrganizationInfoEffect({ payload }, { select, call, put }) {
      const organizationInfo = yield select(state => state[colConfig.pageTag].organizationInfo);
      const response = yield call(queryUpDataOrganizationInfo, payload);
      if (response.retCode.status == '0000') {
        message.success('修改成功');
        yield put({ type: 'queryOrganizationByIdEffect', payload: { orgId: organizationInfo.orgId } });
        yield put({ type: 'queryOrganizationTreeListEffect' })
      } else {
        message.error(response.retCode.msg)
      }
    },




  },
  subscriptions: {
  },
};
