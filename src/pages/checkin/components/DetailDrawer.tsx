import { Drawer, Divider, Col, Row } from 'antd';

import React, { useState, useEffect } from 'react';
import { TableListItem } from '../data.d';
import { detail } from '../service'

const pStyle = {
  fontSize: 16,
  color: 'rgba(0,0,0,0.85)',
  lineHeight: '24px',
  display: 'block',
  marginBottom: 16,
};
const DescriptionItem = ({ title, content }: any) => (
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
  partyType: any;
  auditType: any;
  handleDrawerVisible: (flag?: boolean, record?: Partial<TableListItem>) => void
  values: Partial<TableListItem>;
}
const DetailDrawer: React.FC<DetailDrawerProps> = props => {
  const { drawerVisible, handleDrawerVisible, values, partyType, auditType } = props;

  const [detailInfo, setDetailInfo] = useState();
  useEffect(() => {
    detail(values.id).then((res: {
      code: string;
      data: TableListItem
    }) => {
      if (res.code == "0") {
        setDetailInfo(res.data)
      }
    })
  }, []);

  return (
    <Drawer
      width={'50%'}
      placement="right"
      closable={false}
      onClose={() => handleDrawerVisible(false, values)}
      afterVisibleChange={() => {
        if (!drawerVisible) {
          handleDrawerVisible(false)
        }
      }}
      visible={drawerVisible}
    >
      <p style={{ ...pStyle, marginBottom: 24 }}>报到详情</p>
      {/* <p style={pStyle}>Personal</p> */}
      <Divider></Divider>
      <Row>

        <Col span={24}>
          <DescriptionItem title="报到类型" content={detailInfo && partyType[detailInfo.partyType]} />
        </Col>
        <Col span={24}>
          <DescriptionItem title="报到单位" content={detailInfo && detailInfo.departmentName} />
        </Col>
        {
          detailInfo && detailInfo.organizationName ? (
            <Col span={24}>
              <DescriptionItem title="党组织名称" content={detailInfo && detailInfo.organizationName} />
            </Col>
          ) : null
        }
        <Col span={24}>
          <DescriptionItem title="报到时间" content={detailInfo && detailInfo.checkinTime} />
        </Col>
        {
          detailInfo && detailInfo.checkorName ? (
            <Col span={24}>
              <DescriptionItem title="联系人" content={detailInfo && detailInfo.checkorName} />{' '}
            </Col>
          ) : null
        }
        {
          detailInfo && detailInfo.phone ? (
            <Col span={24}>
              <DescriptionItem title="联系方式" content={detailInfo && detailInfo.phone} />{' '}
            </Col>
          ) : null
        }
        <Col span={24}>
          <DescriptionItem title="审核状态" content={detailInfo && auditType[detailInfo.auditType]} />
        </Col>
        <Col span={24}>
          <DescriptionItem title="发放积分" content={detailInfo && detailInfo.point} />
        </Col>
      </Row>
      <Divider></Divider>
    </Drawer>
  );
};

export default DetailDrawer;
