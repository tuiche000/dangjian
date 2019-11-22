import { Form, TreeSelect, Modal } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React, { useState, useEffect } from 'react';
import { TableListItem } from '../data.d';
import { departmentAll } from '../service';

const FormItem = Form.Item;

interface ModalComponentProps extends FormComponentProps {
  modalVisible: boolean;
  handleAdd: (parasm: TableListItem) => void;
  handleModalVisible: () => void;
}
const ModalComponent: React.FC<ModalComponentProps> = props => {

  const [options, setOptions] = useState();

  useEffect(() => {
    departmentAll().then((res: ResParams<TableListItem>) => {
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
  }, [])

  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      fieldsValue.departments = fieldsValue.departments.join(',')
      form.resetFields();
      handleAdd({
        ...fieldsValue
      });
    });
  };
  return (
    <Modal
      destroyOnClose
      title="选择单位"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="发布单位">
        {form.getFieldDecorator('departments', {
          rules: [{ required: true, message: '请选择' }]
        })(
          <TreeSelect
            allowClear
            style={{ width: '100%' }}
            multiple
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
    </Modal>
  );
};

export default Form.create<ModalComponentProps>()(ModalComponent);
