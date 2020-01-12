import { Button, Card, Col, Divider, Form, Input, Row, message, Popconfirm, Select, DatePicker } from 'antd';
import React, { Component, Fragment } from 'react';

import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import { StateType } from './model';
// import CreateForm from './components/CreateForm';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import { TableListItem, TableListPagination, TableListParams, AddParams } from './data.d';
import { Common_Enum } from '@/services/common';
import { audit } from './service';
import DetailDrawer from './components/DetailDrawer';
import moment from 'moment';
import styles from './style.less';

const FormItem = Form.Item;
// const getValue = (obj: { [x: string]: string[] }) =>
//   Object.keys(obj)
//     .map(key => obj[key])
//     .join(',');

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'namespace_checkin/add'
      | 'namespace_checkin/fetch'
      | 'namespace_checkin/remove'
      | 'namespace_checkin/update'
    >
  >;
  loading: boolean;
  namespace_checkin: StateType;
}

interface TableListState {
  drawerVisible: boolean;
  modalVisible: boolean;
  updateModalVisible: boolean;
  selectedRows: TableListItem[];
  formValues: { [key: string]: string };
  stepFormValues: Partial<TableListItem>;
  type: 'add' | 'updata' | 'drawer';
  partyType: { [key: string]: string };
  auditType: { [key: string]: string };
  pageNo: number;
  pageSize: number;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    namespace_checkin,
    loading,
  }: {
    namespace_checkin: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    namespace_checkin,
    loading: loading.models.namespace_checkin,
  }),
)
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    drawerVisible: false,
    modalVisible: false,
    updateModalVisible: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    type: 'add',
    partyType: {},
    auditType: {},
    pageNo: 1,
    pageSize: 10,
  };

  columns: StandardTableColumnProps[] = [
    {
      title: '报到类型',
      dataIndex: 'partyType',
      render: (val: string) => this.state.partyType[val],
    },
    {
      title: '报到单位',
      dataIndex: 'departmentName',
    },
    {
      title: '报到时间',
      dataIndex: 'checkinTime',
    },
    {
      title: '联系人',
      dataIndex: 'checkorName',
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
    },
    {
      title: '审核状态',
      dataIndex: 'auditType',
      render: (val: string) => this.state.auditType[val],
    },
    {
      title: '发放积分',
      dataIndex: 'point',
    },

    {
      title: '操作',
      render: (record) => {
        let el = record.auditType == 'AUDITING' ? (
          <Fragment>
            <a href="javascript:void(0);" onClick={() => this.handleDrawerVisible(true, record)}>查看</a>
            <Divider type="vertical" />
            <Popconfirm
              title="通过审核吗？"
              onConfirm={() => this.handleAudit(record, true)}
              onCancel={() => this.handleAudit(record, false)}
              okText="通过"
              cancelText="拒绝"
            >
              <a>审核</a>
            </Popconfirm>
          </Fragment>
        ) : (
            <div>
              <a href="javascript:void(0);" onClick={() => this.handleDrawerVisible(true, record)}>查看</a>
            </div>
          );
        return el;
      },
    },
  ];

  columns2: StandardTableColumnProps[] = [
    {
      title: '报到类型',
      dataIndex: 'partyType',
      render: (val: string) => this.state.partyType[val],
    },
    {
      title: '报到单位',
      dataIndex: 'departmentName',
    },
    {
      title: '党组织名称',
      dataIndex: 'organizationName',
    },
    {
      title: '报到时间',
      dataIndex: 'checkinTime',
    },
    {
      title: '审核状态',
      dataIndex: 'auditType',
      render: (val: string) => this.state.auditType[val],
    },
    {
      title: '发放积分',
      dataIndex: 'point',
    },

    {
      title: '操作',
      render: (record) => {
        let el = record.auditType == 'AUDITING' ? (
          <Fragment>
            <a href="javascript:void(0);" onClick={() => this.handleDrawerVisible(true, record)}>查看</a>
            <Divider type="vertical" />
            <Popconfirm
              title="通过审核吗？"
              onConfirm={() => this.handleAudit(record, true)}
              onCancel={() => this.handleAudit(record, false)}
              okText="通过"
              cancelText="拒绝"
            >
              <a>审核</a>
            </Popconfirm>
          </Fragment>
        ) : (
            <div>
              <a href="javascript:void(0);" onClick={() => this.handleDrawerVisible(true, record)}>查看</a>
            </div>
          );
        return el;
      },
    },
  ];

  componentDidMount() {
    this.handleQuery();
    this.fetchCommon_Enum('PARTY_TYPE');
    this.fetchCommon_Enum('AUDIT_TYPE');
  }

  async fetchCommon_Enum(name: string) {
    const res: ResParams<{ [propName: string]: string }> = await Common_Enum(name);
    if (name === 'PARTY_TYPE') {
      this.setState({
        partyType: res.data,
      });
    } else {
      this.setState({
        auditType: res.data,
      });
    }
  }

  async handleAudit(record: TableListItem, boolean: boolean) {
    const res: ResParams2 = await audit({
      checkinId: record.id,
      auditType: boolean ? 'PASSED' : 'REFUSED',
      pointType: 'CHECKIN',
    });
    if (res.code == '0') {
      message.success('操作成功');
      this.handleQuery();
    }
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
      type: 'namespace_checkin/fetch',
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
      type: 'namespace_checkin/fetch',
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
          type: 'namespace_checkin/remove',
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

  handleDel = (id: string): void => {
    const { dispatch } = this.props;
    dispatch({
      type: 'namespace_checkin/remove',
      payload: id,
      callback: (res: ResParams2) => {
        if (res.code === '0') {
          message.success('删除成功');
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
      if (fieldsValue.time) {
        fieldsValue.beginDate = moment(fieldsValue.time[0]).format('YYYY-MM-DD');
        fieldsValue.endDate = moment(fieldsValue.time[1]).format('YYYY-MM-DD');
      }
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'namespace_checkin/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleDrawerVisible = (flag?: boolean, record?: Partial<TableListItem>) => {
    this.setState({
      drawerVisible: !!flag,
      stepFormValues: record || {},
      type: record ? 'drawer' : 'add'
    });
  };

  handleUpdateModalVisible = (flag?: boolean, record?: AddParams) => {
    console.log(flag);
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
      type: record ? 'updata' : 'add',
    });
  };

  handleQuery = (json?: TableListParams) => {
    const { dispatch } = this.props;
    // const { pageNo, pageSize } = this.state;
    dispatch({
      type: 'namespace_checkin/fetch',
      payload: {
        // pageNo,
        // pageSize,
        ...json,
      },
    });
  };

  handleAdd = (fields: AddParams) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'namespace_checkin/add',
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
      type: 'namespace_checkin/update',
      payload: fields,
      callback: (res: ResParams2) => {
        message.success('修改成功');
        this.handleUpdateModalVisible();
        this.handleQuery();
      },
    });
  };

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="关键字">
              {getFieldDecorator('keyword')(<Input placeholder="请输入关键字" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="报到类型">
              {getFieldDecorator('partyType')(
                <Select
                  // mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="请选择"
                  onChange={e => {
                    console.log(e);
                  }}
                >
                  <Select.Option value="CPC">
                    党员
                  </Select.Option>
                  <Select.Option value="ORG_APPLY">
                    党组织报到
                  </Select.Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="报到时间">
              {getFieldDecorator('time')(<DatePicker.RangePicker />)}
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
      namespace_checkin: { data },
      loading,
    } = this.props;
    console.log(data)

    const { type } = this.state;

    const { selectedRows, modalVisible, updateModalVisible, stepFormValues, formValues } = this.state;

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
              {/* <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button> */}
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
              columns={formValues.partyType == 'ORG_APPLY' ? this.columns2 : this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        {/* <CreateForm
          {...parentMethods}
          partyType={this.state.partyType}
          auditType={this.state.auditType}
          hasVal={false}
          modalVisible={modalVisible}
        />
        {type == 'updata' ? (
          <CreateForm
            {...updateMethods}
            partyType={this.state.partyType}
            auditType={this.state.auditType}
            hasVal={true}
            modalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null} */}
        {type == 'drawer' ? (
          <DetailDrawer
            partyType={this.state.partyType}
            auditType={this.state.auditType}
            values={stepFormValues}
            drawerVisible={this.state.drawerVisible}
            handleDrawerVisible={this.handleDrawerVisible}
          ></DetailDrawer>
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
