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

const MedicineForm = Form.create()(props => {
  const { modalVisible, form, handleMedicineAdd, handleModalVisible,selectedRows,handleSelectRows,
  loading,medicines,handleStandardTableChange,recipeType,handleMedicineSearch,handleMedicineFormReset } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleMedicineAdd(fieldsValue);
    });
  };
  console.log(medicines);
  let columns = [
    {
      title: '药品编号',
      dataIndex: 'medicineNo',
    },
    {
      title: '药品名称',
      dataIndex: 'name',
    },
    {
      title: '英文名称',
      dataIndex: 'englishName',
    },
    {
      title: '药品单位',
      dataIndex: 'unitInfo',
      render(val,row) {
        return val?val.name:row.unit;
      },
    },
    {
      title: '服用方式',
      dataIndex: 'takingWayInfo',
      render(val,row) {
        return val?val.name:row.unit;
      },
    },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime' ,
        render:(value,index)=>{
          var time = moment(new Date(value)).format("YYYY-MM-DD HH:mm:ss"); ;
          return time;
        }
      },
  ];

  if(recipeType =='WESTERN'){
    columns = [
      {
        title: '药品编号',
        dataIndex: 'medicineNo',
        render(val,row){
          return (<Tooltip placement="rightTop" title={val}>
          {val.substring(0,5) + '...'}
        </Tooltip>);
        }
      },
      {
        title: '药品名称',
        dataIndex: 'name',
      },
      {
        title: '英文名称',
        dataIndex: 'englishName',
      },
      {
        title: '单元组成',
        dataIndex: 'cellWeight',
        render(val,row) {
          return (row.cellWeight/100).toFixed(2)+''+(row.cellUnitInfo?row.cellUnitInfo.name:'')
          +'*'+row.cellNum+'/'+row.unitInfo.name;
        },
      },
      {
        title: '每次剂量',
        dataIndex: 'eachDose',
        render(val,row) {
          return (row.eachDose/100).toFixed(2) + (row.cellUnitInfo?row.cellUnitInfo.name:'');
        },
      },
      {
        title: '每日次数',
        dataIndex: 'dailyTimes',
        render(val,row) {
          return (row.dailyTimes) + '次';
        },
      },
      {
        title: '服用方式',
        dataIndex: 'takingWayInfo',
        render(val,row) {
          return val?val.name:row.unit;
        },
      },
      { title: '创建时间', dataIndex: 'createTime', key: 'createTime' ,
          render:(value,index)=>{
            var time = moment(new Date(value)).format("YYYY-MM-DD HH:mm:ss"); ;
            return time;
          }
        },
    ];
  }

  let renderSimpleForm = ()=> {
    const {
      form: { getFieldDecorator },
    } = props;
    
    return (
      <Form onSubmit={(e)=>handleMedicineSearch(e,form)} layout="inline">
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
              <Button style={{ marginLeft: 8 }} onClick={()=>handleMedicineFormReset(form)}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }


  return (
    <Modal
      destroyOnClose
      title="药品选择"
      visible={modalVisible}
      style={{ top: 0 }}
      width={1000}
      onOk={okHandle}
      onCancel={() => handleModalVisible(false)}
    >
    <div className={styles.tableListForm}>{renderSimpleForm()}</div>
      <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={medicines}
              columns={columns}
              onSelectRow={handleSelectRows}
              onChange={handleStandardTableChange}
            />
    
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
@connect(({ recipeTemplate, loading,medicine }) => ({
  recipeTemplate,
  loading: loading.models.recipeTemplate,
  medicine,
  medicineLoading:loading.models.medicine,
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
    recipeType:undefined,
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
    const { formValues,recipeType } = this.state;

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
      type: 'medicine/fetch',
      payload:{
        ...params,
        type:recipeType=='CHINESE'?'CHINESE_MEDICINE':'WESTERN_MEDICINE',
      },
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

  handleMedicineFormReset = (form) => {
    const { dispatch } = this.props;
    const recipeType = this.state.recipeType;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'medicine/fetch',
      payload: {
        type:recipeType=='CHINESE'?'CHINESE_MEDICINE':'WESTERN_MEDICINE',
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
    if(!flag){
      this.setState({
        modalVisible: false,
      });
      return;
    }
    const { dispatch } = this.props;
    let recipeType = this.state.recipeType;
    if(!recipeType){
      message.error("请先选择处方类型");
      return 
    }
    dispatch({
      type: 'medicine/fetch',
      payload:{
        type:recipeType=='CHINESE'?'CHINESE_MEDICINE':'WESTERN_MEDICINE',
      },
    });
    this.setState({
      modalVisible: !!flag,
    });
    
  };

  handleRecipeTypeChange = (value)=>{
    this.setState({
      recipeType: value,
    });
  }

   handleOK = () => {
    const { dispatch,form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      dispatch({
        type: 'recipeTemplate/add',
        payload: {
          ...fieldsValue,
        },
        callback: (success) =>{
          if(success){
            message.success('添加成功');
            router.push("/recipe/template");
          }else{
            this.setState({
              selectedRows: [],
            });
          }
        }
      });
    });
  };


  handleMedicineAdd = files=>{
    
    this.handleModalVisible(false);
  }


  handleMedicineSearch = (e,form) => {
    e.preventDefault();

    const { dispatch } = this.props;
    const recipeType = this.state.recipeType;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        type:recipeType=='CHINESE'?'CHINESE_MEDICINE':'WESTERN_MEDICINE',
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
      medicineLoading,
      medicine
    } = this.props;
    let data = {
      list:list,
      pagination:pagination
    }
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues,updateRow
    ,recipeType } = this.state;
    const parentMethods = {
      handleMedicineAdd: this.handleMedicineAdd,
      handleModalVisible: this.handleModalVisible,
      handleSelectRows: this.handleSelectRows,
      handleStandardTableChange: this.handleStandardTableChange,
      handleMedicineSearch: this.handleMedicineSearch,
      handleMedicineFormReset: this.handleMedicineFormReset,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper >
        <Card bordered={false}>
        <Form >
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="处方类型">
            {form.getFieldDecorator('recipeType', {
              rules: [{ required: true, message: '处方类型不可以为空', }],
            })(
                    <Select placeholder="请选择" style={{ width: '100%' }} onChange ={(value) => this.handleRecipeTypeChange(value)} >
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
            {form.getFieldDecorator('classfication', {
            })(<Input placeholder="请输入科别" />)}
          </FormItem>

          <Divider style={{ margin: '40px 0 24px' }} />

           {selectedRows.map((selectedRow,index) =>{
             return(
              <Row gutter={{ md: 4, lg: 12, xl: 24 }}>
              <Col md={10} sm={24}>
              <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="药品编号">
            {form.getFieldDecorator('recipeTemplateDetailVOS['+index+'].medicineVO.medicineNo', {
              initialValue:selectedRow.medicineNo
            })(<Input placeholder="请输入科别" disabled = 'disabled'/>)}
          </FormItem>
              </Col>
              <Col md={8}  sm={24}>
              <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="药品名称">
            {form.getFieldDecorator('recipeTemplateDetailVOS['+index+'].medicineVO.name', {
              initialValue:selectedRow.name
            })(<Input placeholder="请输入科别" />)}
          </FormItem>
              </Col>
              <Col md={4}  sm={24}>
              <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="数量">
            {form.getFieldDecorator('recipeTemplateDetailVOS['+index+'].medicineNum', {
               rules: [{ required: true, message: '数量不可为空', }],
            })(<InputNumber placeholder="请输入数量"  precision='0'/>)}
          </FormItem>
              </Col>
              <Icon
            type="minus-circle-o" style={{marginTop:10}}
          />
            </Row>)

           })}   

          <Divider style={{ margin: '40px 0 24px' }} />
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={4} offset={8} sm={24}>
              <span className={styles.submitButtons}>
                <Button type="primary" onClick={() => this.handleModalVisible(true)}>
                  添加药品
                </Button>
              </span>
            </Col>
            <Col md={4}  sm={24}>
              <span className={styles.submitButtons}>
                <Button type="primary"  onClick={() => this.handleOK()}>
                  提交表单
                </Button>
              </span>
            </Col>
          </Row>
          </Form>
        </Card>
        <MedicineForm {...parentMethods} modalVisible={modalVisible} selectedRows={selectedRows}
        loading = {medicineLoading} medicines = {medicine} recipeType={recipeType}
        />
      </PageHeaderWrapper>
    );
  }
}

export default TemplateAdd;
