import React from 'react';
import { Form } from 'antd';

/**
 * 用于弹出窗中的输入项的显示
 */
class PopupItemGroup extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  /**
   * 生成子项
   */
  getFields() {
    const subControls = React.Children.map(this.props.children, (formItem, index) => {
      return (
        <div key={`groupItem_${index}`} style={{marginBottom:'10px'}}>
          {formItem}
        </div>
      );
    });
    return subControls;
  }


  render() {
    const formStyle = {
      padding: '0 12px 0 12px',
      background: 'white'
    };
    return (
      <Form style={formStyle}>
        {this.getFields()}
      </Form>
    );
  }
}

export default PopupItemGroup;
