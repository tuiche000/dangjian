import React from 'react';
import { Card, Row, Col, Table, Typography, List } from 'antd';
const { Title } = Typography;
import DetailDrawer from './DetailDrawer';
import Link from 'umi/link';
import { connect } from 'dva';
import { StateType } from './model';
import * as service from './service'
import { Dispatch, Action } from 'redux';

interface TableListProps {
  dispatch: Dispatch<
    Action<
      | 'namespace_home/count'
    >
  >;
  loading: boolean;
  namespace_point: StateType;
}

interface DataState {
  count: {
    streetsOrg: number
    streetsCpc: number
    checkinOrg: number
    checkinCpc: number
    activity: number
    rankingOrg: number
    pointOrg: number
  };
  activity: any;
  checkin: any;
  board: any;
  board2: any;
  stepFormValues: any;
  drawerVisible: boolean;
}

@connect(
  ({
    namespace_home,
    loading,
  }: {
    namespace_home: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    namespace_home,
    loading: loading.models.namespace_home,
  }),
)
export default class Home extends React.Component<TableListProps, DataState> {
  state: DataState = {
    count: {
      streetsOrg: 0,
      streetsCpc: 0,
      checkinOrg: 11,
      checkinCpc: 0,
      activity: 2,
      rankingOrg: 0,
      pointOrg: 0
    },
    activity: [],
    checkin: [],
    board: [],
    board2: [],
    stepFormValues: undefined,
    drawerVisible: false,
  }

  async componentDidMount() {
    try {
      const count: ResParams<any> = await service.desktop_count();
      const activity: ResParams<any> = await service.desktop_activity();
      const checkin: ResParams<any> = await service.desktop_checkin();
      const board: ResParams<any> = await service.desktop_board({
        boardtype: 'CHECKIN_PERSONAL',
        pageSize: 5
      });
      const board2: ResParams<any> = await service.desktop_board({
        boardtype: 'CHECKIN_ORGANIZATION',
        pageSize: 5
      });
      this.setState({
        count: count.data,
        activity: activity.data,
        checkin: checkin.data,
        board: board.data.reresult,
        board2: board2.data.reresult,
      })
    } catch {
      console.log('error')
    }
  }

  async activityDetail(id: string) {
    try {
      const res = await service.activity_detail(id);
      this.setState({
        stepFormValues: res.data,
        drawerVisible: true,
      })
    } catch {
      console.log(104)
    }
  }

  handleDrawerVisible = () => {
    this.setState({
      drawerVisible: !this.state.drawerVisible
    })
  }

  render() {
    const { count } = this.state

    const columns = [
      {
        title: '名次',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '所属组织',
        dataIndex: 'organizationName',
        key: 'organizationName',
      },
      {
        title: '积分',
        dataIndex: 'point',
        key: 'point',
      },
    ];
    const columns2 = [
      {
        title: '名次',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '党组织',
        dataIndex: 'organizationName',
        key: 'organizationName',
      },
      {
        title: '积分',
        dataIndex: 'point',
        key: 'point',
      },
    ];

    return (
      <div>
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 4,
            lg: 4,
            xl: 8,
            xxl: 3,
          }}
        >
          <List.Item>
            <Card title="街道组织">{count.streetsOrg}</Card>
          </List.Item>
          <List.Item>
            <Card title="街道党员">{count.streetsCpc}</Card>
          </List.Item>
          <List.Item>
            <Card title="报到组织">{count.checkinOrg}</Card>
          </List.Item>
          <List.Item>
            <Card title="报到党员">{count.checkinCpc}</Card>
          </List.Item>
          <List.Item>
            <Card title="本月活动">{count.activity}</Card>
          </List.Item>
          <List.Item>
            <Card title="积分排名">{count.rankingOrg}</Card>
          </List.Item>
          <List.Item>
            <Card title="组织积分">{count.pointOrg}</Card>
          </List.Item>
          <List.Item>
            <Card title="二维码">111</Card>
          </List.Item>
        </List>
        <br></br>
        <Row gutter={16}>
          <Col span={12}>
            <List
              header={<Row type="flex" justify="space-between">
                <Col>
                  <Title level={4}>最新活动</Title>
                </Col>
                <Col>
                  <Link to="/activity">更多</Link>
                </Col>
              </Row>}
              bordered
              dataSource={this.state.activity}
              renderItem={item => (
                <List.Item
                  extra={[<a key="list-loadmore-edit" onClick={() => this.activityDetail(item.id)}>详情</a>]}
                >
                  <List.Item.Meta
                    // description={<div>{item.checkorName}</div>}
                    title={<div>{item.title}</div>}
                  />
                </List.Item>
              )}
            />
          </Col>
          <Col span={12}>
            <List
              header={<Row type="flex" actions={[<a key="list-loadmore-edit">更多</a>]} justify="space-between">
                <Col>
                  <Title level={4}>最新报到</Title>
                </Col>
              </Row>}
              bordered
              dataSource={this.state.checkin}
              renderItem={item => (
                // <List.Item key={item.id}>
                //   <List.Item.Meta
                //     // title={<a href="https://ant.design">{item.name}</a>}
                //     description={item.email}
                //   />
                //   <div>{item.checkinTime}</div>
                // </List.Item>
                <List.Item
                  actions={[<span>{item.checkinTime}</span>]}
                >
                  <List.Item.Meta
                    // description={<div>{item.checkorName}</div>}
                    title={<div>{item.checkorName}</div>}
                  />
                </List.Item>
              )}
            />
          </Col>
        </Row>
        <br></br>
        <Row gutter={16}>
          <Col span={12}>
            <List
              header={<Title level={4}>报到党员个人排行榜</Title>}
              bordered
            >
              <Table pagination={false} bordered dataSource={this.state.board} columns={columns} />
            </List>
          </Col>
          <Col span={12}>
            <List
              header={<Title level={4}>报到党组织排行榜</Title>}
              bordered
            >
              <Table pagination={false} bordered dataSource={this.state.board2} columns={columns2} />
            </List>
          </Col>
        </Row>
        {this.state.stepFormValues ? (
          <DetailDrawer
            values={this.state.stepFormValues}
            drawerVisible={this.state.drawerVisible}
            handleDrawerVisible={this.handleDrawerVisible}
          ></DetailDrawer>
        ) : null}
      </div>
    )
  }
}
