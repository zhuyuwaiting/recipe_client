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
  Table,
  Tooltip
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './Template.less';

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
      title="新建模板"
      visible={modalVisible}
      style={{ top: 0 }}
      width={1000}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="处方类型">
        {form.getFieldDecorator('recipeType', {
          rules: [{ required: true, message: '处方类型不可以为空', }],
        })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                {[{
                  "type":"CHINESE",
                  "name":"中药处方"
                },{
                  "type":"WESTERN",
                  "name":"西药处方"
                }].map(function(k) {
                  return <Option value={k.type}>{k.name}</Option>
                })}
              </Select>
        )}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="疾病名称">
        {form.getFieldDecorator('disease', {
          rules: [{ required: true, message: '疾病名称不可以为空', }],
        })(<Input placeholder="请输入疾病名称" />)}
      </FormItem>
      
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="科别">
        {form.getFieldDecorator('disease', {
        })(<Input placeholder="请输入科别" />)}
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
      style={{ top: 0 }}
      width={700}
      onOk={okHandle}
      onCancel={() => handleUpdateModalVisible(false,{})}
    >


<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="药品名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '药品名称不可以为空', }],
          initialValue:updateRow?updateRow.name:"",
        })(<Input placeholder="请输入药品名称" />)}
      </FormItem>

       <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="英文名称">
        {form.getFieldDecorator('englishName', {
          initialValue:updateRow?updateRow.englishName:"",
        })(<Input placeholder="请输入英文名称" />)}
      </FormItem>
      
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="基础重量">
        {form.getFieldDecorator('cellWeight', {
          rules: [{ required: true, message: '药品基础重量不可以为空', }],
          initialValue:updateRow?(updateRow.cellWeight/100).toFixed(2):"",
        })(<InputNumber placeholder="基础重量(0.3g*12/盒中的0.3)" precision='2' style={{ width: '100%' }}/>)}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="药品组成单位">
        {form.getFieldDecorator('cellUnit', {
          rules: [{ required: true, message: '药品基础单位不可以为空', }],
          initialValue:updateRow?updateRow.cellUnit:"",
        })(
          <Select placeholder="请选择" style={{ width: '100%' }}>
            {(enumInfos&&enumInfos['MEDICINE_CELL_UNIT'])?
            enumInfos['MEDICINE_CELL_UNIT'].map(function(k) {
              return <Option value={k.value}>{k.name}</Option>
            }):"" }
          </Select>
        )}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="基础组成数量">
        {form.getFieldDecorator('cellNum', {
          rules: [{ required: true, message: '药品基础组成数量不可以为空', }],
          initialValue:updateRow?updateRow.cellNum:"",
        })(<InputNumber placeholder="药品1单位的基础单位数量(0.3g*12/盒中的12)" precision='0' style={{ width: '100%' }}/>)}
      </FormItem>

    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="药品单位">
        {form.getFieldDecorator('unit', {
          rules: [{ required: true, message: '药品单位不可以为空', }],
          initialValue:updateRow?updateRow.unit:"",
        })(
          <Select placeholder="请选择" style={{ width: '100%' }}>
            {(enumInfos&&enumInfos['MEDICINE_UNIT_EN'])?
            enumInfos['MEDICINE_UNIT_EN'].map(function(k) {
              return <Option value={k.value}>{k.name}</Option>
            }):"" }
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="每日剂量">
        {form.getFieldDecorator('eachDose', {
          rules: [{ required: true, message: '每日剂量不可以为空', }],
          initialValue:updateRow?(updateRow.eachDose/100).toFixed(2):"",
        })(<InputNumber placeholder="每日剂量" precision='2' style={{ width: '100%' }}/>)}
      </FormItem>

       <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="每日次数">
        {form.getFieldDecorator('dailyTimes', {
          rules: [{ required: true, message: '每日次数不可以为空', }],
          initialValue:updateRow?updateRow.dailyTimes:"",
        })(<InputNumber placeholder="每日次数" precision='0' style={{ width: '100%' }}/>)}
      </FormItem>

     <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="服用方式">
        {form.getFieldDecorator('takingWay', {
          rules: [{ required: true, message: '服用方式不可以为空', }],
          initialValue:updateRow?updateRow.takingWay:"",
        })(
          <Select placeholder="请选择" style={{ width: '100%' }}>
            {(enumInfos&&enumInfos['MEDICINE_TAKING_WAY_EN'])?
            enumInfos['MEDICINE_TAKING_WAY_EN'].map(function(k) {
              return <Option value={k.value}>{k.name}</Option>
            }):"" }
          </Select>
        )}
      </FormItem>

    </Modal>
  );
});


