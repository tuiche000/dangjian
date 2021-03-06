

import { Button, Card, Col, Divider, Form, Input, Row, message, Select, Table } from 'antd';
import React, { Component, Fragment } from 'react';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import { Dispatch, Action } from 'redux';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import { StateType } from './model';
import CreateForm from './components/CreateForm';
import { TableListItem, TableListPagination, TableListParams, AddParams } from './data.d';
import { Common_Enum } from '@/services/common';
import styles from './style.less';

const FormItem = Form.Item;
const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'namespace_department_user/add'
      | 'namespace_department_user/fetch'
      | 'namespace_department_user/remove'
      | 'namespace_department_user/update'
    >
  >;
  loading: boolean;
  namespace_department_user: StateType;
}
interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  selectedRows: TableListItem[];
  formValues: { [key: string]: string };
  stepFormValues: Partial<TableListItem>;
  type: 'add' | 'updata';
  types: { [key: string]: string };
  pageNo: number;
  pageSize: number;
  members: any[];
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    namespace_department_user,
    loading,
  }: {
    namespace_department_user: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    namespace_department_user,
    loading: loading.models.namespace_department_user,
  }),
)
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    modalVisible: false,
    updateModalVisible: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    type: 'add',
    types: {},
    pageNo: 1,
    pageSize: 10,
    members: [],
  };

  componentDidMount() {
    this.handleQuery();
    this.fetchCommon_Enum('PARTY_TYPE');
  }

  async fetchCommon_Enum(name: string) {
    const res: ResParams<{ [propName: string]: string }> = await Common_Enum(name);
    this.setState({
      types: res.data,
    });
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
      type: 'namespace_department_user/fetch',
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
      type: 'namespace_department_user/fetch',
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
          type: 'namespace_department_user/remove',
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
      type: 'namespace_department_user/remove',
      payload: {
        id: record.id,
        enabled: !record.enabled
      },
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

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      this.handleQuery(values)
    });
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
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
    const { pageNo, pageSize } = this.state;
    dispatch({
      type: 'namespace_department_user/fetch',
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
      type: 'namespace_department_user/add',
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
      type: 'namespace_department_user/update',
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
    const { types } = this.state;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="关键字">
              {getFieldDecorator('keyword')(<Input placeholder="输入姓名" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="报到类型">
              {getFieldDecorator('partyType', {
                // initialValue: 'CPC'
              })(
                <Select style={{ maxWidth: 220 }}>
                  <Select.Option value="CPC">
                    党员
                  </Select.Option>
                  <Select.Option value="MASSES">
                    群众
                  </Select.Option>
                </Select>,
              )}
            </FormItem>
            {/* <FormItem label="报到类型">
              {getFieldDecorator('partyType')(
                <Select style={{ maxWidth: 220 }}>
                  {Object.keys(types).length > 0
                    ? Object.keys(types).map(item => {
                        return (
                          <Select.Option key={item} value={item}>
                            {types[item]}
                          </Select.Option>
                        );
                      })
                    : null}
                </Select>,
              )}
            </FormItem> */}
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
    const { tableData, title, namespace_department_user: { data }, loading } = this.props

    const { type, selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };

    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '人员类型',
        dataIndex: 'partyType',
      },
      {
        title: '所属组织',
        dataIndex: 'organizationName',
      },
      {
        title: '所属单位',
        dataIndex: 'departmentName',
      },

      {
        title: '手机号',
        dataIndex: 'phone',
      },

      // {
      //   title: '报到时间',
      //   dataIndex: 'total',
      // },
      // {
      //   title: '兴趣爱好',
      //   dataIndex: 'total',
      // },
      {
        title: '操作',
        fixed: 'right',
        width: 150,
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleDel(record)}>{record.enabled ? '停用' : '启用'}</a>
          </Fragment>
        ),
      },
    ];
    return (
      <div>
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
            <Table columns={columns} bordered dataSource={this.state.members.length ? this.state.members : tableData} />
          </div>
        </Card>
        <CreateForm {...parentMethods} hasVal={false} modalVisible={modalVisible} />
        {
          type == 'updata' ? (
            <CreateForm
              {...updateMethods}
              hasVal={true}
              modalVisible={updateModalVisible}
              values={stepFormValues}
            />
          ) : null
        }
      </div>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
