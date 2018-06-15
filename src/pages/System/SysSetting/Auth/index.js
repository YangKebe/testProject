import React from 'react';
import { connect } from 'dva';
import CommonTable from './table';
import CommonSearch from './search';
import MyBreadcrumb from '/components/MyBreadcrumb';
import colConfig from './config.json';


class Entry extends React.PureComponent {


  /**
   * 页面退出时，清空model中的查询数据和缓存
   */
  componentWillUnmount() {
    this.props.dispatch({
      type: `${colConfig.pageTag}/clearTableData`,
      payload: 0
    });
  }

  render() {
    return (
      <div>
        <MyBreadcrumb itemList={['系统管理', '系统设置', '权限管理']} /> {/* 改造内容 */}
        <CommonSearch />
        <CommonTable />
      </div>
    );
  }
}

export default connect()(Entry);
