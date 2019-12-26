import { Drawer, Divider, Form, Table, message, InputNumber } from 'antd';
import React, { Component } from 'react';

import { Dispatch } from 'redux';
import { connect } from 'dva';
import { StateType } from '../model';
import { ConnectState } from '@/models/connect';
import { FormComponentProps } from 'antd/es/form';
import { TableListItem, TableListParams, TableListPagination } from '../data.d';
import { check, apply, audit } from '../service';

export interface UpdateFormProps extends FormComponentProps {
  handleDrawerVisible: (flag?: boolean, record?: Partial<TableListItem>) => void;
  drawerVisible: boolean;
  type: 'check' | 'apply';
  values: Partial<TableListItem>;
  dispatch?: Dispatch<any>;
  loading?: boolean;
  memberLevel?: StateType;
}

export interface UpdateFormState {
  pageSize: number;
  pageNo: number;
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

const pStyle = {
  fontSize: 16,
  color: 'rgba(0,0,0,0.85)',
  lineHeight: '24px',
  display: 'block',
  marginBottom: 16,
};

@connect(
  ({
    memberLevel,
    loading,
  }: {
    memberLevel: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
    user: ConnectState;
  }) => ({
    memberLevel,
    loading: loading.models.memberLevel,
  }),
)
class DetailTable extends Component<UpdateFormProps, UpdateFormState> {
  static defaultProps = {
    handleUpdate: () => { },
    handleUpdateModalVisible: () => { },
    values: {},
  };

  handleTableChange = (
    pagination: TableListPagination,
    filtersArg: Record<keyof TableListItem, string[]>,
  ) => {
    const { dispatch, values } = this.props;

    const params: Partial<TableListParams> = {
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
    };

    this.setState({
      pageNo: pagination.current,
    });
    this.POST_check({
      activeId: values.id,
      pageSize: pagination.pageSize,
      pageNo: pagination.current,
    });
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  constructor(props: UpdateFormProps) {
    super(props);

    this.state = {
      pageSize: 10,
      pageNo: 1,
      list: [],
      pagination: {},
    };
  }

  componentDidMount() {
    let { values, type } = this.props;
    let { pageSize, pageNo } = this.state;
    if (type == 'check') {
      this.POST_check({
        activeId: values.id,
        pageSize,
        pageNo,
      });
    }
    if (type == 'apply') {
      this.POST_apply({
        activeId: values.id,
        pageSize,
        pageNo,
      });
    }
  }

  POST_check(params: TableListParams) {
    check(params).then((res: ResParams<any>) => {
      if (res.code == '0') {
        this.setState({
          list: res.data.result,
          pagination: {
            current: res.data.pageNo,
            pageSize: res.data.pageSize,
            total: res.data.totalResults,
          },
        });
      }
    });
  }

  POST_audit(params: {
    activity?: string;
    member?: string;
    point?: string;
  }) {
    audit(params).then((res: ResParams2) => {
      if (res.code == '0') {
        message.success('发放成功');
        this.POST_check({
          activeId: params.activity,
          pageSize: this.state.pageSize,
          pageNo: this.state.pageNo,
        });
      }
    })
  }

  POST_apply(params: TableListParams) {
    apply(params).then((res: ResParams<any>) => {
      if (res.code == '0') {
        this.setState({
          list: res.data.result,
          pagination: {
            current: res.data.pageNo,
            pageSize: res.data.pageSize,
            total: res.data.totalResults,
          },
        });
      }
    });
  }

  render() {
    const { values, drawerVisible, handleDrawerVisible, type } = this.props;
    const { list, pagination } = this.state;

    let columns: any[];
    if (type == 'check') {
      columns = [
        {
          title: '活动',
          dataIndex: 'activityName',
        },
        {
          title: '类型',
          dataIndex: 'event',
        },
        {
          title: '用户',
          dataIndex: 'memberName',
        },
        {
          title: '积分发放',
          dataIndex: 'socialType',
          render: (text: 'CHECKOUT' | 'CHECKIN', record: TableListItem) => {
            if (record.granted) {
              return <div>已发放积分</div>
            }
            if (text == 'CHECKIN') return (
              <div>
                <a onClick={
                  () => {
                    this.POST_audit({
                      activity: record.activity,
                      member: record.member,
                      point: record.point
                    })
                  }
                }>发放积分</a>
                <span style={{marginLeft: 10}}>
                  <InputNumber min={0} defaultValue={record.point} onChange={(value: number) => {
                  record.point = value
                }} />
                </span>

              </div>
            )
          }
        },
      ];
    } else if (type == 'apply') {
      columns = [
        {
          title: '活动',
          dataIndex: 'activityName',
        },
        {
          title: '活动成员',
          dataIndex: 'memberName',
        },
        {
          title: '报名时间',
          dataIndex: 'entry',
        },
        {
          title: '发放积分',
          dataIndex: 'point',
        },
      ];
    }

    return (
      <Drawer
        width={'75%'}
        placement="right"
        closable={false}
        onClose={() => handleDrawerVisible(false, values)}
        afterVisibleChange={() => {
          if (!drawerVisible) {
            handleDrawerVisible(false);
          }
        }}
        visible={drawerVisible}
      >
        <p style={{ ...pStyle, marginBottom: 24 }}>{type == 'check' ? '签到/签退记录' : '报名记录'}</p>
        {/* <p style={pStyle}>Personal</p> */}
        <Divider></Divider>
        <Table
          rowKey={'id'}
          dataSource={list}
          columns={columns}
          pagination={pagination}
          onChange={this.handleTableChange}
        />

        {/* <Divider></Divider> */}
      </Drawer>
    );
  }
}

export default Form.create<UpdateFormProps>()(DetailTable);
