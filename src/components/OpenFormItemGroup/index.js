import React from 'react';
import styles from './index.less';
import { Row, Col, Icon } from 'antd';

/**
 *输入项分组组件，提供折叠控制
 */
class OpenFormItemGroup extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            expand: true,
        }
    }
    /**折叠控制 */
    toggle = () => {
        const { expand } = this.state;
        this.setState({ expand: !expand });
    }

    static defaultProps = {
        colNumPerRow: 3, //每行几列
        hideTitleBar:false,
        title:'',
    }

    /**
     * 生成子项
     */
    getFields() {

        const subControls = React.Children.map(this.props.children, (key, index) => {
            const colSpans = key.props.colSpans || 1;
            return (
                <Col span={24 / this.props.colNumPerRow * colSpans} key={index}>
                    <div className='MyFormItemGroup'>
                        {key}
                    </div>
                </Col>
            );
        }) || [];
        return subControls;
    }


    render() {
        const titleBarStyle = {
            paddingLeft: '12px',
            paddingRight: '12px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            height: '40px',
            background: '#E8E7E6',
        };
        const contentStyle = {
            padding: '20px 12px 0px 12px',
            background: !!this.props.hideTitleBar ? 'white' : '#fbfbfb',
            border: !!this.props.hideTitleBar ? '' : '1px solid #d9d9d9',
            marginTop: '-2px',
        };

        let titleBar = !!this.props.hideTitleBar ? '' : (
            <div style={titleBarStyle} onClick={this.toggle}>
                <div>{this.props.title}</div>
                <div style={{ flex: 1 }}></div>
                <div>{this.state.expand ? <Icon type='up' /> : <Icon type='down' />}</div>
            </div>
        );


        return (
            <div style={{ marginBottom: '15px' }}>
                {titleBar}
                <div style={{ ...contentStyle, display: this.state.expand ? 'block' : 'none' }} >

                    <Row gutter={40} >
                        {this.getFields()}
                    </Row>
                </div>

            </div>

        );
    }
}

export default OpenFormItemGroup;
