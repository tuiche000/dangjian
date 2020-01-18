import { Button, Card, Col, Select, Form, Input, Row, message } from 'antd';
import React, { Component } from 'react';

import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import { StateType } from './model';
import CreateForm from './components/CreateForm';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
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
      | 'namespace_pointRank/add'
      | 'namespace_pointRank/fetch'
      | 'namespace_pointRank/remove'
      | 'namespace_pointRank/update'
    >
  >;
  loading: boolean;
  namespace_pointRank: StateType;
}

interface TableListState {
  boardtype: 'CHECKIN_ORGANIZATION' | 'CHECKIN_PERSONAL';
  modalVisible: boolean;
  updateModalVisible: boolean;
  selectedRows: TableListItem[];
  formValues: { [key: string]: string };
  stepFormValues: Partial<TableListItem>;
  type: 'add' | 'updata';
  types: { [key: string]: string };
  pageNo: number;
  pageSize: number;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    namespace_pointRank,
    loading,
  }: {
    namespace_pointRank: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    namespace_pointRank,
    loading: loading.models.namespace_pointRank,
  }),
)
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    boardtype: 'CHECKIN_ORGANIZATION',
    modalVisible: false,
    updateModalVisible: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    type: 'add',
    types: {},
    pageNo: 1,
    pageSize: 10,
  };

  columns: StandardTableColumnProps[] = [
    {
      title: '名次',
      dataIndex: 'range',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '党组织',
      dataIndex: 'organizationName',
    },
    {
      title: '积分',
      dataIndex: 'point',
    },
  ];

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
      type: 'namespace_pointRank/fetch',
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
      type: 'namespace_pointRank/fetch',
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
          type: 'namespace_pointRank/remove',
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
      type: 'namespace_pointRank/remove',
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

      const values = {
        ...fieldsValue,
        pageSize: 10,
        pageNo: 1,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
        pageSize: 10,
        pageNo: 1
      });

      dispatch({
        type: 'namespace_pointRank/fetch',
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

  handleQuery = () => {
    const { dispatch } = this.props;
    const { pageNo, pageSize, boardtype } = this.state;
    dispatch({
      type: 'namespace_pointRank/fetch',
      payload: {
        pageNo,
        pageSize,
        boardtype
      },
    });
  };

  handleAdd = (fields: AddParams) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'namespace_pointRank/add',
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
      type: 'namespace_pointRank/update',
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
              {getFieldDecorator('keyword')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="积分类型">
              {getFieldDecorator('boardtype', {
                initialValue: 'CHECKIN_ORGANIZATION'
              })(
                <Select style={{ maxWidth: 220 }}>
                  <Select.Option value="CHECKIN_ORGANIZATION">
                    组织排名
                  </Select.Option>
                  <Select.Option value="CHECKIN_PERSONAL">
                    个人排名
                  </Select.Option>
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
      namespace_pointRank: { data },
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
              {/* <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button> */}
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
