import React, { Component } from 'react';
import { Table, Button, message, Modal, Upload } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import globalData, { getDicNameById } from '/project.config';
import { exportTable } from '/utils/utils';
import { routerRedux } from 'dva/router';
import colConfig from './config.json';


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
            okText: '确定',
            cancelText: '取消',
            onOk() {
                me.props.dispatch({
                    type: `${pageTag}/deleteRecord`,
                    payload: {
                        planfileId: me.state.selectedRowKeys.toString(),
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
        this.props.dispatch({
            type: `${pageTag}/goToDetail`,
            payload: {
                pathname: `${this.props.match}/detail`,
                detailType: 'modify',
                record: this.props.data.find(item => item[colConfig.pKey] === recordKey)
            }
        });
    }


    /**
     * 选择项改变时的动作
    //  */
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys });
    };

    render() {
        const { data, pageSize, style, totalNum } = this.props;
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeys: selectedRowKeys,
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
                        onClick={() => {
                            this.dispatchDetail(this.state.selectedRowKeys[0]);
                        }}
                    >修改</Button>

                    <Button {...btnStyle}
                        size='small'
                        key='btnExport'
                        icon="upload"
                        onClick={() => exportTable(this.columns, this.props.data, '企业信息')}
                    >导出</Button>

                    <Upload {...globalData.upLoadConfig} {...ownerProps}>
                        <Button {...btnStyle}
                            key='btnImport'
                            size='small'
                            icon="download"
                        >导入</Button>
                    </Upload>

                    <Button {...btnStyle}
                        icon="download"
                        size='small'
                        onClick={() => window.open(globalData.upLoadModelUrl + "/templates/企业信息管理.xls")}
                    >下载模板</Button>
                </div>

                <Table columns={columns}
                    rowSelection={rowSelection}
                    rowKey={colConfig.pKey}
                    dataSource={sourceData}
                    size={"small"}
                    pagination={{
                        pageSize: pageSize,
                        total: totalNum,
                        showQuickJumper: true,
                        showTotal: total => `共 ${total} 项`,
                        onChange(page, pageSize) {
                            if (!colConfig.cacheMode) { //在缓存模式下，分页不请求服务
                                me.props.dispatch({
                                    type: `${colConfig.pageTag}/nextPage`,
                                    payload: {
                                        pageNum: page,
                                    }
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
    };
}

export default connect(mapStateToProps)(DataTable);
