import { queryRoleManageList, queryRoleList, addRoleService, removeRoleService, changeRoleService, getUsers, setRoles, deleteRoleAndUser } from './service';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import globalData from "/project.config";
import colConfig from './config.json';
import globalConfig from '/project.config.json';

export default {
  namespace: colConfig.pageTag,
  state: {
    pageSize: globalData.pageSize,
    curTableList: [],
    curDetail: {},
    curQuryStr: {},
    currentPage: 1,
    totalRecord: 0,

    roleList: [],
    refreshRoleList: false,
    selectedRoleId: '',
    rows: 99999999,
    page: 1,

    userList: [],
    userCurrentPage: 1,
    userTotalRecord: 0,
    userCurQuryStr: {},
  },
  reducers: {
    'setRoleList'(state, { payload }) {
      state.roleList = payload;
      return { ...state };
    },

    'getUsersReturn'(state, { payload }) {
      state.userList = payload.data.resultList;
      state.userCurrentPage = payload.data.currentPage;
      state.userTotalRecord = payload.data.totalRecord;
      state.userCurQuryStr = payload.whereStr;

      return JSON.parse(JSON.stringify(state));
    },

    'setList'(state, { payload }) {
      if (payload.whereStr)
        state.curQuryStr = payload.whereStr;
      state.curTableList = payload.data.resultList;
      state.currentPage = payload.data.currentPage;
      state.totalRecord = payload.data.totalRecord;

      return JSON.parse(JSON.stringify(state));
    },

    'setSelectedRoleId'(state, { payload }) {
      state.selectedRoleId = payload.selectedRoleId;

      return JSON.parse(JSON.stringify(state));
    },
  },
  effects: {
    *getRoleList({ payload }, { call, put, select }) {
      const rows = yield select(state => state[colConfig.pageTag].rows);
      const page = yield select(state => state[colConfig.pageTag].page);
      const res = yield call(queryRoleList, { ...payload, rows, page });
      if (res && res.retCode && res.retCode.status === '0000') {
        yield put({
          type: 'setRoleList',
          payload: res.data.resultList,
        });
      }

    },

    /**查询用户信息列表 */
    *queryByWhere({ payload }, { call, put }) {
      if (payload.roleId) {
        yield put({
          type: 'setSelectedRoleId',
          payload: {
            selectedRoleId: payload.roleId
          }
        });
      }

      const res = yield call(queryRoleManageList, payload);
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

    /**下一页 */
    *nextPage({ payload }, { call, put, select }) {
      const curQuryStr = yield select(state => state[colConfig.pageTag].curQuryStr);
      const data = yield call(queryRoleManageList, { ...curQuryStr, ...payload });
      yield put({ type: 'setList', payload: { data: data.data, whereStr: { ...curQuryStr, ...payload } } })
    },

    /**新增角色 */
    *addRole({ payload }, { call, put }) {
      const data = yield call(addRoleService, payload);
      if (data.retCode.status == '0000') {
        message.success('添加成功');
        yield put({ type: 'getRoleList', payload: { sysCode: globalConfig.sysCode } })
      } else {
        message.error(data.retCode.msg)
      }
    },

    /**删除角色 */
    *removeRole({ payload }, { call, put }) {
      const data = yield call(removeRoleService, payload);
      if (data.retCode.status == '0000') {
        message.success('删除成功');
        yield put({ type: 'getRoleList', payload: { sysCode: globalConfig.sysCode } })
      } else {
        message.error(data.retCode.msg)
      }
    },

    /**修改角色信息 */
    *changeRole({ payload }, { call, put }) {
      const data = yield call(changeRoleService, payload);
      if (data.retCode.status == '0000') {
        message.success('修改成功');
        yield put({ type: 'getRoleList', payload: { sysCode: globalConfig.sysCode } })
      } else {
        message.error(data.retCode.msg)
      }
    },

    /**获取用户信息 */
    *getUsers({ payload }, { call, put }) {
      const data = yield call(getUsers, payload);
      yield put({ type: 'getUsersReturn', payload: { data: data.data, whereStr: payload } })
    },


    *getUsersNextPage({ payload }, { call, put, select }) {
      const curQuryStr = yield select(state => state[colConfig.pageTag].userCurQuryStr);
      const data = yield call(getUsers, { ...curQuryStr, ...payload });
      yield put({ type: 'getUsersReturn', payload: { data: data.data, whereStr: { ...curQuryStr, ...payload } } })
    },


    /**分配权限 */
    *setRoles({ payload }, { call, put }) {
      const data = yield call(setRoles, payload);
      if (data.retCode.status == '0000') {
        message.success("分配成功", 2);

        yield put({
          type: 'queryByWhere',
          payload: {
            roleId: payload.roleId,
            sysCode: globalData.sysCode,
            status: 101001,
            rows: globalData.pageSize,
            page: 1,
          }
        })

      } else {
        message.error("分配失败", 1);
      }
    },

    /**删除用户与角色关联关系 */
    *deleteRoleAndUser({ payload }, { call, put }) {
      const data = yield call(deleteRoleAndUser, payload);
      if (data.retCode.status == '0000') {
        message.success("删除成功", 1);

        yield put({
          type: 'queryByWhere',
          payload: {
            roleId: payload.roleId ? payload.roleId : undefined,
            sysCode: globalData.sysCode,
            rows: globalData.pageSize,
            page: 1,
          }
        })

      } else {
        message.error("删除失败", 1);
      }
    },

  },
  subscriptions: {
  },
};
