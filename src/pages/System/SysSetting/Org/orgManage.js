import React from 'react';
import { Form, Tree, Input, Icon, Col, Row, Modal, message } from 'antd';
import { connect } from 'dva';
import globalData from "/project.config";
import styles from './orgManage.css';
import colConfig from './config.json';
import CurdTree from '/components/MyTree';
import globalConfig from '/project.config.json';

class OrgManage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            type: 'add',
            nodeSelected: false,
        }
    }

    componentWillMount() {
        this.props.dispatch({
            type: `${colConfig.pageTag}/queryOrganizationTreeListEffect`,
            payload: {},
        });
    }

    /**
     * 点击角色节点的响应事件
     */
    onClickNode = (curNode, selected) => {
        this.props.dispatch({
            type: `${colConfig.pageTag}/organizationInfo`,
            payload: selected ? { ...curNode } : null
        })
    }

    render() {
        const { getFieldDecorator, } = this.props.form;
        const { organizationList } = this.props;

        /**menuList 没有过滤是删除状态的数据，在此过滤 */
        let sourceData = [];
        if (organizationList) {
            sourceData = organizationList.filter(item => item.status !== 101003);
        }
        return (
            <div >
                <CurdTree
                    treeData={sourceData}
                    hideFunIcon={true}
                    onClickNode={this.onClickNode}
                    fieldMatch={{ id: 'orgId', pId: 'pOrgId', name: 'orgName' }}
                />
            </div>

        );
    }
}


const WrappedAdvancedForm = Form.create()(OrgManage);

function mapStateToProps(state) {
    return {
        organizationList: state[colConfig.pageTag].organizationList,
    };
}
export default connect(mapStateToProps, null, null, { withRef: true })(WrappedAdvancedForm);
