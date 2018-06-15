import React, { Component } from 'react';
import { Table, Button, message, Modal, Upload, Popconfirm } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import globalData, { getDicNameById } from '/project.config';
import { exportTable } from '/utils/utils';
import { routerRedux } from 'dva/router';
import colConfig from './config.json';
import globalConfig from '/project.config.json';


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


let usersSelect = '';
let userSelectArray = [];
let me;


class DataTable extends Component {

    constructor() {
        super();
        this.state = {
            selectedRowKeys: [],
            usersVisible: false,
            chooseArray: [],
            selectedRows: []
        }
    }

    userColumns = [
        {
            title: '用户账号',
            dataIndex: 'userId',
            key: 'userId',
        },
        {
            title: '用户姓名',
            dataIndex: 'userName',
            key: 'userName',
        },
        {
            title: '账号类型',
            dataIndex: 'userType',
            key: 'userType',
        },
        {
            title: '部门',
            dataIndex: 'orgName',
            key: 'orgName',
        },
    ]

    componentWillReceiveProps(nextProps) {
        if (nextProps.data) {
            if (nextProps.data != this.props.data) {
                this.setState({
                    selectedRows: [],
                    selectedRowKeys: [],
                    chooseArray: [],
                })
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
        if (this.props.selectedRoleId) {
            this.props.dispatch({
                type: `${colConfig.pageTag}/getUsers`,
                payload: {
                    status: 101001,
                    sysCode: globalConfig.sysCode,
                    roleId: this.props.selectedRoleId,
                    allotStatus: 1,
                    page: 1,
                    rows: globalConfig.pageSize
                }
            });

            this.setState({
                usersVisible: true
            });
        } else {
            message.warning('请选择角色');
        }
    };

    //删除用户角色关联
    onDelete = () => {
        this.props.dispatch({
            type: `${colConfig.pageTag}/deleteRoleAndUser`,
            payload: {
                idList: this.state.selectedRowKeys.toString(),
                status: 101003,
                operator: globalData.userId,
                roleId: this.props.selectedRoleId,//前端使用，后台不需要
            }
        });
        this.state.selectedRowKeys = [];
    };

    rowSelectChange = (selectedRowKeys, selectedRows) => {
        usersSelect = selectedRowKeys.toString();
        this.setState({
            chooseArray: selectedRowKeys
        });
    };


    addUsers = () => {
        this.setState({ usersVisible: false });
        if (this.props.selectedRoleId) {
            if (usersSelect) {
                this.props.dispatch({
                    type: `${pageTag}/setRoles`,
                    payload: {
                        userIdList: usersSelect,
                        roleId: this.props.selectedRoleId,
                        status: 101001,
                        operator: globalData.userId,
                        sysCode: globalConfig.sysCode,
                    }
                })
            } else {
                message.warning('请选择用户');
            }
        } else {
            message.warning('请选择角色');
        }
    };


    render() {
        const { data, pageSize, style, selectedRoleId, userList } = this.props;
        console.log('adada',pageSize,this.props.totalNum)
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
        }


        const rowSelectionUsers = {
            selectedRowKeys: this.state.chooseArray,
            onChange: this.rowSelectChange
        };

        return (
            <div>
                <div style={{ marginTop: '15px', marginBottom: '5px' }}>
                    <Button
                        size='small'
                        key='btnAdd'
                        {...btnStyle}
                        icon="search"
                        onClick={this.onAdd}
                    >添加用户</Button>

                    <Popconfirm title="请确认是否删除？"
                        cancelText="取消"
                        okText="确定"
                        onConfirm={() => {
                            this.onDelete();
                        }}>
                        <Button
                            size='small'
                            key='btnReduce'
                            {...btnStyle}
                            icon="minus"
                            disabled={this.state.selectedRowKeys.length === 0 ? true : false}
                        >删除用户</Button>
                    </Popconfirm>

                    <Button {...btnStyle}
                        size='small'
                        key='btnExport'
                        icon="upload"
                        onClick={() => exportTable(this.columns, this.props.data, '企业信息')}
                    >导出</Button>

                </div>

                <Modal
                    title="用户列表"
                    visible={this.state.usersVisible}
                    okText="确定"
                    cancelText="取消"
                    onOk={() => {
                        this.state.chooseArray = [];//清除当前选中的
                        this.addUsers()
                    }}
                    onCancel={() => {
                        this.setState({ usersVisible: false })
                        this.state.chooseArray = [];//清除当前选中的
                    }
                    }
                    width={'70%'}
                >
                    <Table columns={this.userColumns} rowKey='userId' dataSource={userList} size={"small"}
                        pagination={{
                            pageSize: globalData.pageSize,
                            current: this.props.userCurrentPage,
                            total: this.props.userTotalRecord,
                            onChange(page, pageSize) {
                                me.props.dispatch({
                                    type: `${pageTag}/getUsersNextPage`,
                                    payload: { page: page }
                                })
                            }
                        }}
                        style={style}
                        rowSelection={rowSelectionUsers}
                    ></Table>
                </Modal>

                <Table columns={columns}
                    rowSelection={rowSelection}
                    rowKey='id'
                    dataSource={sourceData}
                    size={"small"}
                    pagination={{
                        pageSize: pageSize,
                        total: this.props.totalNum,
                        showQuickJumper: true,
                        showTotal: total => `共 ${total} 项`,
                        onChange(page, pageSize) {
                            if (!colConfig.cacheMode) { //在缓存模式下，分页不请求服务
                                me.props.dispatch({
                                    type: `${colConfig.pageTag}/nextPage`,
                                    payload: {
                                        page: page
                                    }
                                })
                            }
                        }
                    }}
                    style={style}>
                </Table>
            </div >
        );
    }

}


function mapStateToProps(state) {
    return {
        pageSize: state[colConfig.pageTag].pageSize,
        data: state[colConfig.pageTag].curTableList,
        totalNum: state[colConfig.pageTag].totalRecord,
        selectedRoleId: state[colConfig.pageTag].selectedRoleId,
        userCurrentPage: state[colConfig.pageTag].userCurrentPage,
        userTotalRecord: state[colConfig.pageTag].userTotalRecord,
        userList: state[colConfig.pageTag].userList,
    };
}

export default connect(mapStateToProps)(DataTable);
