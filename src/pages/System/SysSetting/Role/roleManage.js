import React from 'react';
import { Form, Tree, Input, Icon, Col, Row, Modal, message } from 'antd';
import { connect } from 'dva';
import globalData from "/project.config";
import styles from './roleManage.css';
import CurdTree from '/components/MyTree';
import colConfig from './config.json';
import globalConfig from '/project.config.json';

class RoleManage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            type: 'add',
            selectedNode: null
        }
        this.showModal = this.showModal.bind(this);
    }


    componentDidMount() {
        this.props.dispatch({
            type: `${colConfig.pageTag}/getRoleList`,
            payload: {
                sysCode: globalData.sysCode
            }
        });
    }

    /**
     * 修改和新增角色时的提交处理
     */
    onSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (this.state.type === 'add') {
                    this.props.dispatch({
                        type: `${colConfig.pageTag}/addRole`,
                        payload: {
                            roleName: values['roleName'],
                            pRoleId: this.state.selectedNode.roleId,
                            remark: values['roleDesc'],
                            status: 101001,
                            operator: globalData.userId,
                            sysCode: globalData.sysCode,
                        }
                    });
                }
                else {
                    this.props.dispatch({
                        type: `${colConfig.pageTag}/changeRole`,
                        payload: {
                            roleName: values['roleName'],
                            roleId: this.state.selectedNode.roleId,
                            remark: values['roleDesc'],
                            operator: globalData.userId
                        }
                    })
                }

                this.setState({ showModal: false });

            }
            else {
                message.error('请正确填写！');
            }
        });
    }

    showModal(e, curNode, type) {
        e.stopPropagation();
        if (curNode) {
            this.setState({
                showModal: true,
                selectedNode: curNode,
                type,
            });
        }
        else {
            message.error('请选取节点');
        }
    }

    reduceRole = (event, curNode) => {
        event.stopPropagation();

        let me = this;
        Modal.confirm({
            title: '确定删除当前角色?',
            content: '请慎重选择！',
            okText: "确定",
            cancelText: "取消",
            onOk() {
                me.props.dispatch({
                    type: `${colConfig.pageTag}/removeRole`,
                    payload: {
                        roleIdList: curNode.roleId + "",
                        operator: globalData.userId,
                        status: 101003,
                    }
                })
            },
            onCancel() {
            },
        });
    }


    /**
     * 点击角色节点的响应事件
     */
    onClickNode = (curNode, selected) => {
        let payload = {};
        if(selected) {
            let roleId = curNode.roleId;
            payload = {
                roleId: roleId,
                sysCode: globalData.sysCode,
                rows: globalConfig.pageSize,
                page: 1,
            }
        }else {
            payload = {
                rows: globalConfig.pageSize,
                page: 1,
            }
        }
        this.props.dispatch({
            type: `${colConfig.pageTag}/queryByWhere`,
            payload: payload
        })
    }

    render() {
        const { getFieldDecorator, } = this.props.form;
        const { roleList } = this.props;

        return (
            <div >
                <CurdTree
                    treeData={roleList}
                    addFn={(e, curNode) => this.showModal(e, curNode, 'add')}
                    editFn={(e, curNode) => this.showModal(e, curNode, 'edit')}
                    removeFn={this.reduceRole}
                    onClickNode={this.onClickNode}
                    fieldMatch={{ id: 'roleId', pId: 'pRoleId', name: 'roleName' }}
                />
                <Modal
                    title={this.state.type === 'add' ? "增加角色信息" : '修改角色信息'}
                    visible={this.state.showModal}
                    onCancel={() => this.setState({ showModal: false })}
                    onOk={this.onSubmit}
                    className={styles.modalContent}
                    destroyOnClose={true}
                    okText='确定'
                    cancelText='取消'
                >
                    <Row align="middle">
                        <Col span={4}><span style={{ lineHeight: '28px' }}>角色名称：</span></Col>
                        <Col span={20}>
                            {getFieldDecorator('roleName', { initialValue: this.state.type === 'edit' ? this.state.selectedNode.roleName : '', rules: [{ required: true }], })(
                                <Input placeholder='请填写角色名称' />
                            )}
                        </Col>
                    </Row>

                    <Row align="middle" style={{ marginTop: '0.6rem' }}>
                        <Col span={4}><span style={{ lineHeight: '28px' }}>角色描述：</span></Col>
                        <Col span={20}>
                            {getFieldDecorator('roleDesc', { initialValue: this.state.type === 'edit' ? this.state.selectedNode.remark : '', rules: [{ required: true }], })(
                                <Input placeholder='请填写角色描述' />
                            )}
                        </Col>
                    </Row>

                </Modal>
            </div>

        );
    }
}


const WrappedAdvancedForm = Form.create()(RoleManage);

function mapStateToProps(state) {
    return {
        roleList: state.Role.roleList,
    };
}
export default connect(mapStateToProps, null, null, { withRef: true })(WrappedAdvancedForm);
