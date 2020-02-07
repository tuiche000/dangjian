import { Button, Card, Col, Divider, Form, Input, Row, message, Upload, Icon, Table, Select } from 'antd';
import React, { Component, Fragment } from 'react';

import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import { StateType } from './model';
import CreateForm from './components/CreateForm';
// import User from './user/index';
import { TableListItem, TableListPagination, TableListParams, AddParams } from './data.d';
import { userQuery } from './service';
import Member from './user/member'

import styles from './style.less';

const FormItem = Form.Item;
const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'namespace_department/add'
      | 'namespace_department/fetch'
      | 'namespace_department/remove'
      | 'namespace_department/update'
    >
  >;
  loading: boolean;
  namespace_department: StateType;
}

interface TableListState {
  userList: any[];
  modalVisible: boolean;
  updateModalVisible: boolean;
  selectedRows: TableListItem[];
  formValues: { [key: string]: string };
  stepFormValues: Partial<TableListItem>;
  type: 'add' | 'updata';
  pageNo: number;
  pageSize: number;
  curOrganizationName: string;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    namespace_department,
    loading,
  }: {
    namespace_department: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    namespace_department,
    loading: loading.models.namespace_department,
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
    userList: [],
    curOrganizationName: ''
  };
  childrenColumnName: StandardTableColumnProps[] = [
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
    //   title: '操作',
    //   fixed: 'right',
    //   width: 150,
    //   render: (text, record) => (
    //     <Fragment>
    //       <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
    //       <Divider type="vertical" />
    //       <a onClick={() => this.handleDel(record)}>{record.enabled ? '停用' : '启用'}</a>
    //     </Fragment>
    //   ),
    // },
  ];
  columns: StandardTableColumnProps[] = [
    {
      title: '组织名称',
      dataIndex: 'name',
      render: (text, record) => {
        return <a onClick={() => this.POST_user_node(record)}>{text}</a>;
      },
    },
    {
      title: '组织类型',
      dataIndex: 'companyType',
      render: (text) => {
        if (text=='PARTY') return <span>党建工作协调委员会</span>
        if (text=='ARC_PARTY') return <span>建筑企业党建工作协调委员会</span>
      }
    },
    {
      title: '党组织联络人',
      dataIndex: 'contactor',
    },
    {
      title: '联系电话',
      dataIndex: 'callphone',
    },
    {
      title: '报到时间',
      dataIndex: 'checkdate',
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
    // {
    //   title: '操作',
    //   render: (text, record) => (
    //     <Fragment>
    //       <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
    //       <Divider type="vertical" />
    //       <a onClick={() => this.handleDel(record.id)}>删除</a>
    //     </Fragment>
    //   ),
    // },
  ];

  componentDidMount() {
    this.handleQuery();
  }

  async POST_user_node(record) {
    console.log(record)
    const res = await userQuery(record.id);
    console.log(res)
    this.setState({
      curOrganizationName: record.name,
      userList: res.data.result,
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
      type: 'namespace_department/fetch',
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
      type: 'namespace_department/fetch',
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
          type: 'namespace_department/remove',
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
      type: 'namespace_department/remove',
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
        type: 'namespace_department/fetch',
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
      type: 'namespace_department/fetch',
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
      type: 'namespace_department/add',
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

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="关键字">
              {getFieldDecorator('keyword')(<Input placeholder="输入党组织名称" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="报到类型">
              {getFieldDecorator('partyType', {
              })(
                <Select
                  // mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="请选择"
                  onChange={e => {
                    console.log(e);
                  }}
                >
                  <Select.Option value="PTY_COM">党委</Select.Option>
                  <Select.Option value="PTY_BRANCH">党总支</Select.Option>
                  <Select.Option value="PTY_SUBBRANCH">党支部</Select.Option>
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

  handleUpdate = (fields: AddParams) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'namespace_department/update',
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
      namespace_department: { data },
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

    const uploadprops = {
      name: 'file',
      action: `/api/biz/organization/import`,
      // headers: {
      //   Authorization: `Bearer ${JSON.parse(localStorage.getItem('access_token'))}`
      // },
      showUploadList: false,
      onChange(info: any) {
        if (info.file.status === 'uploading') {
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} 文件上传成功`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.response.message}`);
        }
      },
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              {/* <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button> */}
              <Button
                icon="export"
                type="primary"
                onClick={() => {
                  window.location.href = `${
                    require('@/../config.json').apiHost
                    }/api/biz/organization/query/export?access_token=${localStorage.getItem(
                      'access_token',
                    )}&orgfrom=CHECKIN`;
                }}
              >
                导出
              </Button>
              <Upload {...uploadprops}>
                <Button type="primary">
                  <Icon type="import" /> 导入
                      </Button>
              </Upload>
              <Button
                icon="download"
                type="primary"
                onClick={() => {
                  window.location.href = `${
                    require('@/../config.json').apiHost
                    }/assets/upload/template/organization_import_template.xls`;
                }}
              >
                导入模板下载
              </Button>
              {/* {selectedRows.length > 0 && (
                <span>
                  <Button type="danger" onClick={() => this.handleMenuClick({ key: 'remove' })}>
                    批量删除
                  </Button>
                </span>
              )} */}
            </div>
            {/* <Row><StandardTable
              rowKey="id"
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              title={() => {
                return <div>组织列表</div>;
              }}
              scroll={{ x: 800, y: 300 }}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            /></Row> */}
            <div>
              <Table columns={this.columns} bordered dataSource={data.list} pagination={{
                defaultPageSize: 6
              }} />
            </div>
            <Divider />
            {/* <User title={this.state.curOrganizationName} tableData={userList} /> */}
            <Member title={this.state.curOrganizationName} data={userList} />
          </div>
        </Card>
        {/* <CreateForm {...parentMethods} hasVal={false} modalVisible={modalVisible} />
        {type == 'updata' ? (
          <CreateForm
            {...updateMethods}
            hasVal={true}
            modalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null} */}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
