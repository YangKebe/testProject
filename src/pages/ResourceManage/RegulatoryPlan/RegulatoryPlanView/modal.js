import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Table, Input, Form, Divider} from 'antd';
import colConfig from './config.json';
import planSubcolConfig from '../RegulatoryPlanSubManage/config.json';
import fileConfig from '../../PlanFile/FileManage/config.json';



const FormItem = Form.Item;

class RegulatoryPlanModal extends Component {
  constructor(props) {
    super(props);
  }

  columns = planSubcolConfig && Object.keys(planSubcolConfig.fieldInfo)
    .filter(key => planSubcolConfig.fieldInfo[key].isInList === '是')
    .map(key => {
        const item = planSubcolConfig.fieldInfo[key];
        return {
            title: item.fieldName,
            dataIndex: item.fieldId,
            key: item.fieldId
        }
    });

  render() {
    let that = this;
    return (
      <div>
      <Modal
          title="分地块规划控制指标"
          visible={this.props.visible}
          width={'80vw'}
          onCancel={() => {
            this.props.close();
          }}
          okText="确认"
          cancelText="取消"
        >
          <div className="infoImg">
            <img src={`${fileConfig.picUrlPre}`+this.props.planfileId} style={{ height: '100%', width: '100%' }} />
          </div>
          <Divider />
          <div></div>
          <div style={{ textAlign: 'center', fontSize: '22px', fontWeight: 'bold', marginBottom: '15px' }}>分地块规划控制指标</div>
          <Table columns={this.columns}
            rowKey={colConfig.pKey}
            size={"small"}
            dataSource={this.props.dataSource}
            pagination={{
              pageSize: this.props.pageSize, 
              total: this.props.total,
              current:this.props.pageNum,
              onChange(current, pageSize) {
                that.props.dispatch({
                  type: `${colConfig.pageTag}/nextPage`,
                  payload: {
                    pageNum: current,
                    pageSize: pageSize,
                    regPlanId: that.props.regPlanId
                  }
                })
              }
            }}
          >
          </Table>
        </Modal>
      </div>
    );
  }
}

function propsState(state) {
  return {
  }
}

const WrappedAdvancedSearchForm = Form.create()(RegulatoryPlanModal);
export default connect(propsState)(WrappedAdvancedSearchForm);
