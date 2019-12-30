import { Button, Card, Col, Divider, Form, Input, Row, message } from 'antd';
import React, { Component, Fragment } from 'react';

import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import { StateType } from './model';
import CreateForm from './components/CreateForm';
import StandardTable, { StandardTableColumnProps } from '@/components/StandardTable';
import { TableListItem, TableListPagination, TableListParams, AddParams } from './data.d';
import { user_node } from './service';

import styles from './style.less';

const FormItem = Form.Item;
const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'namespace_organization/add'
      | 'namespace_organization/fetch'
      | 'namespace_organization/remove'
      | 'namespace_organization/update'
    >
  >;
  loading: boolean;
  namespace_organization: StateType;
}

interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  selectedRows: TableListItem[];
  formValues: { [key: string]: string };
  stepFormValues: Partial<TableListItem>;
  type: 'add' | 'updata';
  pageNo: number;
  pageSize: number;
  userList: any[];
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    namespace_organization,
    loading,
  }: {
    namespace_organization: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    namespace_organization,
    loading: loading.models.namespace_organization,
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
    pageNo: 1,
    pageSize: 10,
    userList: []
  };

  columns: StandardTableColumnProps[] = [
    {
      title: '名字',
      dataIndex: 'name',
    },
    {
      title: '所属单位',
      dataIndex: 'departmentName',
    },
    // {
    //   title: '层级',
    //   dataIndex: 'level',
    // },
    // {
    //   title: '显示顺序',
    //   dataIndex: 'displayOrder',
    //   sorter: true,
    //   align: 'right',
    //   render: (val: string) => `${val}`,
    //   // mark to display a total number
    //   needTotal: true,
    // },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleDel(record.id)}>删除</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    this.handleQuery();
  }

  async POST_user_node(id: string) {
    const res = await user_node(id)
    // console.log(res)
    this.setState({
      userList: res.data
    })
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
      type: 'namespace_organization/fetch',
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
      type: 'namespace_organization/fetch',
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
          type: 'namespace_organization/remove',
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

  handleDel = (id: number): void => {
    const { dispatch } = this.props;
    dispatch({
      type: 'namespace_organization/remove',
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
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'namespace_organization/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag?: boolean, record?: TableListItem) => {
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
      type: 'namespace_organization/fetch',
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
      type: 'namespace_organization/add',
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
      type: 'namespace_organization/update',
      payload: fields,
      callback: (res: ResParams2) => {
        message.success('修改成功');
        this.handleUpdateModalVisible();
        this.handleQuery();
      },
    });
  };

  render() {
    const {
      namespace_organization: { data },
      loading,
    } = this.props;

    const { type, userList } = this.state;

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
            {/* <div className={styles.tableListForm}>{this.renderForm()}</div> */}
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button type="danger" onClick={() => this.handleMenuClick({ key: 'remove' })}>
                    批量删除
                  </Button>
                </span>
              )}
            </div>
            <Row gutter={16}>
              <Col span={12}>

                <StandardTable
                  rowKey="id"
                  selectedRows={selectedRows}
                  loading={loading}
                  data={data}
                  title={() => {
                    return <div>组织列表</div>
                  }}
                  scroll={{ x: 800, y: 300 }}
                  onExpand={(exp, rec) => {
                    this.POST_user_node(rec.id)
                    // if (exp) {
                    //   this.POST_user_node(rec.id)
                    // }
                  }}
                  columns={this.columns}
                  onSelectRow={this.handleSelectRows}
                  onChange={this.handleStandardTableChange}
                />
              </Col>
              <Col span={12}>
                <StandardTable
                  rowKey="id"
                  // selectedRows={selectedRows}
                  // loading={loading}
                  data={{
                    list: userList
                  }}
                  scroll={{ x: 1000, y: 500 }}
                  title={() => {
                    return <div>成员列表</div>
                  }}
                  columns={this.childrenColumnName}
                  // onSelectRow={this.handleSelectRows}
                  onChange={this.handleStandardTableChange}
                />
              </Col>
            </Row>
            {/* <StandardTable
              rowKey="id"
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            /> */}
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
