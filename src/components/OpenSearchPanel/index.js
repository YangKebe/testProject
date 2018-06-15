import React from 'react';
import { Row, Col, Form, Button, Icon } from 'antd';
import styles from './index.less';


/**
 * 列表搜索面板组件，提供自动隐藏，清空等选项
 * 默认打开
 */
class OpenSearchPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expand: this.props.expand !== false,
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
                    if (values[key]) {
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
        let allCols = 0;
        let { children, displayNum } = this.props;
        displayNum = this.state.expand ? 999 : displayNum;

        let subControls = React.Children.map(children, (key, index) => {
            let colSpans = key.props && Number(key.props.colSpans) || 1;
            colSpans = colSpans > 0 ? colSpans : 1;
            allCols = allCols + (index < displayNum ? colSpans : 0);
            return (<Col span={8 * colSpans} key={'item_col_' + index} style={{ display: index < displayNum ? 'block' : 'none' }}>
                <div className='MyFormItemGroup'>
                    {key}
                </div>
            </Col>);
        });

        // const count = this.props.children.length;
        //增加按钮选型
        subControls.push(
            <Col key='btn_col' span={24 - (allCols % 3) * 8} style={{ textAlign: 'right' }}>
                <Button key='btn_search' type="primary" onClick={this.handleSearch}>搜索</Button>
                <Button key='btn_clear' style={{ marginLeft: 8 }} onClick={this.handleReset}>清空</Button>
                <a key='a_cllapse' style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
                    {this.state.expand ? '折叠' : '展开'} <Icon type={this.state.expand ? 'up' : 'down'} />
                </a>
            </Col>
        );

        return subControls;
    }

    render() {
        return (
            <Form className={styles.formStyle}>
                <Row gutter={40}>
                    {this.getFields()}
                </Row>
            </Form>
        );
    }
}

export default OpenSearchPanel;
