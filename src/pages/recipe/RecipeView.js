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




/* eslint react/no-multi-comp:0 */
@connect(({ recipe, loading,medicine,recipeTemplate }) => ({
  recipe,
  loading: loading.models.recipe,
}))
@Form.create()
class RecipeEdit extends PureComponent {
  state = {
    updateRecipe:{},
  };

 
  componentDidMount() {
    const { dispatch } = this.props;
    let recipeNo = this.props.match.params.recipeNo;
    dispatch({
      type: 'recipe/query',
      payload:{
        recipeNo:recipeNo
      },
      callback:(success,response)=>{
          if(success){
            this.setState({
              updateRecipe:response.recipeInfoVO,
            });
          }
      }
    });
  }


  getColumns = (recipeType) =>{
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
          return val?val.name:row.takingWay;
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
            <FormItem label="处方编号">
              {getFieldDecorator('recipeNo')(<Input placeholder="请输入" />)}
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
    columns.pop();
    columns.push(
      {
        title: '数量',
        dataIndex: 'medicineNum',
        render(val,row,index) {
          return <InputNumber min={1} max={1000} defaultValue={1} onChange={(val)=>onMedicineNumChange(val,index)} />
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
                initialValue:updateRecipe?updateRecipe.patientAge:"0"
              })(
                      <Select placeholder="请选择" style={{ width: '100%' }} onChange ={(value) => this.handleRecipeTypeChange(value)} >
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

            <Col md={8}  sm={24}>
            <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="科别">
              {form.getFieldDecorator('classfication', {
                initialValue:updateRecipe?updateRecipe.classfication:(selectedTemplate?selectedTemplate.classfication:""),
              })(<Input placeholder="请输入科别" />)}
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
