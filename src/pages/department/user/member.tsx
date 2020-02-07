import React, { Component, Fragment } from 'react';
import { Table, Input, Form, Row, Col, Button, Typography, Divider, message, Select } from 'antd';
import styles from './style.less';
import { query, add, update } from './service'
import CreateForm from './components/CreateForm'

const FormItem = Form.Item;
const { Title } = Typography;

class Member extends Component {
  constructor(props: any) {
    super(props)
    this.state = {
      members: [],
      modalVisible: false,
      updateModalVisible: false,
      type: ''
    }
  }
  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
    });
  };
  handleSearch = (e) => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      query(fieldsValue).then(res => {
        if (res.code == "0") {
          this.setState({
            members: res.data.result,
          })
        }
      })
    });

  }
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    query({}).then(res => {
      if (res.code == "0") {
        this.setState({
          members: res.data.result,
        })
      }
    })
  };
  handleUpdateModalVisible = (flag?: boolean, record?: AddParams) => {
    console.log(flag);
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
      type: record ? 'updata' : 'add',
    });
  };

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

  componentDidMount() {
    query({}).then(res => {
      if (res.code == "0") {
        this.setState({
          members: res.data.result,
        })
      }
    })
  }


  // handleAdd = (fields: AddParams) => {
  //   const { dispatch } = this.props;
  // add(fields).then(res => {
  //   if (res.code === '0') {
  //     message.success('添加成功');
  //     this.handleModalVisible();
  //     // this.handleQuery();
  //   }
  // })
  // };
  renderSimpleForm() {
    const { form } = this.props;
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
  render() {
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '人员类型',
        dataIndex: 'partyType',
        render: (text) => {
          if (text == 'CPC') {
            return <span>党员</span>
          }
          if (text= 'MASSES') {
            return <span>群众</span>
          }
        }
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
    const { data, title } = this.props
    const { modalVisible, type, stepFormValues, updateModalVisible } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <div>
        <div className={styles.tableListForm}>
          {this.renderSimpleForm()}
        </div>
        <div className={styles.tableListOperator}>
          {/* <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
            新建
              </Button> */}
          {/* <Button
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
              </Button> */}
        </div>
        <Title level={4}>{this.state.members.length ? '' : title}</Title>
        <Table columns={columns} bordered dataSource={this.state.members.length ? this.state.members : data} />
        {/* <CreateForm {...parentMethods} hasVal={false} modalVisible={modalVisible} /> */}
        {/* {
          type == 'updata' ? (
            <CreateForm
              {...updateMethods}
              hasVal={true}
              modalVisible={updateModalVisible}
              values={stepFormValues}
            />
          ) : null
        } */}
      </div>
    )
  }
}

export default Form.create()(Member);