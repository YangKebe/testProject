import React from 'react';
import { connect } from 'dva';
import { Route } from 'dva/router';
import CommonTable from './table';
import CommonSearch from './search';
import MyBreadcrumb from '/components/MyBreadcrumb';
import globalData from "/project.config";
import colConfig from './config.json';


class EntryList extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      indexClass: null,
      regplanName: null,
    }
}

  componentDidMount() {
    this.props.dispatch({
      type: `${colConfig.pageTag}/queryByWhere`,
      payload: {
        pageSize: globalData.pageSize,
        pageNum: 1,
        indexClass: this.state.indexClass,
        regplanId: '',
        regplanName: this.state.regplanName,
      }
    });
  }

  componentWillMount() {
    /* 如果history中有indexClass和regplanId，则赋予搜索框初始值 */ 
    if(this.props.history && this.props.history.location.state) {
      this.setState({
        indexClass: this.props.history.location.state.indexClass,
        regplanName: this.props.history.location.state.regplanName
      })
    }
}

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
          <MyBreadcrumb itemList={['资源管理','控制性规划', '控规管理']} /> {/* 改造内容 */}
          <CommonSearch indexClass={this.state.indexClass} regplanName={this.state.regplanName}/>
          <CommonTable
            match={this.props.location.pathname}
            history = {this.props.history}
            indexClass={this.state.indexClass}
            regplanName={this.state.regplanName}
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
