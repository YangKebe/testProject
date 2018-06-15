import React, { Component } from 'react';
import { Table, Button, message, Modal, Upload, Popconfirm } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import globalData, { getDicNameById } from '/project.config';
import { exportTable } from '/utils/utils';
import colConfig from './config.json';
import ChangePassword from '/components/PasswordChange';
import globalConfig from '/project.config.json';
import SelectTree from '/components/MyTree/popSelectTree';


const pageTag = colConfig.pageTag;

const columns = colConfig && Object.keys(colConfig.fieldInfo)
    .filter(key => colConfig.fieldInfo[key].isInList === '是')
    .map(key => {
        const item = colConfig.fieldInfo[key];
        return {
            title: item.fieldName,
            dataIndex: item.fieldId,
            key: item.fieldId
        }
    });

let checkedKeys = [];

class DataTable extends Component {

    constructor() {
        super();
        this.state = {
            selectedRowKeys: [],
            selectedRows: [],
            showRoleModal: false,
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data) {
            if (nextProps.data != this.props.data) {
                this.setState({
                    selectedRows: [],
                    selectedRowKeys: [],
                })
            }
            checkedKeys = [];
            if (nextProps.userRoleInfo) {
                nextProps.userRoleInfo.map(item => item.auth && checkedKeys.push(item.roleId));
            }
        }
    }

    /**
     * 1. 将数据源的数据进行相应的处理，主要包括：日期转换为指定的格式，对字典进行翻译
     */
    dataFormatHandler = (tableData) => {
        let newRowData = [];
        if (Array.isArray(tableData)) {
            newRowData = tableData.map(rowSourceData => {
                const rowData = { ...rowSourceData };
                Object.keys(rowSourceData).forEach(rowKey => {
                    if (colConfig.fieldInfo[rowKey]) {
                        const dataType = colConfig.fieldInfo[rowKey].dataType;
                        const isDic = colConfig.fieldInfo[rowKey].isDic === '是';
                        //处理日期
                        if (dataType === "日期") {
                            rowData[rowKey] = moment(rowSourceData[rowKey]).format('YYYY-MM-DD');
                        }
                        else if (dataType === "时间") {
                            rowData[rowKey] = moment(rowSourceData[rowKey]).format('YYYY-MM-DD HH:mm:ss');
                        }

                        //处理字典转换
                        if (isDic) {
                            rowData[rowKey] = getDicNameById(rowSourceData[rowKey]);
                        }
                    }
                });
                return rowData;
            });
        }
        return newRowData;
    }

    /**
     * 新增一条记录
     */
    onAdd = () => {
        this.props.dispatch({
            type: `${pageTag}/goToDetail`,
            payload: {
                pathname: `${this.props.match}/detail`,
                detailType: 'add',
                record: null,
            }
        });
    };

    /**
     * 删除多条记录
     */
    onDelete = () => {
        let me = this;
        Modal.confirm({
            title: '删除',
            content: '确认删除？',
            cancelText: "取消",
            okText: "确定",
            onOk() {
                me.props.dispatch({
                    type: `${pageTag}/deleteRecord`,
                    payload: {
                        userIdList: me.state.selectedRowKeys.toString(),
                        operator: globalData.userId,
                        status: 101003
                    }
                });
            },
        });
    };

    /**
    * 双击列表行事件
    */
    onRow = record => {
        return {
            onDoubleClick: () => {
                this.dispatchDetail(record[colConfig.pKey]);
            }
        }
    };

    dispatchDetail = recordKey => {
        let record = this.props.data.find(item => item[colConfig.pKey] === recordKey);
        console.log('asas',this.props)
        this.props.dispatch({
            type: `${pageTag}/goToDetail`,
            payload: {
                pathname: `${this.props.match}/detail`,
                detailType: 'modify',
                record: record
            }
        });
    }

    //修改密码
    amendPassword = (userId, oldPwd, newPwd) => {
        this.props.dispatch({
            type: `${colConfig.pageTag}/queryPasswordModifyEffect`,
            payload: {
                userId: userId,
                oldPassword: oldPwd,
                newPassword: newPwd,
                operator: globalData.userId
            }
        });
    };

    //重置密码
    resetPassword = () => {
        this.props.dispatch({
            type: `${colConfig.pageTag}/queryPasswordResetEffect`,
            payload: {
                userId: this.state.selectedRowKeys[0],
                operator: globalData.userId
            }
        });
    };

    //账号冻结/启动  
    changeUserStatus = (status) => {
        this.props.dispatch({
            type: `${colConfig.pageTag}/queryAmendUserStatusEffect`,
            payload: {
                userId: this.state.selectedRowKeys[0],
                operator: globalData.userId,
                status: status
            }
        });
    };

    /**分配角色信息查询 */
    roleSet = () => {
        this.props.dispatch({
            type: `${colConfig.pageTag}/queryOneUserRoleInfoEffect`,
            payload: {
                userId: this.state.selectedRowKeys[0],
                sysCode: globalConfig.sysCode,
            }
        });
        this.setState({
            showRoleModal: true
        })
    };

    /**分配角色信息提交 */
    setRoleClickIt = (selectedKeys) => {
        this.setState({ showRoleModal: false });

        this.props.dispatch({
            type: `${colConfig.pageTag}/queryOneUserRoleAllotEffect`,
            payload: {
                userId: this.state.selectedRowKeys[0],
                roleIdList: selectedKeys.toString(),
                sysCode: globalConfig.sysCode,
                status: 101001,
                operator: globalData.userId,
            }
        })
    }

