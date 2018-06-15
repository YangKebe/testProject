import React from 'react';
import { Cascader } from 'antd';



export default class InputFromTree extends React.PureComponent {

    /**
     * 生成树的子节点
     */

    getOptions = (array, id = 'typeId', name = 'typeName', pid = 'pTypeId', children = 'children') => {
        let result = [];
        if (Array.isArray(array) && array[0] && array[0][id]) {

            let data = array.map(the => ({
                value: the[id],
                label: the[name],
                pid: the[pid]
            }));

            let hash = {};
            data.forEach(item => hash[item.value] = item);

            data.forEach(item => {
                let hashVP = hash[item.pid];
                if (hashVP) {
                    !hashVP[children] && (hashVP[children] = []);
                    hashVP[children].push(item);
                } else {
                    result.push(item);
                }
            });
        }
        return result;
    }

    displayRender = label => {
        return label[label.length - 1];
    }

    render() {
        const { treeData, onSelectTreeNode, ...restProps } = this.props;
        const options = this.getOptions(treeData);
        return (<Cascader
            {...restProps}
            options={options}
            expandTrigger="hover"
            displayRender={this.displayRender}
            onChange={onSelectTreeNode}
        />);

    }

}
