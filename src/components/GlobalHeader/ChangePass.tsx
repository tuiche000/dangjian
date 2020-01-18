import { Form, Input, Modal } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React from 'react';

const FormItem = Form.Item;

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  handlePut: (fieldsValue: {
    id: string
    newPassword: string
    oldPassword: string
    rePassword: string
  }) => void;
  handleModalVisible: (flag: boolean) => void;
}
const KaikaForm: React.FC<CreateFormProps> = props => {
  const { modalVisible, form, handlePut, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handlePut(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="修改密码"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible(false)}
    >
      {/* <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="原密码">
        {form.getFieldDecorator('oldPassword', {
          rules: [{ required: true, message: '密码必须4到12位，且不能出现空格', pattern: /^[^\s]{4,12}$/ }],
        })(<Input.Password placeholder="请输入原密码" />)}
      </FormItem> */}
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="原密码">
        {form.getFieldDecorator('oldpassword', {
          rules: [{ required: true, message: '密码必须1到12位，且不能出现空格', pattern: /^[^\s]{1,12}$/ }],
        })(<Input.Password placeholder="请输入新密码" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="新密码">
        {form.getFieldDecorator('newpassword', {
          rules: [{ required: true, message: '密码必须1到12位，且不能出现空格', pattern: /^[^\s]{1,12}$/ }],
        })(<Input.Password placeholder="请再次输入新密码" />)}
      </FormItem>
    </Modal>
  );
};

export default Form.create<CreateFormProps>()(KaikaForm);