    render() {
        const { data, pageSize, style, userRoleInfo } = this.props;
        console.log('adada', pageSize, this.props.totalNum)
        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeys, selectedRows
                });
            },
        }

        let sourceData = this.dataFormatHandler(data);
        let me = this;

        const ownerProps = {
            onChange(info) {
                if (info.file.response) {
                    if (info.file.response.retCode.status === '0000') {
                        message.success(`${info.file.name} 上传成功`);
                        me.props.dispatch({
                            type: `${pageTag}/queryByWhere`,
                        });
                    } else {
                        message.error(info.file.response.data);
                    }
                }
            },
        }

        const btnStyle = {
            style: { marginLeft: '5px' },
            type: 'primary',
            size:'small',
        }
        return (
            <div>
                <div style={{ marginTop: '15px', marginBottom: '5px' }}>
                    <Button
                        size='small'
                        key='btnAdd'
                        {...btnStyle}
                        icon="search"
                        onClick={this.onAdd}
                    >新增</Button>
                    <Button  {...btnStyle}
                        size='small'
                        key='btnReduce'
                        icon="minus"
                        onClick={this.onDelete}
                        disabled={this.state.selectedRowKeys.length === 0 ? true : false}
                    >删除</Button>

                    <Button  {...btnStyle}
                        size='small'
                        key='btnChange'
                        icon="edit"
                        disabled={this.state.selectedRowKeys.length === 1 ? false : true}
                        onClick={() => this.dispatchDetail(this.state.selectedRowKeys[0])}
                    >修改</Button>

                    <ChangePassword
                        size='small'
                        style={{ margin: '5px' }}
                        disabled={!(this.state.selectedRowKeys && this.state.selectedRowKeys.length === 1)}
                        myClick={() => this.state.selectedRowKeys[0]}
                        onOk={(userId, oldPwd, newPwd) => {
                            this.amendPassword(userId, oldPwd, newPwd);
                        }}
                    />

                    <Popconfirm title="请确认是否密码重置？" okText="确定" cancelText="取消" placement="top"
                        onConfirm={this.resetPassword}>
                        <Button
                            size='small'
                            type="primary"
                            style={{ margin: '5px' }}
                            disabled={!(this.state.selectedRowKeys && this.state.selectedRowKeys.length === 1)}
                        >
                            密码重置</Button>
                    </Popconfirm>

                    <Popconfirm title="请确认是否账号冻结？" okText="确定" cancelText="取消" placement="top"
                        onConfirm={() => this.changeUserStatus('101002')}>
                        <Button
                            size='small'
                            type="primary"
                            style={{ margin: '5px' }}
                            disabled={!(this.state.selectedRowKeys && this.state.selectedRowKeys.length === 1 && this.state.selectedRows[0].status.indexOf('冻结') <= -1)}
                        >
                            账号冻结</Button>
                    </Popconfirm>

                    <Popconfirm title="请确认是否账号启用？" okText="确定" cancelText="取消" placement="top"
                        onConfirm={() => this.changeUserStatus('101001')}>
                        <Button
                            size='small'
                            type="primary"
                            style={{ margin: '5px' }}
                            disabled={!(this.state.selectedRowKeys && this.state.selectedRowKeys.length === 1 && this.state.selectedRows[0].status.indexOf('冻结') > -1)}
                        >
                            账号启用</Button>
                    </Popconfirm>

                    <Button type="primary"
                        size='small'
                        style={{ margin: '5px' }}
                        disabled={!(this.state.selectedRowKeys && this.state.selectedRowKeys.length === 1)}
                        onClick={this.roleSet}
                    >分配角色
                    </Button>
                    <SelectTree
                        title='分配角色'
                        treeData={userRoleInfo}
                        fieldMatch={{ id: 'roleId', pId: 'pRoleId', name: 'roleName' }}
                        onOk={(selectedKeys) => {
                            this.setRoleClickIt(selectedKeys);
                        }}
                        showModal={this.state.showRoleModal}
                        onCancel={() => { this.setState({ showRoleModal: false }) }}
                        checkedKeys={checkedKeys}
                    />

                    <Button {...btnStyle}
                        size='small'
                        key='btnExport'
                        icon="upload"
                        onClick={() => exportTable(this.columns, this.props.data, '企业信息')}
                    >导出</Button>

                    <Upload {...globalData.upLoadConfig} {...ownerProps}>
                        <Button {...btnStyle}
                            size='small'
                            key='btnImport'
                            icon="download"
                        >导入</Button>
                    </Upload>

                    <Button {...btnStyle}
                        size='small'
                        icon="download"
                        onClick={() => window.open(globalData.upLoadModelUrl + "/templates/企业信息管理.xls")}
                    >下载模板</Button>
                </div>

                <Table columns={columns}
                    rowSelection={rowSelection}
                    rowKey={colConfig.pKey}
                    dataSource={sourceData}
                    size={"small"}
                    pagination={{
                        pageSize: pageSize || 5,
                        total: this.props.totalNum,
                        showQuickJumper: true,
                        showTotal: total => `共 ${total} 项`,
                        onChange(page, pageSize) {
                            if (!colConfig.cacheMode) { //在缓存模式下，分页不请求服务
                                me.props.dispatch({
                                    type: `${colConfig.pageTag}/nextPage`,
                                    payload: { page: page }
                                })
                            }
                        }
                    }}
                    style={style}
                    onRow={this.onRow}>
                </Table>
            </div >
        );
    }

}


function mapStateToProps(state) {
    return {
        pageSize: state[colConfig.pageTag].pageSize,
        data: state[colConfig.pageTag].curTableList,
        totalNum: state[colConfig.pageTag].totalNum,
        userRoleInfo: state[colConfig.pageTag].userRoleInfo,
    };
}

export default connect(mapStateToProps)(DataTable);
