import React from 'react';
import GlobalHeader from '../components/GlobalHeader';
import GlobalFooter from '../components/GlobalFooter';
import { Layout, Icon } from 'antd';
import { Route } from 'dva/router';
import { stateControl } from '../components/LoginControl';
import globalData from '../project.config';
import { SiderMenu, menuTool } from '../components/SiderMenu';
import styles from './BasicLayout.less';
import Empty from '../components/Empty';
import { connect } from 'dva';
import { withRouter } from 'react-router-dom';


const { Content } = Layout;

class BasicLayout extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            pathname: this.props.history.location.pathname,
        }
    }

    /**
     * 注意，histroy的location发生变化，但histroy这个对象的地址没有变
     * 因此对于purecomponent不会刷新，需要强行指定state
     * 而且，因为是地址引用，所以，this.props和nextprops的histroy属性相同
     * @param {} nextProps 
     */
    componentWillReceiveProps(nextProps) {
        if (nextProps.history.location.pathname !== this.state.pathname) {
            this.setState({
                pathname: nextProps.history.location.pathname,
            });
        }
    }

    logout = () => {
        console.log('dwada',this.props)
        this.props.dispatch({
            type: 'login/logout',
            payLoad: null
        });
    }

    render() {
        let menuProps = menuTool.getMenuProps(globalData.menuData, this.state.pathname, globalData.routeData);
        let { routeData } = this.props;

        let EntryComponent = menuProps.pageObj && menuProps.pageObj.component && menuProps.pageObj.component || Empty;
        let menuUrl = menuProps.pageObj && menuProps.pageObj.path || '';
        return (
            <Layout>
                <GlobalHeader
                    menuData={menuProps.topLevelMenus}
                    acitveMenuKey={menuProps.topLevelMenuAcitveKey}
                    backImgUrl={globalData.headerImgUrl}
                    onQuitSystem={this.logout}
                    userName={globalData.userName}
                />

                <Layout className={styles.centerBox}>
                    <SiderMenu
                        menuData={menuProps.secondLevelMenus}
                        pathname={this.state.pathname}
                        defaultOpenKeys={menuProps.defaultSecondOpenKeys}
                        acitveMenuKeys={menuProps.secondLevelMenuAcitveKey}
                    />
                    <Content className={styles.content}>
                        {<EntryComponent
                            menuUrl={menuUrl}
                            history={this.props.history}
                            location={this.props.history.location}
                        />}
                    </Content>
                </Layout>
                <GlobalFooter
                    links={[{
                        key: '公司首页',
                        title: <span><Icon type="home" />公司首页</span>,
                        href: globalData.enterpriseUrl,
                        blankTarget: true,
                    }, {
                        key: 'link1',
                        title: <span><Icon type="github" />友情链接1</span>,
                        href: 'https://www.baidu.com',
                        blankTarget: true,
                    }, {
                        key: 'link2',
                        title: <span><Icon type="github" />友情链接2</span>,
                        href: 'http://www.baidu.com',
                        blankTarget: true,
                    }]}
                    copyright={
                        <div>Copyright <Icon type="copyright" /> {globalData.copyRight}</div>
                    }
                />
            </Layout>
        );
    }

}

export default connect()(BasicLayout);