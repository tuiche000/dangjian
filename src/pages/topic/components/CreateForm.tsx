import { Form, Input, Modal, Upload, Icon, InputNumber } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React, { useState, useEffect } from 'react';
import { AddParams, TableListItem } from '../data.d';
import { detail } from '../service';

const FormItem = Form.Item;
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

  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState();

  useEffect(() => {
    if (hasVal) {
      // 修改加载数据
      let id = values ? values.id : '';
      detail(id).then((res: ResParams<TableListItem>) => {
        if (res.code == '0') {
          console.log(res);
          setImageUrl(res.data.image);
          setInfo(res.data);
        }
      });
    }
  }, []);

  const okHandle = () => {
    form.validateFields((err, fieldsValue: AddParams) => {
      if (err) return;
      form.resetFields();
      setImageUrl('');
      fieldsValue.image = imageUrl;
      fieldsValue.fileType = 'IMAGE';
      fieldsValue.menu = 2;
      fieldsValue.enabled = 'true';
      fieldsValue.recommend = 'true';
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

  const handleChange = (info: any) => {
    console.log(info);
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      setImageUrl(info.file.response.data.image);
      setLoading(false);
    }
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
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="标题">
        {form.getFieldDecorator('title', {
          rules: [{ required: true, message: '请输入！', min: 2 }],
          initialValue: info && info.title,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="内容">
        {form.getFieldDecorator('brief', {
          rules: [{ required: true, message: '请输入！', min: 1 }],
          initialValue: info && info.brief,
        })(<TextArea rows={3} placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="图片" extra="请上传图片">
        {form.getFieldDecorator('backgroundPicture', {
          // rules: [{ required: true, message: '请上传' }],
          // initialValue: info && info.primary,
        })(
          <Upload
            name="uploadFile"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action={`https://h5.fothing.com/api/biz/common/file/banner`}
            headers={{
              Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            }}
            // beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {imageUrl && !loading ? (
              <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
            ) : (
              uploadButton
            )}
          </Upload>,
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="显示顺序">
        {form.getFieldDecorator('displayOrder', {
          rules: [{ required: true, message: '请输入' }],
          initialValue: info && info.displayOrder,
        })(<InputNumber min={1} max={99} placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
};

export default Form.create<CreateFormProps>()(CreateForm);
