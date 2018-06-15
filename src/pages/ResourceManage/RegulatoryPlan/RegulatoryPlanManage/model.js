import { queryRecords, deleteRecord, submitNew, modifyRecord, getRecordDetail, getRecordPicList, deletePic } from './service';
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
    picList: [],
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
    'setPiclist'(state, { payload }) {
      state.picList = payload.picList.data.records;
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
      if (res.retCode.status === '0000') {
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
          regPlanId: payload.record.regplanId,
          pageSize: 1,
          pageNum: 1,
          indexClass: payload.record.indexClass,
        };
        //const detailData = payload.record || {};
        const detailData = yield call(getRecordDetail, param);
        yield put({
          type: 'setDetail',
          payload: {
            detailData,
          }
        });


        let picParam = {
          regPlanId: payload.record.regplanId,
          //indexClass: payload.record.indexClass,
          pageSize: 0,
          pageNum: 0,
        };
        const picList = yield call(getRecordPicList, picParam);
        yield put({
          type: 'setPiclist',
          payload: {
            picList,
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
      const data = yield call(submitNew, payload.formData);
      if (data.retCode.status == '0000') {
        message.success("添加成功", 1);
        
      }else {
        message.error("添加失败", 1);
      }
      yield put(routerRedux.push({
        pathname: '/BasicLayout/ResourceManage/RegulatoryPlan/RegulatoryPlanManage',
        state: {}
      }))
      yield put({ type: 'nextPage', payload: { data: {}, whereStr: null } })

    },
    *modifyRecord({ payload }, { call, put }) {
      const data = yield call(modifyRecord, payload.formData);
      if(data.retCode.status == 1) {
        message.success("修改成功", 1);
      }else {
        message.error("修改失败", 1);
      }
      yield put(routerRedux.push({
        pathname: '/BasicLayout/ResourceManage/RegulatoryPlan/RegulatoryPlanManage',
        state: {}
      }))
      yield put({ type: 'nextPage', payload: { data: {}, whereStr: null } })
    },


    *deletePic({ payload }, { call, put }) {
      const res = yield call(deletePic, payload);
      if (res.retCode.status === '0000') {
        message.success('删除成功', 1);
        yield put({
          type: 'nextPage',
          payload: {
            page: 1
          }
        })
      } else {
        message.error('删除失败', 1);
      }
    },
  },
  subscriptions: {
  },
};
