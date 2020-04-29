import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
  Table
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './ChineseMedicine.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible,enumInfos } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="新建药品"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="药品名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '药品名称不可以为空', }],
        })(<Input placeholder="请输入药品名称" />)}
      </FormItem>

       {/* <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="英文名称">
        {form.getFieldDecorator('englishName', {

        })(<Input placeholder="请输入英文名称" />)}
      </FormItem> */}

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="药品数量">
        {form.getFieldDecorator('eachDose', {
          rules: [{ required: true, message: '药品数量', }],
        })(<InputNumber placeholder="药品数量" precision='0' style={{ width: '100%' }}/>)}
      </FormItem>

    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="药品单位">
        {form.getFieldDecorator('unit', {
          rules: [{ required: true, message: '药品单位不可以为空', }],
        })(
          <Select placeholder="请选择" style={{ width: '100%' }}>
            {(enumInfos&&enumInfos['MEDICINE_UNIT_CN'])?
            enumInfos['MEDICINE_UNIT_CN'].map(function(k) {
              return <Option value={k.value}>{k.name}</Option>
            }):"" }
          </Select>
        )}
      </FormItem>

     <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用药方式">
        {form.getFieldDecorator('takingWay', {
          rules: [{ required: true, message: '用药方式不可以为空', }],
        })(
          <Select placeholder="请选择" style={{ width: '100%' }}>
            {(enumInfos&&enumInfos['MEDICINE_TAKING_WAY_CN'])?
            enumInfos['MEDICINE_TAKING_WAY_CN'].map(function(k) {
              return <Option value={k.value}>{k.name}</Option>
            }):"" }
          </Select>
        )}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="医嘱">
        {form.getFieldDecorator('medicalAdvice', {
          rules: [{ required: false, message: '医嘱不可以为空', }],
        })(<Input placeholder="医嘱" />)}
      </FormItem>


    </Modal>
  );
});




const UpdateForm = Form.create()(props => {
  const { updateModalVisible, form, handleUpdate, handleUpdateModalVisible,enumInfos,updateRow } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleUpdate(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="新建药品"
      visible={updateModalVisible}
      onOk={okHandle}
      onCancel={() => handleUpdateModalVisible(false,{})}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="药品名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '药品名称不可以为空', }],
          initialValue:updateRow?updateRow.name:"",
        })(<Input placeholder="请输入药品名称" />)}
      </FormItem>

       {/* <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="英文名称">
        {form.getFieldDecorator('englishName', {
          initialValue:updateRow?updateRow.englishName:"",
        })(<Input placeholder="请输入英文名称" />)}
      </FormItem> */}

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="药品数量">
        {form.getFieldDecorator('eachDose', {
          initialValue:updateRow?updateRow.eachDose:"",
        })(<InputNumber placeholder="药品数量" precision='0' style={{ width: '100%' }}/>)}
      </FormItem>

    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="药品单位">
        {form.getFieldDecorator('unit', {
          rules: [{ required: true, message: '药品单位不可以为空', }],
          initialValue:updateRow?updateRow.unit:"",
        })(
          <Select placeholder="请选择" style={{ width: '100%' }}>
            {(enumInfos&&enumInfos['MEDICINE_UNIT_CN'])?
            enumInfos['MEDICINE_UNIT_CN'].map(function(k) {
              return <Option value={k.value}>{k.name}</Option>
            }):"" }
          </Select>
        )}
      </FormItem>

     <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用药方式">
        {form.getFieldDecorator('takingWay', {
          rules: [{ required: true, message: '用药方式不可以为空', }],
          initialValue:updateRow?updateRow.takingWay:"",
        })(
          <Select placeholder="请选择" style={{ width: '100%' }}>
            {(enumInfos&&enumInfos['MEDICINE_TAKING_WAY_CN'])?
            enumInfos['MEDICINE_TAKING_WAY_CN'].map(function(k) {
              return <Option value={k.value}>{k.name}</Option>
            }):"" }
          </Select>
        )}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="医嘱">
        {form.getFieldDecorator('medicalAdvice', {
          initialValue:updateRow?updateRow.medicalAdvice:"",
        })(<Input placeholder="医嘱" />)}
      </FormItem>

    </Modal>
  );
});


