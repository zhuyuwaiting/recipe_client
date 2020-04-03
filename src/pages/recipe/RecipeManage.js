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

import styles from './RecipeManage.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

function print(){

  // const el = document.getElementById("recipeDetail");
  //       const iframe = document.createElement('IFRAME');
  //       let doc = null;
  //       iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:500px;top:500px;');
  //       document.body.appendChild(iframe);
  //       doc = iframe.contentWindow.document;
  //       // 引入打印的专有CSS样式，根据实际修改
  //       doc.write('<LINK rel="stylesheet" type="text/css" href="./RecipeManage.less">');
  //       doc.write(el.innerHTML);
  //       doc.close();
  //       // 获取iframe的焦点，从iframe开始打印
  //       iframe.contentWindow.focus();
  //       iframe.contentWindow.print();
  //       if (navigator.userAgent.indexOf("MSIE") > 0)
  //       {
  //           document.body.removeChild(iframe);
  //       }
  window.document.body.innerHTML = window.document.getElementById('recipeDetail').innerHTML;  
  window.print(); 
  window.location.reload();
}

function info(record) {
  console.log("---",record);
  let medicines = record.recipeDetailVOS.map(recipeDetailVO =>{
    let medicineVO = recipeDetailVO.medicineVO;
    medicineVO.medicineNum = recipeDetailVO.medicineNum;
    return medicineVO;
  });
  //转为两个两个的
  let chineseMedicine =[];
  for(let i=0;i<parseInt((medicines.length+1)/2);i++){
     if(i*2+1>=medicines.length){
      chineseMedicine.push([medicines[i*2]])
    }else{
      chineseMedicine.push([medicines[i*2],medicines[i*2+1]])
     }
  }
  console.log(chineseMedicine);

  Modal.confirm({
    title: '处方详情',
    width:1000,
    okText:"打印",
    onOk() {
      print();
    },
    content: (
      <Card bordered={false} id={"recipeDetail"}>
          <table style={{width:750}} border="1">
              <tr>
                <th>姓名:{record.patientName}</th>
                <th>性别:{record.patientSex==0?'男':'女'}</th>
                <th>年龄:{record.patientAge}</th>
                <th>处方类别:{record.recipeType=='CHINESE'?'中药处方':'西药处方'}</th>
              </tr>
              <tr>
                <th colSpan="2">临床诊断:{record.disease}</th>
                <th colSpan="2">科别:{record.classfication}</th>
              </tr>
          </table>
          <h2 style={{marginTop:5,marginBottom:5}}>Rp</h2>

          {record.recipeType=='CHINESE'?(<Card bordered={false}>
            {chineseMedicine.map(medicines=>{
                return (
            <Row style={{marginTop:40}}>
                <Col span={3}><Icon type="star" theme="filled" />&nbsp; {medicines[0].name }</Col>
                <Col span={3}>{medicines[0].takingWayInfo.name}</Col>
                <Col span={3}>{medicines[0].medicineNum+' '+medicines[0].unitInfo.name}</Col>
                <Col span={3}> </Col>
                {
                  medicines[1]?(<Col span={3}><Icon type="star" theme="filled" />&nbsp;{medicines[1]?medicines[1].name:"" }</Col>):(
                    <Col span={3}></Col>
                  )
                }
                
                <Col span={3}>{medicines[1]?medicines[1].takingWayInfo.name:""}</Col>
                <Col span={3}>{medicines[1]?(medicines[1].medicineNum+" "+medicines[1].unitInfo.name):''}</Col>
            </Row>
                );
              })}
          </Card>):(<Card bordered={false}>
            {medicines.map(medicine=>{
                return (
            <Row style={{marginTop:40}}>
                <Col span={8}>{medicine.name }</Col>
                <Col span={8}>{(medicine.cellWeight/100).toFixed(2)+''+(medicine.cellUnitInfo?medicine.cellUnitInfo.name:'')
          +'*'+medicine.cellNum+'/'+medicine.unitInfo.name }</Col>
                <Col span={8}>{medicine.medicineNum+"  "+ medicine.unitInfo.name}</Col>
                <Col span={8}>{"每次剂量： "+(medicine.eachDose/100).toFixed(2)+medicine.cellUnitInfo.name}</Col>
                <Col span={8}>{medicine.takingWayInfo.name}</Col>
                <Col span={8}>{medicine.frequencyInfo.name}</Col>
            </Row>
                );
              })}
           
            
          </Card>)}
          <Row style={{marginTop:40}}>
            {record.recipeType=='CHINESE'?(<Col span={12}>付数： <strong style={{fontSize:20}}>{record.num}</strong>&nbsp;付</Col>):(
              <Col span={12}></Col>
            )}
            {/* <Col span={8} offset={4}>总金额：&nbsp;&nbsp;&nbsp; <strong style={{fontSize:20}}>{record.num}</strong></Col> */}
            </Row>
      </Card>
    ),
    
  });
}




/* eslint react/no-multi-comp:0 */
@connect(({ recipe, loading }) => ({
  recipe,
  loading: loading.models.recipe,
}))
@Form.create()
class RecipeManage extends PureComponent {
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
      dataIndex: 'recipeNo',
    },
    {
      title: '姓名',
      dataIndex: 'patientName',
    },
    {
      title: '性别',
      dataIndex: 'patientSex',
      render(val,row){
        if(val =='0'){
          return '男'
        }
        return '女';
      }
    },
    {
      title: '年龄',
      dataIndex: 'patientAge',
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
          <a onClick={() => this.handleView(true,record,index)}>查看</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleUpdate(true,record,index)}>修改</a>
          <Divider type="vertical" />
          <a onClick={
            () =>
            (Modal.confirm({
              title: '删除处方',
              content: '确定删除该处方数据吗？',
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
      type: 'recipe/fetch',
      payload:{
      }
    });
  }

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      
    });
  };


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
      type: 'recipe/fetch',
      payload: params,
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
      type: 'recipe/fetch',
      payload: {
      },
    });
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
        type: 'recipe/fetch',
        payload: values,
      });
    });
  };

  handleAdd = () => {
    router.push("/recipe/recipeManage/edit/add/null")
  };

  handleDelete = (row,index) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'recipe/remove',
      payload: {
        recipeNos:[row.recipeNo],
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
      type: 'recipe/batchRemove',
      payload: {
        recipeNos:rows.map((row)=>row.recipeNo),
      },
      callback: (success) =>{
        this.setState({
          selectedRows: [],
        });
      }
    });
  };

  handleUpdate = (flag,record) => {
    router.push(`/recipe/recipeManage/edit/update/${record.recipeNo}`);
    // router.push("/recipe//update?recipeNo="+record.recipeNo)
  };


  handleView = (flag,record) =>{
    console.log(record);
    const { dispatch } = this.props;
    dispatch({
      type: 'recipe/query',
      payload: {
        recipeNo:record.recipeNo,
      },
      callback: (success,response) =>{
       info(response.recipeInfoVO);
      }
    });
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
            <FormItem label="病人姓名">
              {getFieldDecorator('patientName')(<Input placeholder="请输入" />)}
            </FormItem>
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
            <FormItem label="疾病名称">
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
    } = this.props;
    let data = {
      list:list,
      pagination:pagination
    }
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues,updateRow } = this.state;
    const parentMethods = {
      handleModalVisible: this.handleModalVisible,
    };
 
    return (
      <PageHeaderWrapper >
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button onClick={
                    () =>
                    (Modal.confirm({
                      title: '删除药品',
                      content: '确定删除这些模板吗？',
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
      </PageHeaderWrapper>
    );
  }
}

export default RecipeManage;
