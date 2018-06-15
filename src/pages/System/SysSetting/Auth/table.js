import React, { Component } from 'react';
import { Table, Button, Modal } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import globalData, { getDicNameById } from '/project.config';
import colConfig from './config.json';
import BtnTree from '/components/MyTree/btnTree';


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

class DataTable extends Component {

    constructor() {
        super();
        this.state = {
            selectedRowKeys: [],
            curRoleMenus: [],
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
     * 二、响应事件方法
     */

    componentDidMount() {
        let whereCond = {
            rows: colConfig.cacheMode ? 9999 : globalData.pageSize, //如使用缓存模式，则一次性全部查询完，不分页
            page: 1 //每次点击按钮查询，当前查询页置为1
        };
        this.props.dispatch({
            type: `${colConfig.pageTag}/queryByWhere`,
            payload: whereCond,
        });

        //要预加载menu的数据
    }

    /**
     * 删除多条记录
     */
    onDelete = () => {
        let me = this;
        Modal.confirm({
            title: '即将删除选定角色，请慎重考虑',
            content: '请确认是否删除？',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                me.props.dispatch({
                    type: `${colConfig.pageTag}/deleteRecord`,
                    payload: {
                        roleIdList: me.state.selectedRowKeys.toString(),
                        operator: globalData.userId,
                        status: 101003
                    }
                });
            },
        });
    };


    render() {
        const { curMenuData, tableData, pageSize, style } = this.props;
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeys: selectedRowKeys,
                });
            },
        }

        let sourceData = this.dataFormatHandler(tableData);

        let me = this;

        const btnStyle = {
            style: { marginLeft: '5px' },
            type: 'primary',
        }

        return (
            <div>
                <div style={{ marginTop: '15px', marginBottom: '5px' }}>
                    <Button  {...btnStyle}
                        size='small'
                        icon="minus"
                        onClick={this.onDelete}
                        disabled={this.state.selectedRowKeys.length === 0 ? true : false}
                    >删除角色</Button>

                    <BtnTree  {...btnStyle}
                        treeData={curMenuData}
                        disabled={this.state.selectedRowKeys.length === 1 ? false : true}
                        selectedKeys={this.props.curRoleMenuKeys}
                        fieldMatch={{ id: 'menuId', pId: 'pMenuId', name: 'menuName' }}
                        onBtnClick={() => {
                            this.props.dispatch({
                                type: pageTag + '/getMenuKeysByRoleId',
                                payload: this.state.selectedRowKeys[0]
                            });
                        }}
                        onSelect={selectedKeys => {
                            this.props.dispatch({
                                type: `${pageTag}/setRoleMenus`,
                                payload: {
                                    roleId: this.state.selectedRowKeys[0],
                                    menuIdList: selectedKeys.join(","),
                                    operator: globalData.userId,
                                    status: 101001
                                }
                            })
                        }}
                    >菜单权限设置</BtnTree>
                </div>

                <Table columns={columns}
                    rowSelection={rowSelection}
                    rowKey={colConfig.pKey}
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
                                    payload: { page: page }
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
        tableData: state[colConfig.pageTag].curTableList,
        totalNum: state[colConfig.pageTag].totalNum,
        curRoleMenuKeys: state[colConfig.pageTag].curRoleMenuKeys, //当前角色的菜单ID列表
        curMenuData: state[colConfig.pageTag].curMenuData, //当前的菜单配置
    };
}

export default connect(mapStateToProps)(DataTable);
