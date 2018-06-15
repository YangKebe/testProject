import React from 'react';
import { Row, Col, Form, Button, Icon } from 'antd';

/**
 * 列表搜索面板组件，提供自动隐藏，清空等选项
 */
class OpenSearchPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: true,
      showButton: this.props.showButton != null ? this.props.showButton : true,
    }
  }

  /**
   * 执行搜索方法，搜索方法从外部传入
   */
  handleSearch = (e) => {
    e.preventDefault();
    let newValues = {};
    this.props.form.validateFields((err, values) => {
      if (!err) {
        for (let key in values) {
          if (values[key] && values[key] !== '') {
            newValues[key] = values[key];
          }
        }
        this.props.onSearch(newValues);
      }
    });
  }

  /**清空填入项 */
  handleReset = () => {
    this.props.form.resetFields();
    if (this.props.clearForm) {
      this.props.clearForm();
    }
  }

  /**折叠控制 */
  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  }

  /**
   * 生成子项
   */
  getFields() {
    const subControls = [];
    let allCols = 0;
    const displayNum = this.state.expand ? 999 : this.props.displayNum;
    let children = [];
    if (!this.props.children) {
      return;
    }
    if (!this.props.children.length) {
      children.push(this.props.children);
    } else {
      children = this.props.children
    }
    children.forEach((key, index) => {
      const colSpans = key.props.colSpans || 1;
      allCols = allCols + (index < displayNum ? colSpans : 0);
      subControls.push(
        <Col span={8 * colSpans} key={'item_col_' + index} style={{ display: index < displayNum ? 'block' : 'none' }}>
          <div className='MyFormItemGroup'>
            {key}
          </div>
        </Col>
      );
    });

    const count = this.props.children.length ? this.props.children.length : 0;
    //增加按钮选型
    if (this.state.showButton) {
      if (count >= 0 && count < 4) {
        subControls.push(
          <Col key='btn_col' span={24 - (allCols % 3) * 8} style={{ textAlign: 'right' }}>
            <Button key='btn_search' type="primary" onClick={this.handleSearch}>搜索</Button>
            <Button key='btn_clear' style={{ marginLeft: 8 }} onClick={this.handleReset}>清空</Button>
          </Col>
        )
      } else {
        subControls.push(
          <Col key='btn_col' span={24 - (allCols % 3) * 8} style={{ textAlign: 'right' }}>
            <Button key='btn_search' type="primary" onClick={this.handleSearch}>搜索</Button>
            <Button key='btn_clear' style={{ marginLeft: 8 }} onClick={this.handleReset}>清空</Button>
            <a key='a_cllapse' style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
              {this.state.expand ? '折叠' : '展开'} <Icon type={this.state.expand ? 'up' : 'down'} />
            </a>
          </Col>
        )
      }
    }

    return subControls;
  }


  render() {
    const formStyle = {
      // padding: '0px 12px 0px 0px',
      padding: '12px',
      background: '#fbfbfb',
      border: '1px solid #d9d9d9',
      borderRadius: '6px',
    };

    return (
      <Form style={formStyle}>
        {/*style={{ marginTop:"25px"}}*/}
        <Row gutter={40}>
          {this.getFields()}
        </Row>
      </Form>
    );
  }
}

export default OpenSearchPanel;
