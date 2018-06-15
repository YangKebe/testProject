import React from 'react';
import { connect } from 'dva';
import { Layout, Button, Popconfirm } from 'antd';
import MenuManage from './menuManage';
import MyBreadcrumb from '/components/MyBreadcrumb';
import globalData from "/project.config";
import Detail from './detail';
import colConfig from './config.json';
import MenuFunBtn from './menuFunBtn';


const Sider = Layout.Sider;
const Content = Layout.Content;

class MenuIndex extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showDelBnt: false,
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.menuInfo) {
            let children = nextProps.menuList.filter((item) => item.pMenuId == nextProps.menuInfo.menuId && item.status !== 101003)
            this.setState({
                showDelBnt: children.length > 0
            });
        }
    }


    componentWillUnmount() {
        this.props.dispatch({
            type: `${colConfig.pageTag}/clearState`,
            payload: {},
        });
    }

    /**删除菜单 */
    deleteMenu = () => {
        this.props.dispatch({
            type: `${colConfig.pageTag}/queryDeleteMenusInfoEffect`,
            payload: {
                menuIdList: this.props.menuInfo.menuId,
                operator: globalData.userId,
                status: 101003,
            },
        });
    };

    render() {
        const { menuInfo } = this.props;
        const commonBtnStyle = {
            type: "primary",
            style: { margin: '5px' }
        }
        return (
            <div>
                <MyBreadcrumb itemList={['系统管理', '系统设置', '机构管理']} >
                    <MenuFunBtn
                        {...commonBtnStyle}
                        icon='plus'
                        disabled={menuInfo ? false : true}
                        actType='addInSameLevel'
                    >添加同级菜单</MenuFunBtn>
                    <MenuFunBtn
                        {...commonBtnStyle}
                        icon='plus'
                        disabled={menuInfo ? false : true}
                        actType='add'
                    >添加子菜单</MenuFunBtn>
                    <Popconfirm title="请确认是否删除？" cancelText="取消" okText="确定" onConfirm={this.deleteMenu}>
                        <Button
                            {...commonBtnStyle}
                            disabled={this.state.showDelBnt || !menuInfo}
                            icon="minus"
                        >删除</Button>
                    </Popconfirm>
                    <MenuFunBtn
                        {...commonBtnStyle}
                        icon='edit'
                        disabled={menuInfo ? false : true}
                        actType='upd'
                    >修改</MenuFunBtn>
                </MyBreadcrumb>
                <Layout>
                    <Sider style={{
                        height: '65vh',
                        background: 'white',
                        marginRight: '3px',
                        paddingRight: '8px',
                        overflow: 'auto'
                    }}>
                        <MenuManage />
                    </Sider>
                    <Content style={{ padding: '0 20px 0 0', background: 'white' }}>
                        <Detail />
                    </Content>
                </Layout>
            </div >

        );
    }
}


function mapStateToProps(state) {
    return {
        menuInfo: state[colConfig.pageTag].menuInfo, //当前选中的menuInfo
        menuList: state[colConfig.pageTag].menuList, //所有的菜单信息列表
    };
}

export default connect(mapStateToProps)(MenuIndex);
