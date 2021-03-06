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

import styles from './RecipeEdit.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;



const MedicineForm = Form.create()(props => {
  const { modalVisible, form, handleMedicineAdd, handleModalVisible,selectedRows,handleSelectRows,
  loading,medicines,handleStandardTableChange ,recipeType,handleMedicineSearch,handleMedicineFormReset,getColumns } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleMedicineAdd(fieldsValue);
    });
  };
  console.log(medicines);
  
  let columns = getColumns(recipeType);
  console.log(columns);
  let renderSimpleForm = ()=> {
    const {
      form: { getFieldDecorator },
    } = props;
    
    return (
      <Form onSubmit={(e)=>handleMedicineSearch(e,form)} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
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







const TemplateForm = Form.create()(props => {
  const { templateModalVisible, form,
     handleMedicineAdd, handleTemplateModalVisible,
     templateSelectedRows,handleSelectRows,
  loading,templates,handleTemplateTableChange,recipeType
  ,handleTemplateSearch,handleTemplateFormReset,handleTempalteSelects } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleMedicineAdd(fieldsValue);
    });
  };
  let renderSimpleForm = ()=> {
    const {
      form: { getFieldDecorator },
    } = props;
    
    return (
      <Form onSubmit={(e)=>handleTemplateSearch(e,form)} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
       
          <Col md={8} sm={24}>
            <FormItem label="疾病名称">
              {getFieldDecorator('disease')(<Input placeholder="请输入疾病名称" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={()=>handleTemplateFormReset(form)}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }


  let columns=[
    
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
          <a onClick={() => handleTempalteSelects(row)}>使用模板</a>
        </span>
      ),
    },
  ];
  const expandedRowRender = (fvalue,findex) => {
    console.log(fvalue,findex);
    let children = fvalue.recipeTemplateDetailVOS;
    let columns = [
      { title: '药品名称', dataIndex: 'medicineVO.name', key: 'name' },
      { title: '数量', dataIndex: 'medicineNum', key: 'medicineNum' },
      { title: '单位', dataIndex: 'medicineVO.unitStr', key: 'unitStr'},
      { title: '服用方式', dataIndex: 'medicineVO.takingWayInfo.name', key: 'takingWay' },
    ];
    if(fvalue.recipeType =='WESTERN'){
      columns = [
        { title: '药品名称', dataIndex: 'medicineVO.name', key: 'name' },
        { title: '规格', dataIndex: 'medicineVO.spec', key: 'spec' },
        { title: '数量', dataIndex: 'medicineNum', key: 'medicineNum' },
        { title: '单位', dataIndex: 'medicineVO.unitStr', key: 'unitStr'},
        { title: '服用方式', dataIndex: 'medicineVO.takingWayInfo.name', key: 'takingWay' },
      ];
    }
    return (
      <Table
        columns={columns}
        dataSource={children}
        pagination={false}
      />
    );
  }

  return (
    <Modal
      destroyOnClose
      title="模板选择"
      visible={templateModalVisible}
      style={{ top: 0 }}
      width={1000}
      onOk={() => handleTemplateModalVisible(false)}
      onCancel={() => handleTemplateModalVisible(false)}
    >
    <div className={styles.tableListForm}>{renderSimpleForm()}</div>
     <Table
          className="components-table-demo-nested"
          columns={columns}
          loading={loading}
          expandedRowRender={expandedRowRender}
          dataSource={templates.list}
          pagination={templates.pagination}
          onChange={handleTemplateTableChange}
          />
    </Modal>
  );
});




