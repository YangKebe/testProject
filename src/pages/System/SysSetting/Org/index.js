import React from 'react';
import { connect } from 'dva';
import { Layout, Button, Popconfirm } from 'antd';
import OrgManage from './orgManage';
import MyBreadcrumb from '/components/MyBreadcrumb';
import globalData from "/project.config";
import Detail from './detail';
import colConfig from './config.json';
import OrgFunBtn from './orgFunBtn';


const Sider = Layout.Sider;
const Content = Layout.Content;


class OrgIndex extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showDelBnt: false,
            organizationModal: false,
            actType: '',
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.organizationInfo) {
            let children = nextProps.organizationList.filter((item) => item.pOrgId == nextProps.organizationInfo.orgId && item.status !== 101003)
            if (nextProps.organizationInfo.pOrgId == '0' || children.length > 0) {
                this.setState({
                    showDelBnt: true
                })
            } else {
                this.setState({
                    showDelBnt: false
                })
            }
        }
    }

    /**隐藏modal */
    modalCancel = () => {
        this.setState({
            organizationModal: false,
        });
    };


    componentWillUnmount() {
        this.props.dispatch({
            type: `${colConfig.pageTag}/clearState`,
            payload: {},
        });
    }

    /**删除部门 */
    deleteOrganization = () => {
        this.props.dispatch({
            type: `${colConfig.pageTag}/queryDeleteOrganizationEffect`,
            payload: {
                orgIdList: this.props.organizationInfo.orgId,
                operator: globalData.userId,
                status: 101003,
            },
        });
    };

    render() {
        const expandedKeys = [];
        const { organizationInfo } = this.props;
        const commonBtnStyle = {
            type: "primary",
            style: { margin: '5px' }
        }
        return (
            <div>
                <MyBreadcrumb itemList={['系统管理', '系统设置', '机构管理']} >
                    <OrgFunBtn
                        {...commonBtnStyle}
                        icon='plus'
                        disabled={organizationInfo ? false : true}
                        actType='addInSameLevel'
                    >添加同级部门</OrgFunBtn>
                    <OrgFunBtn
                        {...commonBtnStyle}
                        icon='plus'
                        disabled={organizationInfo ? false : true}
                        actType='add'
                    >添加子部门</OrgFunBtn>
                    <Popconfirm title="请确认是否删除？" cancelText="取消" okText="确定" onConfirm={this.deleteOrganization}>
                        <Button type="primary" style={{ margin: '5px' }} disabled={this.state.showDelBnt} icon="minus">删除</Button>
                    </Popconfirm>
                    <OrgFunBtn
                        {...commonBtnStyle}
                        icon='edit'
                        disabled={organizationInfo ? false : true}
                        actType='upd'
                    >修改</OrgFunBtn>
                </MyBreadcrumb>
                <Layout style={{ background: 'white' }}>
                    <Sider style={{ background: 'white', marginRight: '5px' }}>
                        <OrgManage />
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
        organizationInfo: state[colConfig.pageTag].organizationInfo,
        organizationList: state[colConfig.pageTag].organizationList,
    };
}

export default connect(mapStateToProps)(OrgIndex);
