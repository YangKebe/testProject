import React from 'react';
import { connect } from 'dva';
import { Popconfirm, Icon, Button, Modal, Tree } from 'antd';
import { arrayToTree } from 'components/MyTree/treeUtils';
import colConfig from './config.json';
import globalData from '/project.config';
import globalConfig from '/project.config.json';


const TreeNode = Tree.TreeNode;

/**
 *
 */
class UserAllotRoleModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedKeys: [],
    };
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    let checkArray = [];
    for (let i = 0; i < nextProps.userRoleInfo.length; i++) {
      if (nextProps.userRoleInfo[i].auth != '' && nextProps.userRoleInfo[i].auth != 'null' && nextProps.userRoleInfo[i].auth != null
        && nextProps.userRoleInfo[i].auth != undefined) {
        checkArray.push(nextProps.userRoleInfo[i].roleId);
      }
    }
    this.state.checkedKeys = checkArray;
  }

  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.roleName} key={item.roleId} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      } else {
        return <TreeNode title={item.roleName} key={item.roleId} dataRef={item} />;
      }
    });
  };
  onOk = () => {
    this.props.dispatch({
      type: `${colConfig.pageTag}/queryOneUserRoleAllotEffect`,
      payload: {
        userId: this.props.userInfo.userId,
        roleIdList: this.state.checkedKeys.toString(),
        status: '101001',
        operator: globalData.userId,
        sysCode: globalConfig.sysCode,
      },
    });
    this.props.closeModal();
  };
  onCheck = (checkedKeys) => {
    this.setState({ checkedKeys });
  };

  render() {
    const { openModal, closeModal, userRoleInfo } = this.props;
    return (
      <Modal
        title="角色分配"
        visible={openModal}
        onOk={this.onOk}
        onCancel={closeModal}
        style={{ maxHeight: '500px', paddingBottom: '0' }}
        width='35%'
        okText="确认"
        cancelText="取消"
      >
        <div style={{ height: '500px', overflow: 'auto', overflowX: 'hidden', paddingBottom: '0' }}>
          <Tree
            checkable
            defaultExpandAll={true}
            showLine
            onCheck={this.onCheck}
            checkedKeys={this.state.checkedKeys}
          >
            {this.renderTreeNodes(arrayToTree(userRoleInfo, null, 'roleId', 'pRoleId'))}
          </Tree>
        </div>
      </Modal>
    );
  }

}

function mapStateToProps(state) {
  return {
    userRoleInfo: state[colConfig.pageTag].userRoleInfo,
    userInfo: state[colConfig.pageTag].userInfo,
  };
}

export default connect(mapStateToProps)(UserAllotRoleModal);
