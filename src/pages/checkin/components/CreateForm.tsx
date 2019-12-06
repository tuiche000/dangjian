import { Form, Input, Modal, Select, InputNumber, DatePicker } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React, { useState, useEffect } from 'react';
import { AddParams, TableListItem } from '../data.d';
import { detail } from '../service';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  partyType: { [key: string]: string };
  auditType: { [key: string]: string };
  hasVal: boolean; // true=>编辑 false=>新增
  values?: Partial<AddParams>;
  handleAdd?: (fieldsValue: AddParams) => void;
  handleModalVisible?: () => void;
  handleUpdate?: (fieldsValue: AddParams) => void;
  handleUpdateModalVisible?: (flag?: boolean, record?: AddParams) => void;
}
const CreateForm: React.FC<CreateFormProps> = props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    handleUpdateModalVisible,
    hasVal,
    values,
    handleUpdate,
    partyType,
    auditType,
  } = props;

  const [info, setInfo] = useState();

  useEffect(() => {
    if (hasVal) {
      // 修改加载数据
      let id = values ? values.id : '';
      detail(id).then((res: ResParams<TableListItem>) => {
        if (res.code == '0') {
          setInfo(res.data);
        }
      });
    }
  }, []);

  const okHandle = () => {
    form.validateFields((err, fieldsValue: AddParams) => {
      if (err) return;
      fieldsValue.checkinTime = null;
      // fieldsValue.checkinTime = moment(fieldsValue.checkinTime).format('YYYY-MM-DD HH:mm:ss')
      form.resetFields();
      fieldsValue.enabled = true;
      if (hasVal) {
        //修改的
        fieldsValue.id = info.id;
        console.log('修改');
        handleUpdate && handleUpdate(fieldsValue);
        return;
      }
      handleAdd && handleAdd(fieldsValue);
    });
  };

  return (
    <Modal
      destroyOnClose
      title={hasVal ? '编辑' : '新建'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => {
        if (hasVal) {
          handleUpdateModalVisible && handleUpdateModalVisible(false, info);
        } else {
          handleModalVisible && handleModalVisible();
        }
      }}
      afterClose={() => handleUpdateModalVisible && handleUpdateModalVisible(false)}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="报道人">
        {form.getFieldDecorator('checkor', {
          rules: [{ required: true, message: '请输入！', min: 2 }],
          initialValue: info && info.checkorName,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="报道类型">
        {form.getFieldDecorator('partyType', {
          rules: [{ required: true, message: '请输入！', min: 2 }],
          initialValue: info && info.partyType,
        })(
          <Select
            // mode="multiple"
            style={{ width: '100%' }}
            placeholder="请选择"
            onChange={e => {
              console.log(e);
            }}
          >
            {partyType &&
              Object.keys(partyType).map(
                (item: any): JSX.Element => {
                  return (
                    <Option key={item} value={item}>
                      {partyType[item]}
                    </Option>
                  );
                },
              )}
          </Select>,
        )}
      </FormItem>
      {/* <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="党组织">
        {form.getFieldDecorator('organization', {
          rules: [{ required: true, message: '请选择' }],
          initialValue: info && info.organization,
        })(
          <Select
            // mode="multiple"
            style={{ width: '100%' }}
            placeholder="请选择"
            onChange={e => {
              console.log(e);
            }}
          >
            {partyType &&
              Object.keys(partyType).map(
                (item: any): JSX.Element => {
                  return (
                    <Option key={item} value={item}>
                      {partyType[item]}
                    </Option>
                  );
                },
              )}
          </Select>,
        )}
      </FormItem> */}
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="报到时间">
        {form.getFieldDecorator('checkinTime', {
          initialValue: info ? moment(info.checkinTime) : null,
          rules: [{ type: 'object', required: true, message: '请选择' }],
        })(<DatePicker disabled showTime format="YYYY-MM-DD HH:mm:ss" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="发放积分">
        {form.getFieldDecorator('point', {
          rules: [{ required: true, message: '请输入' }],
          initialValue: info && info.point,
        })(<InputNumber min={1} max={99} placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="审核状态">
        {form.getFieldDecorator('auditType', {
          rules: [{ required: true, message: '请输入' }],
          initialValue: info && info.auditType,
        })(
          <Select
            // mode="multiple"
            style={{ width: '100%' }}
            placeholder="请选择"
            onChange={e => {
              console.log(e);
            }}
          >
            {auditType &&
              Object.keys(auditType).map(
                (item: any): JSX.Element => {
                  return (
                    <Option key={item} value={item}>
                      {auditType[item]}
                    </Option>
                  );
                },
              )}
          </Select>,
        )}
      </FormItem>
    </Modal>
  );
};

export default Form.create<CreateFormProps>()(CreateForm);
