import { Drawer, Divider, Col, Row } from 'antd';

import React, { useState, useEffect } from 'react';
import { TableListItem } from './data.d';

const pStyle = {
  fontSize: 16,
  color: 'rgba(0,0,0,0.85)',
  lineHeight: '24px',
  display: 'block',
  marginBottom: 16,
};

const DescriptionItem = ({ title, content }) => (
  <div
    style={{
      fontSize: 14,
      lineHeight: '22px',
      marginBottom: 7,
      color: 'rgba(0,0,0,0.65)',
    }}
  >
    <p
      style={{
        marginRight: 8,
        display: 'inline-block',
        color: 'rgba(0,0,0,0.85)',
      }}
    >
      {title}:
    </p>
    {content}
  </div>
);

interface DetailDrawerProps {
  drawerVisible: boolean;
  handleDrawerVisible: (flag?: boolean, record?: Partial<TableListItem>) => void
  values: Partial<TableListItem>;
}
const DetailDrawer: React.FC<DetailDrawerProps> = props => {
  const { drawerVisible, handleDrawerVisible, values } = props;

  return (
    <Drawer
      width={640}
      placement="right"
      closable={false}
      onClose={() => handleDrawerVisible()}
      visible={drawerVisible}
    >
      {/* <p style={{ ...pStyle, marginBottom: 24 }}>活动详情</p> */}
      <p style={pStyle}>活动基本信息</p>
      <Row>
        <Col span={24}>
          <DescriptionItem title="活动名称" content={values.title} />
        </Col>
        <Col span={24}>
          <DescriptionItem title="发布日期" content={values.publish} />
        </Col>
        <Col span={24}>
          <DescriptionItem title="发布组织" content={values.title} />
        </Col>
        <Col span={24}>
          <DescriptionItem title="活动内容" content={values.content} />
        </Col>
        <Col span={24}>
          <DescriptionItem title="招募人数" content={values.limit} />
        </Col>
        <Col span={24}>
          <DescriptionItem title="报名截止时间" content={values.end} />
        </Col>
        <Col span={24}>
          <div
            style={{
              fontSize: 14,
              lineHeight: '22px',
              marginBottom: 7,
              color: 'rgba(0,0,0,0.65)',
            }}
          >
            <p
              style={{
                marginRight: 8,
                display: 'inline-block',
                color: 'rgba(0,0,0,0.85)',
              }}
            >活动二维码:</p>
            <div>
              <img width="200" height="200" src={values.qrcode} alt="" />
            </div>
          </div>
        </Col>
      </Row>
      <Divider />
      <p style={pStyle}>活动开展信息</p>
      <Row>
        <Col span={24}>
          <DescriptionItem title="活动时间" content={values.begin} />
        </Col>
        <Col span={24}>
          <div
            style={{
              fontSize: 14,
              lineHeight: '22px',
              marginBottom: 7,
              color: 'rgba(0,0,0,0.65)',
            }}
          >
            <p
              style={{
                marginRight: 8,
                display: 'inline-block',
                color: 'rgba(0,0,0,0.85)',
              }}
            >活动照片:</p>
            <div>
              {
                values.photos.map(item => {
                  return <img width="200" height="200" src={item.image} alt="" />
                })
              }
            </div>
          </div>
        </Col>
        <Col span={24}>
          <DescriptionItem title="参加人员" content={values.contacter} />
        </Col>
      </Row>
      <Divider />
    </Drawer>
  );
};

export default DetailDrawer;
