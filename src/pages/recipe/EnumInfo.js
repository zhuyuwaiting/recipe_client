import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import {
  Table, Badge, Menu, Dropdown, Icon,
  Form,
  Card,
  Modal,

  Row,
  Col,
  Input,
  Select,
  Button,
  InputNumber,
  DatePicker,
  message,
  Divider,
  Steps,
  Radio,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './EnumInfo.less';
import { resolve } from 'url';
const FormItem = Form.Item;

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible,addRow } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  console.log(addRow);
  return (
    <Modal
      destroyOnClose
      title="新建枚举"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="唯一键">
        {form.getFieldDecorator('key', {
          initialValue:addRow?addRow.key:"" 
        })(<Input disabled />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
        {form.getFieldDecorator('keyDesc', {
          initialValue:addRow?addRow.keyDesc:""
        })(<Input  disabled/>)}
      </FormItem>
        
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="值">
        {form.getFieldDecorator('value', {
          rules: [{ required: true, message: 'enum值必填' }],
        })(<Input  />)}
      </FormItem>

       <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="值名称">
        {form.getFieldDecorator('name', {
        rules: [{ required: true, message: '值名称必填' }],
        })(<Input  />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="值描述">
        {form.getFieldDecorator('desc', {
               rules: [{ required: true, message: "描述必填" }],
        })(<Input  />)}
      </FormItem>

    </Modal>
  );
});


/* eslint react/no-multi-comp:0 */
@connect(({ enumInfo, loading }) => ({
  enumInfo,
  loading: loading.models.enumInfo,
}))
@Form.create()
class EnumInfo extends PureComponent {
  state = {
    modalVisible: false,
    addRow:null,
  };

  handleModalVisible = (flag,row) => {
    this.setState({
      modalVisible: !!flag,
      addRow:row,
    });
  };

  handleAdd = fields => {
    const { dispatch,success } = this.props;
    dispatch({
      type: 'enumInfo/add',
      payload:  fields,
      callback: (success) =>{
        if(success){
        message.success('添加成功');
        this.handleModalVisible();
        }
      }
    });
  };
  
  deleteEnumInfo = (row,findex,index) => {
    const { dispatch,success } = this.props;
    dispatch({
      type: 'enumInfo/remove',
      payload:  {
        key:row.key,
        value:row.value,
        index:index,
        findex:findex,
      },
      callback: (success) =>{
        if(success){
          message.success('删除成功');
        }
      }
    });
  };
  handleTableChange = (pagination) => {
    debugger
    const { dispatch } = this.props;
    dispatch({
      type: 'enumInfo/fetch',
      payload: {
        pageSize:pagination.pageSize,
        current:pagination.current,
        key:""
      },
    });
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'enumInfo/fetch',
      payload: {
        pageSize:10,
        current:1,
        key:""
      },
    });
  }


  render() {
    const {
      enumInfo,
      loading,
      dispatch
    } = this.props;
    const { modalVisible,addRow } = this.state;
    var subList = enumInfo.enumInfo;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const expandedRowRender = (fvalue,findex) => {
      let children = fvalue.enumInfoVOList;
      const columns = [
        { title: '取值', dataIndex: 'value', key: 'value' },
        { title: '名称', dataIndex: 'name', key: 'name' },
        { title: '描述', dataIndex: 'desc', key: 'desc' },
        { title: '创建时间', dataIndex: 'createTime', key: 'createTime' ,
        render:(value,index)=>{
          var time = moment(new Date(value)).format("YYYY-MM-DD HH:mm:ss"); ;
          return time;
        }
      },
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          render: (value,row,index) => (
            <span className="table-operation">
              <a  onClick={() => this.deleteEnumInfo(row,findex,index)}>删除</a>
            </span>
          ),
        },
      ];
      return (
        <Table
          columns={columns}
          dataSource={children}
          pagination={false}
        />
      );
    }
    const columns = [
      { title: '唯一键', dataIndex: 'key', key: 'key' },
      { title: '名称', dataIndex: 'keyDesc', key: 'keyDesc' },
      { title: '创建时间', dataIndex: 'createTime', key: 'createTime' ,
        render:(value,index)=>{
          var time = moment(new Date(value)).format("YYYY-MM-DD HH:mm:ss"); ;
          return time;
        }
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (value,row) => (
          <span className="table-operation">
            <a  onClick={() => this.handleModalVisible(true,row)}>新增</a>
          </span>
        ),
      },
    ];
    console.log(enumInfo.pagination);
    return (
      
      <PageHeaderWrapper >
        <Card bordered={false}>
        <h3 className={styles.tableListForm}>枚举管理</h3>
          <Table
          className="components-table-demo-nested"
          columns={columns}
          expandedRowRender={expandedRowRender}
          dataSource={enumInfo.list}
          pagination={enumInfo.pagination}
          onChange={(newPagination)=>{this.handleTableChange(newPagination)}}
          />
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} addRow={addRow} />
      </PageHeaderWrapper>
      
    );


  }
}

export default EnumInfo;
