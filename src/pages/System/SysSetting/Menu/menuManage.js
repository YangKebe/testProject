import React from 'react';
import { Form } from 'antd';
import { connect } from 'dva';
import colConfig from './config.json';
import CurdTree from '/components/MyTree';

class MenuManage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            type: 'add',
            selectedNode: null
        }

        // /**初始化查询所有菜单 */
        this.props.dispatch({
            type: `${colConfig.pageTag}/queryMenusTreeDataListEffect`,
            payload: {},
        });
        
    }


    /**
     * 点击角色节点的响应事件
     */
    onClickNode = (curNode, selected) => {
        this.props.dispatch({
            type: `${colConfig.pageTag}/menuInfo`,
            payload: selected ? { ...curNode } : null
        })
    }

    render() {

        const { menuList } = this.props;

        if(menuList.length === 0){
            return null;
        }

        /**menuList 没有过滤是删除状态的数据，在此过滤 */
        let sourceData = [];
        if(menuList) {
            sourceData = menuList.filter(item => item.status !== 101003);
        }
        return (
            <div >
                <CurdTree
                    treeData={sourceData}
                    hideFunIcon={true}
                    onClickNode={this.onClickNode}
                    fieldMatch={{ id: 'menuId', pId: 'pMenuId', name: 'menuName' }}
                />
            </div>

        );
    }
}


const WrappedAdvancedForm = Form.create()(MenuManage);

function mapStateToProps(state) {
    return {
        menuList: state[colConfig.pageTag].menuList,
    };
}
export default connect(mapStateToProps, null, null, { withRef: true })(WrappedAdvancedForm);