/* eslint react/no-multi-comp:0 */
@connect(({ recipeTemplate, loading }) => ({
  recipeTemplate,
  loading: loading.models.recipeTemplate,
}))
@Form.create()
class TemplateAdd extends PureComponent {
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
    {
      title: '处方编号',
      dataIndex: 'recipeTemplateNo',
    },
    {
      title: '处方类型',
      dataIndex: 'recipeType',
      render(val,row){
        if(val =='CHINESE'){
          return '中药处方'
        }
        return '西药处方';
      }
    },
    {
      title: '疾病',
      dataIndex: 'disease',
    },
    {
      title: '科别',
      dataIndex: 'classfication',
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
      type: 'recipeTemplate/fetch',
      payload:{
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
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'recipeTemplate/fetch',
      payload: params,
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
      type: 'recipeTemplate/fetch',
      payload: {
      },
    });
  };

  test = () =>{
    router.push('/enumInfo/manage');
  }

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
          type: 'recipeTemplate/remove',
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
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'recipeTemplate/fetch',
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
      type: 'recipeTemplate/add',
      payload: {
        ...fields,
        cellWeight:fields.cellWeight*100,
        eachDose:fields.eachDose*100,
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
      type: 'recipeTemplate/update',
      payload: {
        ...fields ,
        medicineNo:updateRow.medicineNo,
        cellWeight:fields.cellWeight*100,
        eachDose:fields.eachDose*100,
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
      type: 'recipeTemplate/remove',
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
      type: 'recipeTemplate/batchRemove',
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
            <FormItem label="处方编号">
              {getFieldDecorator('recipeTemplateNo')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="疾病">
              {getFieldDecorator('disease')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <a onClick={() => this.test(true)}>dddd</a>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="处方类型">
              {getFieldDecorator('recipeType')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                {[{
                  "type":"",
                  "name":"所有"
                },{
                  "type":"CHINESE",
                  "name":"中药处方"
                },{
                  "type":"WESTERN",
                  "name":"西药处方"
                }].map(function(k) {
                  return <Option value={k.type}>{k.name}</Option>
                })}
              </Select>
              )}
            </FormItem>
          </Col>
        
          <Col md={8} sm={24}>
            <FormItem label="科别">
              {getFieldDecorator('classfication')(<Input placeholder="请输入" />)}
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
      recipeTemplate: { list,pagination,enumInfos },
      loading,
      form,
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
        <Form onSubmit={this.handleSearch}>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="处方类型">
            {form.getFieldDecorator('recipeType', {
              rules: [{ required: true, message: '处方类型不可以为空', }],
            })(
                    <Select placeholder="请选择" style={{ width: '100%' }}>
                    {[{
                      "type":"CHINESE",
                      "name":"中药处方"
                    },{
                      "type":"WESTERN",
                      "name":"西药处方"
                    }].map(function(k) {
                      return <Option value={k.type}>{k.name}</Option>
                    })}
                  </Select>
            )}
          </FormItem>

          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="疾病名称">
            {form.getFieldDecorator('disease', {
              rules: [{ required: true, message: '疾病名称不可以为空', }],
            })(<Input placeholder="请输入疾病名称" />)}
          </FormItem>
          
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="科别">
            {form.getFieldDecorator('disease', {
            })(<Input placeholder="请输入科别" />)}
          </FormItem>

          <Divider style={{ margin: '40px 0 24px' }} />

          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default TemplateAdd;
