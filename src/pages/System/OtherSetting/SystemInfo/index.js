import React from 'react';
import globalConfig from '/project.config.json';
import styles from './index.less';

class DetaiPage extends React.PureComponent {

  render() {
    return (
      <div className={styles.systemInfo}>
        <div className={styles.box}>
          <div>
            <span>版本号：{globalConfig.version}</span>
            <span>联系人：{globalConfig.contact.contacts}</span>
          </div>
          <div>
            <span>电话：{globalConfig.contact.phone}</span>
            <span>邮箱：{globalConfig.contact.email}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default DetaiPage;
