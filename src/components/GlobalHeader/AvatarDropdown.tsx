import { Avatar, Icon, Menu, Spin, message } from 'antd';
import { ClickParam } from 'antd/es/menu';
import { FormattedMessage } from 'umi-plugin-react/locale';
import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import ChangePass from './ChangePass'
import request from '@/utils/request';

import { ConnectProps, ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

export interface GlobalHeaderRightProps extends ConnectProps {
  currentUser: CurrentUser;
  menu?: boolean;
}

class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {

  state = {
    modalVisible: false,
  }

  handleModalVisible = (flag: boolean) => {
    this.setState({
      modalVisible: !!flag
    })
  }

  handlePut = (fieldsValue: {
    username: string;
    id: string;
    password: string;
  }) => {
    const { currentUser } = this.props;
    console.log(currentUser)
    request(`/api/biz/user/${currentUser.id}/password`, {
      params: fieldsValue
    }).then((res: ResParams2) => {
      if (res.code == '0') {
        message.success('修改成功')
        this.setState({
          modalVisible: false
        })
      }
    })
  }

  onMenuClick = (event: ClickParam) => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;
      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }

      return;
    }
    if (key === 'changePass') {
      this.setState({
        modalVisible: true,
      })

      return;
    }
    router.push(`/account/${key}`);
  };

  render(): React.ReactNode {
    const { currentUser = { avatar: '', name: '', organizationName: '' }, menu } = this.props;
    console.log(currentUser)
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {/* {menu && (
          <Menu.Item key="center">
            <Icon type="user" />
            <FormattedMessage id="menu.account.center" defaultMessage="account center" />
          </Menu.Item>
        )}
        {menu && (
          <Menu.Item key="settings">
            <Icon type="setting" />
            <FormattedMessage id="menu.account.settings" defaultMessage="account settings" />
          </Menu.Item>
        )}
        {menu && <Menu.Divider />} */}
        <Menu.Item key="changePass">
          <Icon type="setting" />
          <FormattedMessage id="menu.account.password" defaultMessage="account settings" />
        </Menu.Item>
        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>

      </Menu>
    );

    return currentUser && currentUser.name ? (
      <span>
        <HeaderDropdown overlay={menuHeaderDropdown}>
          {/* <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" />
          <span className={styles.name}>{currentUser.name}</span>
        </span> */}
          <span className={`${styles.action} ${styles.account}`}>{currentUser.organizationName || currentUser.name}</span>
        </HeaderDropdown>
        <ChangePass handleModalVisible={this.handleModalVisible} handlePut={this.handlePut} modalVisible={this.state.modalVisible}></ChangePass>
      </span>

    ) : (
        <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
      );
  }
}
export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);
