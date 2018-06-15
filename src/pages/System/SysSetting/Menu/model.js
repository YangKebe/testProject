import {
  queryAddChildrenMenu,
  queryDeleteMenusInfo,
  queryMenusInfoById,
  queryMenusTreeData,
  queryUpdataMenusInfo
} from './service';
import { message } from 'antd';
import colConfig from './config.json';
import globalConfig from '/project.config.json';

export default {
  namespace: colConfig.pageTag,
  state: {
    menuList: [], //多个菜单信息
    menuInfo: null, //单个菜单信息
  },
  reducers: {
    'menuList'(state, { payload: data }) {
      state.menuList = data;
      return { ...state };
    },

    'menuInfo'(state, { payload: data }) {
      if (data) {
        let findItem = state.menuList.find(item => item.menuId === data.pMenuId);
        data['pMenuName'] = findItem && findItem.menuName || '';
        state.menuInfo = { ...data };
      } else {
        state.menuInfo = null;
      }
      return { ...state };
    },

    'deleteMenu'(state, { payload: data }) {
      state.menuInfo = null;
      return { ...state };
    },

    'clearState'(state, { payload: data }) {
      state.menuList = [];
      state.menuInfo = null;
      return { ...state };
    },
  },
  effects: {
    /** 查询菜单信息列表（树状） */
    * queryMenusTreeDataListEffect({ payload }, { call, put }) {
      const response = yield call(queryMenusTreeData, payload);
      if (response.retCode.status == '0000') {
        yield put({ type: 'menuList', payload: response.data })
      } else {
        message.error(response.retCode.msg)
      }
    },

    /** 查询单个菜单信息 */
    * queryMenusInfoByIdEffect({ payload }, { call, put }) {
      const response = yield call(queryMenusInfoById, payload);
      if (response.retCode.status == '0000') {
        yield put({ type: 'menuInfo', payload: response.data[0] })
      } else {
        message.error(response.retCode.msg)
      }
    },

    /** 新增菜单信息 */
    * queryAddChildrenMenuEffect({ payload }, { call, put }) {
      const response = yield call(queryAddChildrenMenu, payload);
      if (response.retCode.status == '0000') {
        message.success('添加成功');
        yield put({ type: 'queryMenusTreeDataListEffect', payload: { sysCode: globalConfig.sysCode } })
      } else {
        message.error(response.retCode.msg)
      }
    },

    /** 删除菜单信息 */
    * queryDeleteMenusInfoEffect({ payload }, { call, put }) {
      const response = yield call(queryDeleteMenusInfo, payload);
      if (response.retCode.status == '0000') {
        message.success('删除成功');
        yield put({ type: 'queryMenusTreeDataListEffect', payload: { sysCode: globalConfig.sysCode } });
        yield put({ type: 'deleteMenu' })
      } else {
        message.error(response.retCode.msg)
      }
    },

    /** 修改菜单信息 */
    * queryUpdataMenusInfoEffect({ payload }, { select, call, put }) {
      const menuInfo = yield select(state => state[colConfig.pageTag].menuInfo);
      const response = yield call(queryUpdataMenusInfo, payload);
      if (response.retCode.status == '0000') {
        message.success('修改成功');
        yield put({ type: 'queryMenusInfoByIdEffect', payload: { menuId: menuInfo.menuId } });
        yield put({ type: 'queryMenusTreeDataListEffect', payload: { sysCode: globalConfig.sysCode } })
      } else {
        message.error(response.retCode.msg)
      }
    },
  },
  subscriptions: {
  },
};
