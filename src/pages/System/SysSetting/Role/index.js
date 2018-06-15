import React from 'react';
import { connect } from 'dva';
import { Layout } from 'antd';
import CommonTable from './table';
import CommonSearch from './search';
import RoleManage from './roleManage';
import MyBreadcrumb from '/components/MyBreadcrumb';
import globalData from "/project.config";
import { getConfirmLocale } from 'antd/lib/modal/locale';
import colConfig from './config.json';
import globalConfig from '/project.config.json';


const Sider = Layout.Sider;
const Content = Layout.Content;


class EntryList extends React.PureComponent {


  componentWillMount() {
    this.props.dispatch({
      type: `${colConfig.pageTag}/queryByWhere`,
      payload: {
        rows: globalConfig.pageSize,
        page: 1
      }
    })
  }


  render() {
    const expandedKeys = [];

    return (
      <Layout>
        <Sider style={{ background: 'white' }}>
          <RoleManage />
        </Sider>
        <Content style={{ padding: '0 20px', background: 'white' }}>
          <MyBreadcrumb itemList={['系统管理', '系统配置', '角色管理']} /> {/* 改造内容 */}
          <CommonSearch />
          <CommonTable />
        </Content>
      </Layout>
    );
  }
}


function mapStateToProps(state) {
  return {

  };
}

export default connect(mapStateToProps)(EntryList);
