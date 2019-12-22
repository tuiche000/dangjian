import { Form, Input, Modal, Icon, InputNumber, TreeSelect, Select } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React, { useState, useEffect } from 'react';
import { AddParams, TableListItem } from '../data.d';
import { department_query, detail } from '../service';

const FormItem = Form.Item;

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  hasVal: boolean; // true=>编辑 false=>新增
  values?: Partial<AddParams>;
  handleAdd?: (fieldsValue: AddParams) => void;
  handleModalVisible?: () => void;
  handleUpdate?: (fieldsValue: AddParams) => void;
  handleUpdateModalVisible?: (flag?: boolean, record?: AddParams) => void;
}
const MenuCreateForm: React.FC<CreateFormProps> = props => {
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

  const [options, setOptions] = useState();
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState();

  useEffect(() => {
    department_query().then((res: ResParams<TableListItem>) => {
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
        setOptions(list);
      }
    });
    // 修改加载数据
    if (hasVal) {
      let id = values ? values.id : '';
      detail(id).then((res: ResParams<TableListItem>) => {
        if (res.code == '0') {
          let data = { ...res.data };
          data.key = data.id;
          data.title = data.name;
          data.value = data.id;
          setInfo(data);
        }
      });
    }
  }, [modalVisible]);

  const okHandle = () => {
    form.validateFields((err, fieldsValue: AddParams) => {
      if (err) return;
      form.resetFields();
      fieldsValue.fileType = 'IMAGE';
      fieldsValue.menu = 2;
      fieldsValue.enabled = 'true';
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

  const uploadButton = (
    <div>
      <Icon type={loading ? 'loading' : 'plus'} />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

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
          rules: [{ required: true, message: '请输入！', min: 2 }],
          initialValue: info && info.name,
        })(<Input placeholder="请输入" />)}
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
            treeData={options}
            onChange={e => {
              console.log(e);
            }}
          ></TreeSelect>,
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="组织类型">
        {form.getFieldDecorator('partyType', {
          // rules: [{ required: true, message: '请输入！', min: 2 }],
          initialValue: info && info.partyType,
        })(<Select
          // mode="multiple"
          style={{ width: '100%' }}
          placeholder="请选择"
          onChange={e => {
            console.log(e);
          }}
        >
          <Select.Option value="PTY_COM">
            党委
          </Select.Option>
          <Select.Option value="PTY_BRANCH">
            党总支
          </Select.Option>
          <Select.Option value="PTY_SUBBRANCH">
            党支部
          </Select.Option>
        </Select>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="报到组织">
        {form.getFieldDecorator('orgfrom', {
          initialValue: "CHECKIN"
        })(<Select
          disabled
          // mode="multiple"
          style={{ width: '100%' }}
          placeholder="请选择"
          onChange={e => {
            console.log(e);
          }}
        >
          <Select.Option value="CHECKIN">
            报到组织
          </Select.Option>
        </Select>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="显示顺序">
        {form.getFieldDecorator('displayOrder', {
          rules: [{ required: true, message: '请输入' }],
          initialValue: info && info.displayOrder,
        })(<InputNumber min={0} max={99} placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
};

export default Form.create<CreateFormProps>()(MenuCreateForm);
