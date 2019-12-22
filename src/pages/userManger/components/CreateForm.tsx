import { Form, Input, Modal, Select, InputNumber, TreeSelect } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React, { useState, useEffect } from 'react';
import { AddParams, TableListItem } from '../data.d';
import { detail } from '../service';
import { Common_Enum, department_query } from '@/services/common';

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
  const [departments, setDepartments] = useState();

  useEffect(() => {
    Common_Enum('PARTY_TYPE').then((res: ResParams<{ [propName: string]: string }>) => {
      setTypes(res.data);
    });
    department_query().then(res => {
      
      if (res.code == '0') {
        // 递归
        function recursive(arr: any) {
          if (arr instanceof Array) {
            arr.forEach(item => {
              item.key = item.id;
              item.title = item.name;
              item.value = item.id;
              if (item.children.length) {
                item.children = recursive(item.children);
              } else {
                item.children = undefined;
              }
            });
          }
          return arr;
        }
        let list = [];
        list = recursive(res.data);
        setDepartments(list)
      }
    })
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
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名">
        {form.getFieldDecorator('username', {
          rules: [{ required: true, message: '请输入！', min: 2 }],
          initialValue: info && info.username,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名字">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入！', min: 2 }],
          initialValue: info && info.name,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="性别">
        {form.getFieldDecorator('gender', {
          initialValue: info && info.gender,
        })(<Select
          // mode="multiple"
          style={{ width: '100%' }}
          placeholder="请选择"
          onChange={e => {
            console.log(e);
          }}
        >
          <Select.Option value="MALE">
            男
          </Select.Option>
          <Select.Option value="FEMALE">
            女
          </Select.Option>
        </Select>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="手机号码">
        {form.getFieldDecorator('phone', {
          // rules: [{ required: true, message: '请输入' }],
          initialValue: info && info.phone,
        })(<Input type="number" placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="报到类型">
        {form.getFieldDecorator('partyType', {
          // rules: [{ required: true, message: '请选择' }],
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
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="所属单位">
        {form.getFieldDecorator('department', {
          initialValue: info && info.department,
        })(
          <TreeSelect
            allowClear
            style={{ width: '100%' }}
            placeholder="请选择"
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeDefaultExpandAll
            treeData={departments}
            onChange={e => {
              console.log(e);
            }}
          ></TreeSelect>,
        )}
      </FormItem>
      {/* <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="报到类型">
        {form.getFieldDecorator('organizationFrom', {
          initialValue: info && info.organizationFrom,
        })(<Select
          // mode="multiple"
          style={{ width: '100%' }}
          placeholder="请选择"
          onChange={e => {
            console.log(e);
          }}
        >
          <Select.Option value="TREETS">
            街道
          </Select.Option>
          <Select.Option value="CHECKIN">
            报道
          </Select.Option>
        </Select>)}
      </FormItem> */}
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="专业特长">
        {form.getFieldDecorator('skill', {
          // rules: [{ required: true, message: '请输入！', min: 2 }],
          initialValue: info && info.skill,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="积分">
        {form.getFieldDecorator('total', {
          // rules: [{ required: true, message: '请输入' }],
          initialValue: info && info.total,
        })(<InputNumber min={0} placeholder="请输入" />)}
      </FormItem>

    </Modal>
  );
};

export default Form.create<CreateFormProps>()(CreateForm);
