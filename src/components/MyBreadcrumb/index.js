import React from 'react';
import { Breadcrumb } from 'antd';

class MyBreadcrumb extends React.PureComponent {

    getItem() {
        let items = [];
        if (this.props.itemList) {
            items = this.props.itemList.map((v, i) => <Breadcrumb.Item key={'bread' + i}>{v}</Breadcrumb.Item>)
        }
        return items;
    }

    render() {
        return (
            <div style={{
                padding: '12px 0 12px 0',
                borderBottom: '1px solid #cccccc',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center'
            }}>
                <Breadcrumb >
                    {this.getItem()}
                </Breadcrumb>
                <div style={{ flex: 1 }}></div>
                <div style={{ paddingRight: '12px' }}>{this.props.children}</div>
            </div>
        );
    }
}

export default MyBreadcrumb;
