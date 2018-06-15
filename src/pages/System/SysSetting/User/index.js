import React from 'react';
import { connect } from 'dva';
import { Route } from 'dva/router';
import CommonTable from './table';
import CommonSearch from './search';
import MyBreadcrumb from '/components/MyBreadcrumb';
import colConfig from './config.json';


class EntryList extends React.PureComponent {

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
    const { location } = this.props;
    const displayDetail = location.pathname.indexOf('detail') > -1;
    return (
      <div>
        <div style={{ display: displayDetail ? 'none' : 'block' }}>  
          <MyBreadcrumb itemList={['系统管理', '系统设置', '用户管理']} /> {/* 改造内容 */}
          <CommonSearch />
          <CommonTable
            match={this.props.location.pathname}
            history = {this.props.history}
          />
        </div>

        {/* 改造内容 */}
        <Route path={`${this.props.menuUrl}/detail`} exact component={require('./detail').default} />

      </div>
    );
  }
}


function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(EntryList);
