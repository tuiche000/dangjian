import { Button, Card, Col, Divider, Form, Input, Row, message, Select } from 'antd';
import React, { Component, Fragment } from 'react';

import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import { StateType } from './model';
import CreateForm from './components/CreateForm';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import { TableListItem, TableListPagination, TableListParams, AddParams } from './data.d';
import { reset, getUserSelf } from './service';
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
      | 'namespace_userManger/add'
      | 'namespace_userManger/fetch'
      | 'namespace_userManger/remove'
      | 'namespace_userManger/update'
    >
  >;
  loading: boolean;
  namespace_userManger: StateType;
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
  self: any;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    namespace_userManger,
    loading,
  }: {
    namespace_userManger: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    namespace_userManger,
    loading: loading.models.namespace_userManger,
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
    self: {},
  };

  columns: StandardTableColumnProps[] = [
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '名字',
      dataIndex: 'name',
    },
    {
      title: '电话',
      dataIndex: 'phone',
    },
    {
      title: '单位',
      dataIndex: 'departmentName',
    },
    {
      title: '积分',
      dataIndex: 'total',
    },
    // {
    //   title: '报到类型',
    //   dataIndex: 'partyType',
    //   render: (val: string) => this.state.types[val],
    // },
    // {
    //   title: '内容',
    //   dataIndex: 'content',
    //   render: (val: string) => {
    //     return <div className="td-overflow">{val}</div>;
    //   },
    // },
    // {
    //   title: '发放积分',
    //   dataIndex: 'point',
    // },
    {
      title: '操作',
      render: (text, record) => {
        if (this.state.self.roles.includes('ROLE_ADMINISTRATOR')) {
          return (
            <Fragment>
              <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
              <Divider type="vertical" />
              <a onClick={() => this.handleDel(record)}>{record.enabled ? '停用' : '启用'}</a>
              <Divider type="vertical" />
              <a onClick={() => this.handleResetpass(record.username)}>重置密码</a>
            </Fragment>
          );
        } else {
          return (
            <Fragment>
              <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
              <Divider type="vertical" />
              <a onClick={() => this.handleDel(record)}>{record.enabled ? '停用' : '启用'}</a>
            </Fragment>
          );
        }
      },
    },
  ];

  componentDidMount() {
    this.handleQuery();
    this.fetchCommon_Enum('PARTY_TYPE');
    getUserSelf().then(res => {
      this.setState({
        self: res.data,
      });
    });
  }

  async fetchCommon_Enum(name: string) {
    const res: ResParams<{ [propName: string]: string }> = await Common_Enum(name);
    this.setState({
      types: res.data,
    });
  }

  handleResetpass = (username: string) => {
    reset(username).then((res: ResParams2) => {
      if (res.code == '0') {
        message.success('重置成功');
      }
    });
  };

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
      type: 'namespace_userManger/fetch',
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
      type: 'namespace_userManger/fetch',
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
          type: 'namespace_userManger/remove',
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
      type: 'namespace_userManger/remove',
      payload: {
        id: record.id,
        enabled: !record.enabled,
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

      dispatch({
        type: 'namespace_userManger/fetch',
        payload: values,
      });
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
      type: 'namespace_userManger/fetch',
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
      type: 'namespace_userManger/add',
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
      type: 'namespace_userManger/update',
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
              {getFieldDecorator('keyword')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="报到类型">
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
      namespace_userManger: { data },
      loading,
    } = this.props;

    const { type } = this.state;

    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;

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
              <Button
                icon="export"
                type="primary"
                onClick={() => {
                  window.location.href = `${
                    require('@/../config.json').apiHost
                  }/api/biz/user/query/export?access_token=${localStorage.getItem(
                    'access_token',
                  )}&orgfrom=TREETS`;
                }}
              >
                导出
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button type="danger" onClick={() => this.handleMenuClick({ key: 'remove' })}>
                    批量删除
                  </Button>
                </span>
              )}
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
        <CreateForm {...parentMethods} hasVal={false} modalVisible={modalVisible} />
        {type == 'updata' ? (
          <CreateForm
            {...updateMethods}
            hasVal={true}
            modalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
