import { Form, Input, Modal, Select, InputNumber } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React, { useState, useEffect } from 'react';
import { AddParams, TableListItem } from '../data.d';
import { detail } from '../service';
import { Common_Enum, Common_Dictionary } from '@/services/common';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
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
  } = props;

  const [info, setInfo] = useState();
  const [types, setTypes] = useState();
  const [actTypes, setActTypes] = useState();

  useEffect(() => {
    Common_Enum('RULE_TYPE').then((res: ResParams<{ [propName: string]: string }>) => {
      setTypes(res.data);
    });
    Common_Dictionary('PARTY_ACTIVITY_ACTIVETYPE').then((res: ResParams<{ [propName: string]: string }>) => {
      setActTypes(res.data);
    });
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
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名字">
        {form.getFieldDecorator('name', {
          // rules: [{ required: true, message: '请输入！', min: 2 }],
          initialValue: info && info.name,
        })(<Select
          // mode="multiple"
          style={{ width: '100%' }}
          placeholder="请选择"
          onChange={e => {
            console.log(e);
          }}
        >
          {actTypes &&
            Object.keys(actTypes).map(
              (item: any): JSX.Element => {
                return (
                  <Option key={item} value={item}>
                    {actTypes[item]}
                  </Option>
                );
              },
            )}
        </Select>)}
      </FormItem>
      {/* <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="报道类型">
        {form.getFieldDecorator('partyType', {
          rules: [{ required: true, message: '请输入！', min: 2 }],
          initialValue: info && info.partyType,
        })(<Input placeholder="请输入" />)}
      </FormItem> */}
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="规则类型">
        {form.getFieldDecorator('ruleType', {
          // rules: [{ required: true, message: '请选择' }],
          initialValue: info && info.ruleType,
        })(
          <Select
            // mode="multiple"
            style={{ width: '100%' }}
            placeholder="请选择"
            onChange={e => {
              console.log(e);
            }}
          >
            {types &&
              Object.keys(types).map(
                (item: any): JSX.Element => {
                  return (
                    <Option key={item} value={item}>
                      {types[item]}
                    </Option>
                  );
                },
              )}
          </Select>,
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="内容">
        {form.getFieldDecorator('content', {
          // rules: [{ required: true, message: '请输入！', min: 1 }],
          initialValue: info && info.content,
        })(<TextArea rows={3} placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="发放积分">
        {form.getFieldDecorator('point', {
          rules: [{ required: true, message: '请输入' }],
          initialValue: info && info.point,
        })(<InputNumber min={1} max={999} placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
};

export default Form.create<CreateFormProps>()(CreateForm);