/* eslint react/no-multi-comp:0 */
@connect(({ recipe, loading,medicine,recipeTemplate }) => ({
  recipe,
  loading: loading.models.recipe,
  medicine,
  medicineLoading:loading.models.medicine,
  recipeTemplate,
  templateLoading:loading.models.recipeTemplate
}))
@Form.create()
class RecipeEdit extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    updateRecipe:{},
    recipeType:undefined,
    selectedMedicines:[],

    templateModalVisible:false,
    templateSelectedRow:undefined,
    selectedTemplate:undefined,
  };

 
  componentDidMount() {
    const { dispatch } = this.props;
    let recipeNo = this.props.match.params.recipeNo;
    if(recipeNo=='null'){
      return;
    }
    dispatch({
      type: 'recipe/query',
      payload:{
        recipeNo:recipeNo
      },
      callback:(success,response)=>{
          if(success){
             //设置selectedRows 和recipeType
             let selectedMedicines = response.recipeInfoVO.recipeDetailVOS.map(recipeDetailVO=>{
               let medicineVO = recipeDetailVO.medicineVO
               medicineVO['medicineNum'] = recipeDetailVO.medicineNum;
               return medicineVO;
             })
            this.setState({
              selectedMedicines: selectedMedicines,
              recipeType:response.recipeInfoVO.recipeType,
              updateRecipe:response.recipeInfoVO,
            });
          }
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
      callback:(success)=>{
          this.setState({
            selectedRows: [],
          });
      }
    });
  
  };

  handleTemplateTableChange = (pagination, filtersArg, sorter) => {
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
      type: 'recipeTemplate/fetch',
      payload:{
        ...params,
        type:recipeType=='CHINESE'?'CHINESE_MEDICINE':'WESTERN_MEDICINE',
      },
    });
  
  };
  

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'recipe/fetch',
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

  handleTemplateFormReset = (form) => {
    const { dispatch } = this.props;
    const recipeType = this.state.recipeType;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'recipeTemplate/fetch',
      payload: {
        type:recipeType=='CHINESE'?'CHINESE_MEDICINE':'WESTERN_MEDICINE',
      },
    });
  };

  

  onMedicineNumChange = (val,index)=>{
    let newSelectedRows = this.state.selectedMedicines;
    newSelectedRows[index].medicineNum = val;
    this.setState({
      selectedMedicines: newSelectedRows,
    });
  }
  onMedicineDel = (row)=>{
    let newSelectedRows = this.state.selectedMedicines;
    newSelectedRows = newSelectedRows.filter(selectRow =>{
        return selectRow.medicineNo !=  row.medicineNo;
    })    
    
    this.setState({
      selectedMedicines: newSelectedRows,
    });
  }

  handleSelectRows = rows => {

    let newSelectedRows = this.state.selectedMedicines;
    let newRows = rows.filter(row =>{
      for(let i = 0;i<newSelectedRows.length;i++){
        if(row.medicineNo == newSelectedRows[i].medicineNo){
          return false;
        }
      }
      return true;
    }).map(row =>{
      row.medicineNum = 1;
      return row;
    })
    newSelectedRows = newSelectedRows.concat(newRows);
    this.setState({
      selectedRows: rows,
      selectedMedicines:newSelectedRows,
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
        type: 'recipe/fetch',
        payload: values,
        callback:(success)=>{
          
        }
      });
    });
  };

  handleModalVisible = flag => {
    const { dispatch } = this.props;
    
    if(!flag){
      dispatch({
        type: 'medicine/flush',
      });
      this.setState({
        modalVisible: false,
      });
      return;
      
    }
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


  handleTemplateModalVisible = flag => {
    const { dispatch } = this.props;
    
    if(!flag){
      dispatch({
        type: 'recipeTemplate/flush',
      });
      this.setState({
        templateModalVisible: false,
      });
      return;
      
    }
    let recipeType = this.state.recipeType;
    if(!recipeType){
      message.error("请先选择处方类型");
      return 
    }
    dispatch({
      type: 'recipeTemplate/fetch',
      payload:{
        recipeType:recipeType,
        needDetails:true,
      },
    });
    this.setState({
      templateModalVisible: !!flag,
    });
    
  };

  
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

  handleTemplateSearch = (e,form) => {
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
        type: 'recipeTemplate/fetch',
        payload: values,
      });
    });
  };

  
  handleTempalteSelects = template => {
    const { dispatch } = this.props;
    
    console.log('template:',template,this.state.selectedMedicines);
    let newSelectedRows = template.recipeTemplateDetailVOS.map((recipeTemplateDetail)=>{
      let newSelectedRow = recipeTemplateDetail.medicineVO;
      newSelectedRow.medicineNum = recipeTemplateDetail.medicineNum;
      return newSelectedRow;
    })
    this.setState({
      selectedTemplate:template,
      selectedMedicines:newSelectedRows,
      templateModalVisible:false,
    });
  };



  handleRecipeTypeChange = (value)=>{
    this.setState({
      recipeType: value,
      selectedRows:[],
      selectedMedicines:[],
    });
  }

  handleBack = ()=>{
    router.push("/recipe/recipeManage")
  }

   handleOK = () => {
    const { dispatch,form } = this.props;
    let operator = this.props.match.params.operator;
    
    let selectedMedicines = this.state.selectedMedicines;
    if(!selectedMedicines || selectedMedicines.length<=0){
      message.error("药品信息不可为空，请添加药品信息");
      return 
    }
    let recipeDetailVOS = selectedMedicines.map(selectedRow =>{
      return {
        medicineNo:selectedRow.medicineNo,
        medicineNum:selectedRow.medicineNum,
      }
    })
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log(recipeDetailVOS);
      console.log(fieldsValue);
      dispatch({
        type: 'recipe/'+operator,
        payload: {
          ...fieldsValue,
          recipeDetailVOS:recipeDetailVOS,
          recipeNo:this.state.updateRecipe.recipeNo,
        },
        callback: (success) =>{
          if(success){
            if(operator=='add'){
              message.success('添加成功');
            }else{
              message.success('修改成功');
            }
            form.resetFields();            
            this.setState({
              selectedRows: [],
            });
            router.push("/recipe/recipeManage");
          }
        }
      });
    });
  };


  handleMedicineAdd = files=>{
    
    this.handleModalVisible(false);
  }


  getColumns = (recipeType) =>{
    let columns = [
     
      {
        title: '药品名称',
        dataIndex: 'name',
      },
      {
        title: '单位',
        dataIndex: 'unitStr',
      },
      {
        title: '服用方式',
        dataIndex: 'takingWayInfo',
        render(val,row) {
          return val?val.name:row.takingWay;
        },
      },
      {
        title: '备注',
        dataIndex: 'memo',
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
          title: '药品名称',
          dataIndex: 'name',
        },
        {
          title: '单位',
          dataIndex: 'unitStr',
        },
        {
          title: '规格',
          dataIndex: 'spec',
        },
       
       
        {
          title: '服用方式',
          dataIndex: 'takingWayInfo',
          render(val,row) {
            return val?val.name:row.unit;
          },
        },
        {
          title: '备注',
          dataIndex: 'memo',
        },
        { title: '创建时间', dataIndex: 'createTime', key: 'createTime' ,
            render:(value,index)=>{
              var time = moment(new Date(value)).format("YYYY-MM-DD HH:mm:ss"); ;
              return time;
            }
          },
      ];
    }
    return columns;
  }

 
  
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          
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
      recipe: { list,pagination,enumInfos },
      loading,
      form,
      medicineLoading,
      medicine,
      templateLoading,
      recipeTemplate,
      
    } = this.props;
    
    let data = {
      list:list,
      pagination:pagination
    }
    
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues,updateRecipe,selectedMedicines
      ,recipeType ,
      templateModalVisible,
      templateSelectedRow,
      selectedTemplate,
    } = this.state;
    let columns = this.getColumns(recipeType);
    let onMedicineNumChange = this.onMedicineNumChange;
    let onMedicineDel = this.onMedicineDel;
    columns.pop();
    columns.push(
      {
        title: '数量',
        dataIndex: 'medicineNum',
        render(val,row,index) {
          return <InputNumber min={1} max={1000} defaultValue={1} onChange={(val)=>onMedicineNumChange(val,index)} />
        },
      },
      {
        title: '单位',
        dataIndex: 'unitStr',
        
      }
    )
    columns.splice(1,1);
    columns.push(
      {
        title: '',
        dataIndex: 'operator',
        render(val,row,index) {
          return <Icon type="delete" onClick={()=>onMedicineDel(row)}/> 
        },
      }
    )
    console.log(columns);

    const parentMethods = {
      handleMedicineAdd: this.handleMedicineAdd,
      handleModalVisible: this.handleModalVisible,
      handleSelectRows: this.handleSelectRows,
      handleStandardTableChange: this.handleStandardTableChange,
      handleMedicineSearch: this.handleMedicineSearch,
      handleMedicineFormReset: this.handleMedicineFormReset,
      getColumns: this.getColumns
    };

    const templateMethods = {
      handleTempalteSelects: this.handleTempalteSelects,
      handleTemplateModalVisible: this.handleTemplateModalVisible,
      handleTemplateTableChange: this.handleTemplateTableChange,
      handleTemplateSearch: this.handleTemplateSearch,
      handleTemplateFormReset: this.handleTemplateFormReset,
    };

 
    return (
      <PageHeaderWrapper >
        <Card bordered={false}>
        <Form >

        



          <Divider/>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8}   sm={24}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="姓名">
              {form.getFieldDecorator('patientName', {
                rules: [{ required: true, message: '姓名不可以为空', }],
                initialValue:updateRecipe?updateRecipe.patientName:""
              })(<Input placeholder="请输入患者姓名" />)}
            </FormItem>
            </Col>
            <Col md={8}  sm={24}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="性别">
              {form.getFieldDecorator('patientSex', {
                rules: [{ required: true, message: '性别不可以为空', }],
                initialValue:updateRecipe&&updateRecipe.patientSex !=undefined?updateRecipe.patientSex+"":"0"
              })(
                      <Select placeholder="请选择" style={{ width: '100%' }}  >
                      {[{
                        "value":"0",
                        "name":"男"
                      },{
                        "value":"1",
                        "name":"女"
                      }].map(function(k) {
                        return <Option value={k.value}>{k.name}</Option>
                      })}
                    </Select>
              )}
            </FormItem>
            </Col>

            <Col md={8}  sm={24}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="年龄">
              {form.getFieldDecorator('patientAge', {
                rules: [{ required: true, message: '年龄不可以为空', }],
                initialValue:updateRecipe?updateRecipe.patientAge:""
              })(<InputNumber placeholder="请输入患者年龄" />)}
            </FormItem>
            </Col>
          </Row>

       <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8}   sm={24}>
            <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="处方类型">
            {form.getFieldDecorator('recipeType', {
              rules: [{ required: true, message: '处方类型不可以为空', }],
              initialValue:updateRecipe?updateRecipe.recipeType:""
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
            </Col>
            <Col md={8}  sm={24}>
            <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="疾病名称">
              {form.getFieldDecorator('disease', {
                rules: [{ required: true, message: '疾病名称不可以为空', }],
                initialValue:updateRecipe?updateRecipe.disease:(selectedTemplate?selectedTemplate.disease:""),
              })(<Input placeholder="请输入患者所患疾病" />)}
            </FormItem>
            </Col>

          
          </Row>



          

          {(selectedMedicines&&selectedMedicines.length>0)?(<Divider style={{ margin: '40px 0 24px' }} />):""} 

           {
             (selectedMedicines&&selectedMedicines.length>0)?(
              <Table columns={columns} dataSource={selectedMedicines}  />
             ):""
           }   
          {
            (selectedMedicines&&selectedMedicines.length>0&&recipeType=='CHINESE')?(
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={24} offset={4} sm={24}>
                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="付数">
                  {form.getFieldDecorator('num', {
                    rules: [{ required: true, message: '中药付数不可以为空', }],
                    initialValue:updateRecipe?updateRecipe.num:""
                  })(<InputNumber placeholder="请输入付数" />)}
                </FormItem>
              </Col>
            </Row>
            ):""
          }
         


          <Divider style={{ margin: '40px 0 24px' }} />
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={4} offset={6} sm={24}>
              <span className={styles.submitButtons}>
                <Button type="primary" onClick={() => this.handleTemplateModalVisible(true)}>
                  选择模板
                </Button>
              </span>
            </Col>
            <Col md={4}  sm={24}>
              <span className={styles.submitButtons}>
                <Button type="primary"  onClick={() => this.handleModalVisible(true)}>
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

             <Col md={4}  sm={24}>
              <span className={styles.submitButtons}>
                <Button type="primary"  onClick={() => this.handleBack()}>
                  返回
                </Button>
              </span>
            </Col>
          
          </Row>
          </Form>
        </Card>
        <MedicineForm {...parentMethods} modalVisible={modalVisible} selectedRows={selectedRows}
        loading = {medicineLoading} medicines = {medicine} recipeType={recipeType} 
        />
       
       <TemplateForm {...templateMethods} templateModalVisible={templateModalVisible} 
                    templateSelectedRow={templateSelectedRow}
        loading = {templateLoading} templates = {recipeTemplate} recipeType={recipeType} 
        />

      </PageHeaderWrapper>
    );
  }
}

export default RecipeEdit;
