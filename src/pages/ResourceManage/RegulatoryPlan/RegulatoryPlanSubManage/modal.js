import React, { Component } from 'react';
import { connect } from 'dva';
import { Route } from 'dva/router';
import { Form, Input, Select, Modal, Table, message } from 'antd';
import globalData from "/project.config";
import colConfig from './config.json';
import planColConfig from '../RegulatoryPlanManage/config.json';
import OpenSearchPanel from '/components/OpenSearchPanel';


const FormItem = Form.Item;

class RegPlanModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataInfo: null,
    };
  }

  columns = planColConfig && Object.keys(planColConfig.fieldInfo)
    .filter(key => planColConfig.fieldInfo[key].isInList === '是')
    .map(key => {
        const item = planColConfig.fieldInfo[key];
        return {
            title: item.fieldName,
            dataIndex: item.fieldId,
            key: item.fieldId
        }
    });


    /**
     * 按条件进行搜索，搜索成功后，搜索条件会放置到store的curQueryStr变量中
     */
    onSearch = () => {
        let whereCond = {
            pageSize: colConfig.cacheMode ? 9999 : globalData.pageSize, //如使用缓存模式，则一次性全部查询完，不分页
            pageNum: 1 //每次点击按钮查询，当前查询页置为1
        };
        let fieldValues = this.props.form.getFieldsValue();
        Object.keys(fieldValues)
            .filter(key => !!fieldValues[key])
            .forEach(key => {
                const isTreeSelect = colConfig.fieldInfo[key] && colConfig.fieldInfo[key].controlType === '下拉列表-级联' && Array.isArray(fieldValues[key])
                whereCond[key] = isTreeSelect ? fieldValues[key][fieldValues[key].length - 1] : fieldValues[key];
            });
        this.props.dispatch({
            type: `${colConfig.pageTag}/queryModalData`,
            payload: whereCond,
        });
    }


  //双击一条记录 获取数据将数据传给close方法-拿所需数据并关闭弹窗
  onRowDoubleClick = (record, index, event) => {
    this.props.close(record);
  };

  //将rowSelection方法选择的记录，存到state的dataInfo中
  rowSelectionChange = (selectedRowKeys, selectedRows) => {
    this.state.dataInfo = selectedRows[0];
  };

  //确定按钮 判断数据是否存在如果存在将数据传给close方法-拿所需数据并关闭弹窗
  onOk = () => {
    if (this.state.dataInfo) {
      this.props.close(this.state.dataInfo);
    } else {
      message.warning('请选择!', 2)
    }
  };

  render() {
    let me = this;
    const {dataModal, style} = this.props;
    const formItemLayout = {
      labelCol: {span: 8},
      wrapperCol: {span: 16}
    };
    const {getFieldDecorator} = this.props.form;
    const rowSelection = {
      type: 'radio',
      onChange: (selectedRowKeys, selectedRows) => {
        this.rowSelectionChange(selectedRowKeys, selectedRows);
      },
      getCheckboxProps: record => ({}),
    };
    return (
      <div>
      <Modal
        title="规划块信息"
        visible={this.props.visible}
        onOk={this.onOk}
        onCancel={() => {
          this.props.close();
        }}
        style={{maxHeight: '400px', paddingBottom: '0'}}
        width='70%'
        okText="确认"
        cancelText="取消"
      >
          <OpenSearchPanel form={this.props.form} onSearch={this.onSearch} displayNum={2}>

            <FormItem {...formItemLayout} label='规划块编号'>
              {getFieldDecorator('regPlanId')(
                <Input id='regPlanId' placeholder="请输入规划块编号"/>
              )}
            </FormItem>


            <FormItem {...formItemLayout} label='规划块名称'>
              {getFieldDecorator('regplanName')(
                <Input id='regplanName' placeholder="请输入规划块名称"/>
              )}
            </FormItem>


            {<FormItem {...formItemLayout} label='指标分类'>
                {getFieldDecorator('indexClass' ,{initialValue:''})(
                    <Select>
                        <Select.Option value="">请选择</Select.Option>
                        <Select.Option value="1">规划指标</Select.Option>
                        <Select.Option value="2">实施指标</Select.Option>
                    </Select>
                )}
            </FormItem>}

          </OpenSearchPanel>
          <Table columns={this.columns}
                 rowKey={colConfig.pKey}
                 dataSource={dataModal}
                 size={"small"}
                 style={style}
                 pagination={{
                  pageSize: this.props.pageSizeModal,
                  total: this.props.totalNumModal,
                  showQuickJumper: true,
                  showTotal: total => `共 ${total} 项`,
                  onChange(page, pageSize) {
                      if (!colConfig.cacheMode) { //在缓存模式下，分页不请求服务
                          me.props.dispatch({
                              type: `${colConfig.pageTag}/nextMoadlPage`,
                              payload: {
                                  pageNum: page,
                                  pageSize: pageSize,
                                }
                          })
                      }
                    }
                }}
                 rowSelection={rowSelection}
                 onRowDoubleClick={this.onRowDoubleClick}>
            >
          </Table>
      </Modal>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    pageNumModal: state[colConfig.pageTag].pageNumModal, 
    pageSizeModal: state[colConfig.pageTag].pageSizeModal,
    dataModal: state[colConfig.pageTag].dataModal,
    totalNumModal: state[colConfig.pageTag].totalNumModal,
  }
}
const WrappedAdvancedSearchForm = Form.create()(RegPlanModal);
export default connect(mapStateToProps)(WrappedAdvancedSearchForm);