/* eslint react/no-multi-comp:0 */
@connect(({ medicine, loading }) => ({
  medicine,
  loading: loading.models.medicine,
}))
@Form.create()
class ChineseMedicine extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    updateRow:{},
  };

  columns = [
    // {
    //   title: '药品编号',
    //   dataIndex: 'medicineNo',
    // },
    {
      title: '药品名称',
      dataIndex: 'name',
    },
    // {
    //   title: '英文名称',
    //   dataIndex: 'englishName',
    // },
    {
      title: '药品数量',
      dataIndex: 'eachDose',
  
    },
    {
      title: '药品单位',
      dataIndex: 'unitInfo',
      render(val,row) {
        return val?val.name:row.unit;
      },
    },
    {
      title: '用药方式',
      dataIndex: 'takingWayInfo',
      render(val,row) {
        return val?val.name:row.takingWay;
      },
    },
    {
      title: '医嘱',
      dataIndex: 'medicalAdvice'
    },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime' ,
        render:(value,index)=>{
          var time = moment(new Date(value)).format("YYYY-MM-DD HH:mm:ss"); ;
          return time;
        }
      },
    {
      title: '操作',
      render: (text, record,index) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true,record,index)}>修改</a>
          <Divider type="vertical" />
          <a onClick={
            () =>
            (Modal.confirm({
              title: '删除药品',
              content: '确定删除该药品吗？',
              okText: '确认',
              cancelText: '取消',
              onOk:  () => this.handleDelete(record,index),
            }))
          }>删除</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'medicine/fetch',
      payload:{
        type:"CHINESE_MEDICINE",
      }
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
      type:"CHINESE_MEDICINE",
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'medicine/fetch',
      payload: params,
      callback:(success)=>{
        this.setState({
          selectedRows: [],
        });
      }
    });
  };

  previewItem = id => {
    router.push(`/profile/basic/${id}`);
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'medicine/fetch',
      payload: {
        type:"CHINESE_MEDICINE",
      },
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'medicine/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
        type:"CHINESE_MEDICINE",
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'medicine/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      
    });
  };


  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'medicine/add',
      payload: {
        ...fields,
        type:'CHINESE_MEDICINE',
      },
      callback: (success) =>{
        if(success){
          message.success('添加成功');
          this.handleModalVisible();
        }
      }
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { updateRow } = this.state;
    dispatch({
      type: 'medicine/update',
      payload: {
        ...fields ,
        medicineNo:updateRow.medicineNo
      },
      callback: (success) =>{
        if(success){
          message.success('修改成功');
          this.handleUpdateModalVisible();
        }
      }
    });
  };

  handleDelete = (row,index) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'medicine/remove',
      payload: {
        medicineNos:[row.medicineNo],
        index:index,
      },
      callback: (success) =>{
        if(success){
          message.success('删除成功');
        }
      }
    });
  };

  handleBatchDelete = (rows,index) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'medicine/batchRemove',
      payload: {
        medicineNos:rows.map((row)=>row.medicineNo),
      },
      callback: (success) =>{
        this.setState({
          selectedRows: [],
        });
      }
    });
  };

  handleUpdateModalVisible = (flag,record) => {
    this.setState({
      updateModalVisible: !!flag,
      updateRow:record,
    });
  };



  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={8} sm={24}>
            <FormItem label="药品编号">
              {getFieldDecorator('medicineNo')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="药品名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return this.renderSimpleForm();
  }

  render() {
    const {
      medicine: { list,pagination,enumInfos },
      loading,
    } = this.props;
    let data = {
      list:list,
      pagination:pagination
    }
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues,updateRow } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper >
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button onClick={
                    () =>
                    (Modal.confirm({
                      title: '删除药品',
                      content: '确定删除这些药品吗？',
                      okText: '确认',
                      cancelText: '取消',
                      onOk:  () => this.handleBatchDelete(selectedRows),
                    }))
                  }>批量删除</Button>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} enumInfos={enumInfos} />
        <UpdateForm {...updateMethods} updateModalVisible={updateModalVisible} updateRow={updateRow} enumInfos={enumInfos} />
      </PageHeaderWrapper>
    );
  }
}

export default ChineseMedicine;
