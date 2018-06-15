import { queryRecords, deleteRecord, submitNew, modifyRecord,queryModalData, getRecordDetail } from './service';
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
    pageNumModal:0,
    pageSizeModal:0,
    dataModal:[],
    totalNumModal:0,
    whereModal: {}
  },
  reducers: {
    'setList'(state, { payload }) {
      state.curTableList = payload.data.records;
      state.totalNum = payload.data.total;
      state.curQuryStr = payload.whereStr;
      return JSON.parse(JSON.stringify(state));
    },
    'setDetail'(state, { payload }) {
      state.curDetail = payload.detailData.data.records[0];
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
    'setModalList'(state, { payload }) {
      state.dataModal = payload.data.records;
      state.pageSizeModal = payload.whereStr.pageSize;
      state.pageNumModal = payload.whereStr.pageNum;
      state.totalNumModal = payload.data.total;
      state.whereModal = payload.whereStr;
      return JSON.parse(JSON.stringify(state));
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
      const res = yield call(queryRecords, { ...curQuryParam, ...payload });
      if (res.data) {
        yield put({
          type: 'setList',
          payload: {
            data: res.data,
            whereStr: { ...curQuryParam, ...payload }
          }
        })
      }
    },

    *deleteRecord({ payload }, { call, put }) {
      const res = yield call(deleteRecord, payload);
      if (res.retCode.status == '0000') {
        message.success("删除成功", 1);
        yield put({ type: 'nextPage', payload: { data: {}, whereStr: null } })
      }else {
        message.error("删除失败", 1);
      }
    },
    *goToDetail({ payload }, { call, put }) {
      //这里可以补充获取详情信息的方法，当前页面传递的参数
      if (payload.detailType !== 'add') {
        let param = {
          regplanId: payload.record.regplanId,
          pageSize: 1,
          pageNum: 1,
          indexClass: payload.record.indexClass,
        };
        const detailData = yield call(getRecordDetail, param);
        yield put({
          type: 'setDetail',
          payload: {
            detailData,
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
      if (data.retCode.status == 1) {
        message.success("添加成功", 1);
      }else {
        message.error("添加失败", 1);
      }
      yield put(routerRedux.push({
        pathname: '/BasicLayout/ResourceManage/RegulatoryPlan/RegulatoryPlanSubManage',
        state: {}
      }));
      yield put({ type: 'nextPage', payload: { data: {}, whereStr: null } })
    },
    *modifyRecord({ payload }, { call, put }) {
      const data = yield call(modifyRecord, payload.newValues);
      if(data.retCode.status == 1) {
        message.success("修改成功", 1);
      }else {
        message.error("修改失败", 1);
      }
      
      yield put(routerRedux.push({
        pathname: '/BasicLayout/ResourceManage/RegulatoryPlan/RegulatoryPlanSubManage',
        state: {}
      }))
      yield put({ type: 'nextPage', payload: { data: {}, whereStr: null } })
    },

    *queryModalData({ payload }, { call, put }) {
      const res = yield call(queryModalData, payload);
      if (res.data) {
        yield put({
          type: 'setModalList',
          payload: {
            data: res.data,
            whereStr: payload
          }
        });
      }
    },
  
    *nextMoadlPage({ payload }, { select, call, put }) {
      const curQuryParam = yield select(state => state[colConfig.pageTag].whereModal);
      const res = yield call(queryModalData, { ...curQuryParam, ...payload });
      if (res.data) {
        yield put({
          type: 'setModalList',
          payload: {
            data: res.data,
            whereStr: { ...curQuryParam, ...payload }
          }
        })
      }
    },
    
  },
  subscriptions: {
  },
};
