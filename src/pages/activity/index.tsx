import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  message,
  Popover,
  Dropdown,
  Icon,
  Menu,
  Popconfirm,
} from 'antd';
import React, { Component, Fragment } from 'react';

import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import { StateType } from './model';
import CreateForm from './components/CreateForm';
import ModalComponent from './components/ModalComponent';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import DetailTable from './components/DetailDrawer';
import { TableListItem, TableListPagination, TableListParams, AddParams } from './data.d';
import { notice, qrcode } from './service';
import { Common_Enum } from '@/services/common';

import styles from './style.less';

const FormItem = Form.Item;

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'namespace_activity/add'
      | 'namespace_activity/fetch'
      | 'namespace_activity/remove'
      | 'namespace_activity/update'
    >
  >;
  loading: boolean;
  namespace_activity: StateType;
}

interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  noticeModalVisible: boolean;
  drawerVisible: boolean;
  selectedRows: TableListItem[];
  formValues: { [key: string]: string };
  stepFormValues: Partial<TableListItem>;
  type: 'add' | 'updata' | 'check' | 'apply';
  activeStatus: { [key: string]: string };
  serviceType: { [key: string]: string };
  pageNo: number;
  pageSize: number;
  qrcode: string;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    namespace_activity,
    loading,
  }: {
    namespace_activity: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    namespace_activity,
    loading: loading.models.namespace_activity,
  }),
)
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    modalVisible: false,
    updateModalVisible: false,
    noticeModalVisible: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    type: 'add',
    activeStatus: {},
    serviceType: {},
    pageNo: 1,
    pageSize: 10,
    qrcode: '',
  };

  columns: StandardTableColumnProps[] = [
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '发布单位',
      dataIndex: 'departmentName',
    },
    {
      title: '服务类型',
      dataIndex: 'serviceType',
      render: (val: string) => this.state.serviceType[val],
    },
    {
      title: '活动状态',
      dataIndex: 'activeStatus',
      render: (val: string) => this.state.activeStatus[val],
    },
    {
      title: '开始时间',
      dataIndex: 'begin',
    },
    {
      title: '人数上限',
      dataIndex: 'limit',
    },
    
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm
            title="确定吗?"
            onConfirm={() => this.handleDel(record)}
            okText="是"
            cancelText="否"
          >
            <a>{record.enabled ? '停用' : '启用'}</a>
          </Popconfirm>
          <Divider type="vertical" />
          <Dropdown
            placement="topRight"
            trigger={['click']}
            overlay={
              <Menu>
                <Menu.Item>
                  <a onClick={() => this.noticeVisible(true, record)}>发送短信</a>
                </Menu.Item>
                <Menu.Item>
                  <Popover
                    content={
                      this.state.qrcode ? (
                        <div style={{ width: '100px', height: '100px' }}>
                          <img
                            src={this.state.qrcode}
                            style={{ width: '100px', height: '100px' }}
                            alt=""
                          />
                        </div>
                      ) : null
                    }
                    trigger="click"
                  >
                    <a onClick={() => this.downQr(record)}>活动二维码</a>
                  </Popover>
                </Menu.Item>
                <Menu.Item>
                  <Popover
                    content={
                      <div style={{ width: '100px', height: '100px' }}>
                        <img
                          src={this.state.qrcode}
                          style={{ width: '100px', height: '100px' }}
                          alt=""
                        />
                      </div>
                    }
                    trigger="click"
                  >
                    <a onClick={() => this.downQr(record, 'CHECKIN')}>签到二维码</a>
                  </Popover>
                </Menu.Item>
                <Menu.Item>
                  <a onClick={() => this.handleDrawerVisible(true, record, 'check')}>
                    签到/签退记录
                  </a>
                </Menu.Item>
                <Menu.Item>
                  <a onClick={() => this.handleDrawerVisible(true, record, 'apply')}>报到记录</a>
                </Menu.Item>
              </Menu>
            }
          >
            <a className="ant-dropdown-link" href="#">
              更多 <Icon type="down" />
            </a>
          </Dropdown>
        </Fragment>
      ),
    },
  ];

  async componentDidMount() {
    const activeStatus: ResParams<{ [propName: string]: string }> = await Common_Enum(
      'ACTIVE_STATUS',
    );
    const serviceType: ResParams<{ [propName: string]: string }> = await Common_Enum(
      'SERVICE_TYPE',
    );
    this.setState({
      activeStatus: activeStatus.data,
      serviceType: serviceType.data,
    });
    this.handleQuery();
  }

  async downQr(record: TableListItem, channel?: 'CHECKIN') {
    let params = {
      code: record.code,
      width: '100',
      channel,
    };
    const res = await qrcode(params);
    console.log(res);
    let url = URL.createObjectURL(res);
    this.setState({
      qrcode: url,
    });
  }

  async GET_notice(record: TableListItem) {
    // const res: ResParams2 = await notice(record.department)
    // if (res.code === '0') {
    //   message.success('发送成功');
    // }
  }

  handleStandardTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Record<keyof TableListItem, string[]>,
    sorter: SorterResult<TableListItem>,
  ) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const params: Partial<TableListParams> = {
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
    };

    dispatch({
      type: 'namespace_activity/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'namespace_activity/fetch',
      payload: {},
    });
  };

  handleMenuClick = (e: { key: string }) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        let arr = selectedRows.map(row => row.id);
        let ids = arr.join();
        dispatch({
          type: 'namespace_activity/remove',
          payload: ids,
          callback: (res: ResParams2) => {
            if (res.code === '0') {
              message.success('删除成功');
              this.handleQuery();
            }
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleDel = (record: TableListItem): void => {
    const { dispatch } = this.props;
    dispatch({
      type: 'namespace_activity/remove',
      payload: {
        id: record.id,
        enabled: !record.enabled
      },
      callback: (res: ResParams2) => {
        if (res.code === '0') {
          message.success('操作成功');
          this.handleQuery();
        }
      },
    });
  };

  handleSelectRows = (rows: TableListItem[]) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'namespace_activity/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  noticeVisible = (flag?: boolean, record?: TableListItem) => {
    this.setState({
      noticeModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleUpdateModalVisible = (flag?: boolean, record?: TableListItem) => {
    console.log(flag);
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
      type: record ? 'updata' : 'add',
    });
  };

  handleDrawerVisible = (
    flag?: boolean,
    record?: Partial<TableListItem>,
    type?: 'apply' | 'check',
  ) => {
    this.setState({
      drawerVisible: !!flag,
      stepFormValues: record || {},
      type: type || 'add',
    });
  };

  handleQuery = (json?: TableListParams) => {
    const { dispatch } = this.props;
    const { pageNo, pageSize } = this.state;
    dispatch({
      type: 'namespace_activity/fetch',
      payload: {
        pageNo,
        pageSize,
        ...json,
      },
    });
  };

  handleAdd = (fields: AddParams) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'namespace_activity/add',
      payload: fields,
      callback: (response: ResParams2) => {
        if (response.code === '0') {
          message.success('添加成功');
          this.handleModalVisible();
          this.handleQuery();
        }
      },
    });
  };

  handleUpdate = (fields: AddParams) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'namespace_activity/update',
      payload: fields,
      callback: (res: ResParams2) => {
        message.success('修改成功');
        this.handleUpdateModalVisible();
        this.handleQuery();
      },
    });
  };

  handleNotice = async (fields: { departments: string }) => {
    const res: ResParams2 = await notice({
      activeId: this.state.stepFormValues.id,
      departmentIds: fields.departments,
    });
    if (res.code === '0') {
      message.success('发送成功');
      this.setState({
        noticeModalVisible: false,
        stepFormValues: {},
      });
    }
  };

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="关键字">
              {getFieldDecorator('keyword')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.renderSimpleForm();
  }

  render() {
    const {
      namespace_activity: { data },
      loading,
    } = this.props;

    const { type } = this.state;

    const {
      selectedRows,
      modalVisible,
      updateModalVisible,
      stepFormValues,
      noticeModalVisible,
    } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {/* {selectedRows.length > 0 && (
                <span>
                  <Button type="danger" onClick={() => this.handleMenuClick({ key: 'remove' })}>
                    批量删除
                  </Button>
                </span>
              )} */}
            </div>
            <StandardTable
              rowKey="id"
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          hasVal={false}
          modalVisible={modalVisible}
          activeStatus={this.state.activeStatus}
          serviceType={this.state.serviceType}
        />
        {noticeModalVisible ? (
          <ModalComponent
            handleAdd={this.handleNotice}
            handleModalVisible={this.noticeVisible}
            modalVisible={noticeModalVisible}
          ></ModalComponent>
        ) : null}
        {type == 'updata' ? (
          <CreateForm
            {...updateMethods}
            hasVal={true}
            activeStatus={this.state.activeStatus}
            serviceType={this.state.serviceType}
            modalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
        {type == 'check' || type == 'apply' ? (
          <DetailTable
            values={stepFormValues}
            type={type}
            drawerVisible={this.state.drawerVisible}
            handleDrawerVisible={this.handleDrawerVisible}
          ></DetailTable>
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
