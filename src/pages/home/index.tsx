import React from 'react';
import { Card, Row, Col, Table, Avatar } from 'antd';
import logo from '@/assets/LOGO.png';
import { connect } from 'dva';
import { StateType } from './model';
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
export default class Home extends React.Component<TableListProps> {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'namespace_home/count',
      payload: null,
    });
  }

  render() {
    const dataSource = [
      {
        key: '1',
        name: '胡彦斌',
        age: 32,
        address: '西湖区湖底公园1号',
      },
      {
        key: '2',
        name: '胡彦祖',
        age: 42,
        address: '西湖区湖底公园1号',
      },
    ];

    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: '住址',
        dataIndex: 'address',
        key: 'address',
      },
    ];
    return (
      <div>
        <Row>
          <Col span={6}>
            <Card>
              <Card.Meta
                avatar={<Avatar src={logo} />}
                title="4"
                description="街道组织"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Card.Meta
                avatar={<Avatar src={logo} />}
                title="122"
                description="街道党员"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Card.Meta
                avatar={<Avatar src={logo} />}
                title="7"
                description="报到组织"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Card.Meta
                avatar={<Avatar src={logo} />}
                title="122"
                description="报到党员"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Card.Meta
                avatar={<Avatar src={logo} />}
                title="5"
                description="本月活动"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Card.Meta
                avatar={<Avatar src={logo} />}
                title="2"
                description="积分排名"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Card.Meta
                avatar={<Avatar src={logo} />}
                title="1209"
                description="组织积分"
              />
            </Card>
          </Col>
        </Row>
        <br></br>
        <Row gutter={16}>
          <Col span={12}>
            <Card loading={true} title="最新活动" extra={<a href="#">More</a>}>
              <p>Card content</p>
              <p>Card content</p>
              <p>Card content</p>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="最新报到" extra={<a href="#">More</a>}>
              <p>Card content</p>
              <p>Card content</p>
              <p>Card content</p>
            </Card>
          </Col>
        </Row>
        <br></br>
        <Row gutter={16}>
          <Col span={12}>
            <Card loading={true} title="报到党员个人排行榜" extra={<a href="#">More</a>}>
              <Table pagination={false} bordered dataSource={dataSource} columns={columns} />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="报到党组织排行榜" extra={<a href="#">More</a>}>
              <Table pagination={false} bordered dataSource={dataSource} columns={columns} />
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}
