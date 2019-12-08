import React from 'react';
import ReactQuill, { Quill } from 'react-quill';
import { ImageDrop } from 'quill-image-drop-module';
import 'react-quill/dist/quill.snow.css';
import { Modal, Upload, Icon, message } from 'antd';

const { Dragger } = Upload;

//在quiil中注册quill-image-drop-module
Quill.register('modules/imageDrop', ImageDrop);

interface Props {
  handleQuillChange: (value: string) => void;
  val?: string;
}

export default class NewPage extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.showUploadBox = this.showUploadBox.bind(this);
  }

  state = {
    loading: false,
    value: '',
    init: false,
    visible: false,
    file: '',
  };

  componentDidUpdate() {
    const { val } = this.props;
    if (!this.state.init && val) {
      this.setState({
        value: val,
        init: true,
      });
    }
  }

  handleChange = (value: string) => {
    const { handleQuillChange } = this.props;
    this.setState({
      value,
    });
    handleQuillChange(value);
  };

  //react组件中定义方法
  showUploadBox() {
    console.log('showUploadBox');
    this.setState({
      visible: true,
    });
  }

  handleOk = () => {
    this.setState({
      visible: false,
    });
    let quill = this.refs.reactQuillRef.getEditor(); //获取到编辑器本身
    const cursorPosition = quill.getLength(); //获取当前光标位置
    // const cursorPosition = quill.getSelection().index;//获取当前光标位置
    quill.insertEmbed(cursorPosition, 'image', this.state.file, Quill.sources.USER); //插入图片
    quill.setSelection(cursorPosition + 1); //光标位置加1
  };

  handleCancel = (e: any) => {
    this.setState({
      visible: false,
    });
  };

  render() {
    let showUploadBox = this.showUploadBox;
    const props = {
      name: 'uploadFile',
      defaultFileList: [],
      // fileList: [],
      action: 'http://visit.fothing.com/api/biz/common/file/activity',
    };
    const modules = {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ color: [] }, { background: [] }],
          [
            { list: 'ordered' },
            { list: 'bullet' },
            { indent: '-1' },
            { indent: '+1' },
            { align: [] },
          ],
          ['link', 'image'],
          ['clean'],
        ],
        handlers: {
          image: showUploadBox,
        },
      },
      imageDrop: true,
    };
    return (
      <div>
        <ReactQuill
          ref="reactQuillRef"
          modules={modules}
          style={{ height: 300, marginBottom: 50 }}
          value={this.state.value}
          onChange={this.handleChange}
        />
        <Modal
          title="上传图片"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Dragger
            {...props}
            headers={{
              Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            }}
            onChange={(info: any) => {
              if (info.file.status === 'uploading') {
                this.setState({ loading: true });
                return;
              }

              if (info.file.status === 'done') {
                this.setState({ loading: false, file: info.file.response.data.image });
              }
            }}
          >
            <p className="ant-upload-drag-icon">
              {this.state.loading ? <Icon type="loading" /> : <Icon type="inbox" />}
            </p>
            <div>
              <p className="ant-upload-text">点击或拖拽到此区域上传</p>
              <p className="ant-upload-hint">支持单个上传。</p>
            </div>
          </Dragger>
          {this.state.file && (
            <img src={this.state.file} style={{ width: '100%', marginTop: '10px' }}></img>
          )}
        </Modal>
      </div>
    );
  }
}
