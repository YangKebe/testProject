import { queryPoints } from './service';
import { queryRecords } from '../RegulatoryPlanSubManage/service';
import { queryPic, queryPlanfileId } from '../../PlanFile/FileManage/service';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import globalData from "/project.config";
import colConfig from './config.json';



export default {
  namespace: colConfig.pageTag,
  state: {
    pointsList: {},
    modalDataList: [],
    pageSize: null,
    pageNum: null,
    total: null,
    planfileId: null
  },
  reducers: {
    'setList'(state, { payload }) {
      state.pointsList = payload.data.records;
      return JSON.parse(JSON.stringify(state));
    },
    'setModalList'(state, { payload }) {
      state.modalDataList = payload.data.records;
      state.pageSize = payload.whereStr.pageSize;
      state.pageNum = payload.whereStr.pageNum;
      state.total = payload.data.total;
      return JSON.parse(JSON.stringify(state));
    },
    'setPicPath'(state, { payload }) {
      state.planfileId = payload.data.records.length != 0 ? payload.data.records[0].planfileId : '';
      return JSON.parse(JSON.stringify(state));
    },
  },
  effects: {
    *queryPoints({ payload }, { call, put }) {
      const res = yield call(queryPoints, payload);
      if (res.data) {
        yield put({
          type: 'setList',
          payload: {
            data: res.data,
          }
        });
      }
    },
    *queryModal({ payload }, { call, put }) {
      const res = yield call(queryRecords, payload);
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
    *queryPic({ payload }, { call, put }) {
      const res = yield call(queryPlanfileId, payload);
      if (res.data) {
        yield put({
          type: 'setPicPath',
          payload: {
            data: res.data,
            whereStr: payload
          }
        });
      }
    },
    *nextPage({ payload }, { select, call, put }) {
      const res = yield call(queryRecords, {...payload });
      if (res.data) {
        yield put({
          type: 'setModalList',
          payload: {
            data: res.data,
            whereStr: payload 
          }
        })
      }
    },
  },
  subscriptions: {
  },
};
