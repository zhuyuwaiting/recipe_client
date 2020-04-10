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
  loading,medicines,handleStandardTableChange,recipeType,handleMedicineSearch,handleMedicineFormReset,getColumns } = props;
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
    selectedMedicines:[],
  };

 
  componentDidMount() {
    const { dispatch } = this.props;
    let recipeTemplateNo = this.props.match.params.recipeTemplateNo;
    dispatch({
      type: 'recipeTemplate/query',
      payload:{
        recipeTemplateNo:recipeTemplateNo
      },
      callback:(success,response)=>{
          if(success){
             //设置selectedRows 和recipeType
             let selectedMedicines = response.recipeTemplateVO.recipeTemplateDetailVOS.map(recipeTemplateDetailVO=>{
               let medicineVO = recipeTemplateDetailVO.medicineVO
               medicineVO['medicineNum'] = recipeTemplateDetailVO.medicineNum;
               return medicineVO;
             })
            this.setState({
              selectedMedicines: selectedMedicines,
              recipeType:response.recipeTemplateVO.recipeType
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

  handleBack = ()=>{
    router.push("/recipe/template")
  }

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
        type: 'recipeTemplate/fetch',
        payload: values,
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

  handleRecipeTypeChange = (value)=>{
    this.setState({
      recipeType: value,
      selectedRows:[],
    });
  }

  handleOK = () => {
    const { dispatch,form } = this.props;
    let selectedMedicines = this.state.selectedMedicines;
    if(!selectedMedicines || selectedMedicines.length<=0){
      message.error("药品信息不可为空，请添加药品信息");
      return 
    }
    let recipeTemplateDetailVOS = selectedMedicines.map(selectedRow =>{
      return {
        medicineNo:selectedRow.medicineNo,
        medicineNum:selectedRow.medicineNum,
      }
    })
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log(recipeTemplateDetailVOS);
      console.log(fieldsValue);
      dispatch({
        type: 'recipeTemplate/update',
        payload: {
          ...fieldsValue,
          recipeTemplateDetailVOS:recipeTemplateDetailVOS
        },
        callback: (success) =>{
          if(success){
            message.success('修改成功');
            form.resetFields();            
            this.setState({
              selectedRows: [],
              selectedMedicines: [],
            });
            router.push("/recipe/template");
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
        dataIndex: 'medicalAdviceInfo',
        render(val,row) {
          return val?val.name:"";
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
        // {
        //   title: '药品编号',
        //   dataIndex: 'medicineNo',
        //   render(val,row){
        //     return (<Tooltip placement="rightTop" title={val}>
        //     {val.substring(0,5) + '...'}
        //   </Tooltip>);
        //   }
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
          title: '用药频次',
          dataIndex: 'frequencyInfo',
          render(val,row) {
            return val?val.name:'';
          },
        },
        {
          title: '用药方式',
          dataIndex: 'takingWayInfo',
          render(val,row) {
            return val?val.name:row.unit;
          },
        },
        {
          title: '医嘱',
          dataIndex: 'medicalAdviceInfo',
          render(val,row) {
            return val?val.name:"";
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
    return columns;
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
      recipeTemplate: { list,pagination,enumInfos,queryObject      },
      loading,
      form,
      medicineLoading,
      medicine
    } = this.props;
    let data = {
      list:list,
      pagination:pagination
    }
    
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues,updateRow,selectedMedicines
      ,recipeType } = this.state;
    let columns = this.getColumns(recipeType);
    let onMedicineNumChange = this.onMedicineNumChange;
    let onMedicineDel = this.onMedicineDel;
    columns.pop();
    columns.push(
      {
        title: '数量',
        dataIndex: 'medicineNum',
        render(val,row,index) {
          return <InputNumber min={1} max={1000} defaultValue={val} onChange={(val)=>onMedicineNumChange(val,index)} />
        },
      }
    )
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
 
    return (
      <PageHeaderWrapper >
        <Card bordered={false}>
        <Form >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="模板编号">
            {form.getFieldDecorator('recipeTemplateNo', {
               rules: [{ required: true, message: '模板编号不可以为空', }],
              initialValue:queryObject?queryObject.recipeTemplateNo:"",
            })(<Input placeholder="请输入疾病名称" disabled={true}/>)}
          </FormItem>

            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="处方类型">
            {form.getFieldDecorator('recipeType', {
              rules: [{ required: true, message: '处方类型不可以为空', }],
              initialValue:queryObject?queryObject.recipeType:"",
            })(
                    <Select disabled={true} placeholder="请选择" style={{ width: '100%' }} onChange ={(value) => this.handleRecipeTypeChange(value)} >
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
              initialValue:queryObject?queryObject.disease:"",
            })(<Input placeholder="请输入疾病名称" />)}
          </FormItem>
          
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="科别">
            {form.getFieldDecorator('classfication', {
              initialValue:queryObject?queryObject.classfication:"",
            })(<Input placeholder="请输入科别" />)}
          </FormItem>

          {(selectedMedicines&&selectedMedicines.length>0)?(<Divider style={{ margin: '40px 0 24px' }} />):""} 

           {
             (selectedMedicines&&selectedMedicines.length>0)?(
              <Table columns={columns} dataSource={selectedMedicines}  />
             ):""
           }   

          <Divider style={{ margin: '40px 0 24px' }} />
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={4} offset={8} sm={24}>
              <span className={styles.submitButtons}>
                <Button type="primary" onClick={() => this.handleModalVisible(true)} disabled={!(recipeType)}>
                  添加药品
                </Button>
              </span>
            </Col>
            <Col md={4}  sm={24}>
              <span className={styles.submitButtons}>
                <Button type="primary"  onClick={() => this.handleOK()} disabled={!(recipeType)}>
                  提交表单
                </Button>
              </span>
            </Col>
            <Col md={4} offset={4} sm={24}>
              <span className={styles.submitButtons}>
                <Button type="primary"  onClick={() => this.handleBack()} >
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
      </PageHeaderWrapper>
    );
  }
}

export default TemplateAdd;
