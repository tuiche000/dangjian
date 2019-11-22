import { Form, Input, Modal, Upload, Icon, InputNumber, Select, TreeSelect, Switch, DatePicker } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React, { useState, useEffect } from 'react';
import { AddParams, TableListItem } from '../data.d';
import { detail, departmentAll } from '../service';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option

interface CreateFormProps extends FormComponentProps {
  activeStatus: { [key: string]: string };
  serviceType: { [key: string]: string };
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
    activeStatus,
    serviceType
  } = props;

  const [options, setOptions] = useState();
  const [imageUrl, setImageUrl] = useState('');
  const [thumnail, setThumnail] = useState('');
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState();

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

    if (hasVal) {
      // 修改加载数据
      let id = values ? values.id : '';
      detail(id).then((res: ResParams<TableListItem>) => {
        if (res.code == '0') {
          console.log(res);
          setImageUrl(res.data.image);
          setThumnail(res.data.thumnail);
          setInfo(res.data);
        }
      });
    }
  }, []);

  const okHandle = () => {
    form.validateFields((err, fieldsValue: AddParams) => {
      if (err) return;
      fieldsValue.begin = moment(fieldsValue.begin).format('YYYY-MM-DD HH:mm:ss')
      fieldsValue.end = moment(fieldsValue.end).format('YYYY-MM-DD HH:mm:ss')
      fieldsValue.image = imageUrl;
      fieldsValue.thumnail = thumnail;
      fieldsValue.fileType = 'IMAGE';
      fieldsValue.menu = 2;
      fieldsValue.enabled = 'true';
      setLoading(false)
      setImageUrl('');
      setThumnail('');
      form.resetFields();      
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

  const handleChange = (info: any, type: string) => {
    console.log(info, type);
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      console.log(info)
      const url = info.file.response.data.image
      if (type === 'image') {
        setImageUrl(url);
      } else {
        setThumnail(url);
      }
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
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="联系人">
        {form.getFieldDecorator('contacter', {
          rules: [{ required: true, message: '请输入！', min: 2 }],
          initialValue: info && info.contacter,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="联系电话">
        {form.getFieldDecorator('callphone', {
          rules: [{ required: true, message: '请输入！', min: 2 }],
          initialValue: info && info.callphone,
        })(<Input type="number" placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="服务类型">
        {form.getFieldDecorator('serviceType', {
          rules: [{ required: true, message: '请选择' }],
          initialValue: info && info.serviceType,
        })(
          <Select
            // mode="multiple"
            style={{ width: '100%' }}
            placeholder="请选择"
            onChange={e => {
              console.log(e);
            }}
          >
            {
              info && Object.keys(serviceType).map(
                (item: any): JSX.Element => {
                  return (
                    <Option key={item} value={item}>
                      {serviceType[item]}
                    </Option>
                  );
                },
              )
            }
          </Select>,
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="发布单位">
        {form.getFieldDecorator('department', {
          rules: [{ required: true, message: '请选择' }],
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
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="内容">
        {form.getFieldDecorator('content', {
          rules: [{ required: true, message: '请输入！', min: 1 }],
          initialValue: info && info.content,
        })(<Input.TextArea rows={5} placeholder="请输入" />)}
      </FormItem>
      
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="人数上限">
        {form.getFieldDecorator('limit', {
          rules: [{ required: true, message: '请输入' }],
          initialValue: info && info.limit,
        })(<InputNumber min={1} max={99} placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="开始时间">
        {form.getFieldDecorator('begin', {
          initialValue: info ? moment(info.begin) : null,
          rules: [{ type: 'object', required: true, message: '请选择' }]
        })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="结束时间">
        {form.getFieldDecorator('end', {
          initialValue: info ? moment(info.end) : null,
          rules: [{ type: 'object', required: true, message: '请选择' }]
        })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="首页推荐">
        {form.getFieldDecorator('recommend', {
          rules: [{ required: true, message: '请输入' }],
          valuePropName:'checked',
          initialValue: info && info.recommend,
        })(<Switch />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="图片"
        extra="请上传图片"
      >
        {form.getFieldDecorator('backgroundPicture', {
          // rules: [{ required: true, message: '请上传' }],
          // initialValue: info && info.primary,
        })(
          <Upload
            name="uploadFile"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action={`http://visit.fothing.com/api/biz/common/file/activity`}
            headers={{
              Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            }}
            // beforeUpload={beforeUpload}
            onChange={(e) => handleChange(e, 'image')}
          >
            {imageUrl && !loading ? (
              <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
            ) : (
                uploadButton
              )}
          </Upload>,
        )}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="缩略图"
        extra="请上传缩略图"
      >
        {form.getFieldDecorator('backgroundPicture2', {
          // rules: [{ required: true, message: '请上传' }],
          // initialValue: info && info.primary,
        })(
          <Upload
            name="uploadFile"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action={`http://visit.fothing.com/api/biz/common/file/banner`}
            headers={{
              Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            }}
            // beforeUpload={beforeUpload}
            onChange={(e) => handleChange(e, 'thumnail')}
          >
            {thumnail && !loading ? (
              <img src={thumnail} alt="avatar" style={{ width: '100%' }} />
            ) : (
                uploadButton
              )}
          </Upload>,
        )}
      </FormItem>
    </Modal>
  );
};

export default Form.create<CreateFormProps>()(CreateForm);
