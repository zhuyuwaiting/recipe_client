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



function info(record) {
  console.log("---",record);
  let medicines = record.recipeDetailVOS.map(recipeDetailVO =>{
    let medicineVO = recipeDetailVO.medicineVO;
    medicineVO.medicineNum = recipeDetailVO.medicineNum;
    return medicineVO;
  });

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
    {
      title: '数量',
      dataIndex: 'medicineNum',
    }
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
      {
        title: '数量',
        dataIndex: 'medicineNum',
      }
    ];
  }
  Modal.info({
    title: '处方模板详情',
    width:800,
    content: (
      <Card bordered={false}>
        <Row>
            <Col span={6} offset={6}>处方编号：</Col>
            <Col span={12}>{record.recipeNo}</Col>
        </Row>
        <Row>
            <Col span={6} offset={6}>处方类型：</Col>
            <Col span={12}>{record.recipeType=='CHINESE'?'中药处方':'西药处方'}</Col>
        </Row>
        <Row>
            <Col span={6} offset={6}>疾病：</Col>
            <Col span={12}>{record.disease}</Col>
        </Row>
        <Row>
            <Col span={6} offset={6}>科室：</Col>
            <Col span={12}>{record.classfication}</Col>
        </Row>
        <Table style={{marginTop:20}} columns={columns} dataSource={medicines} size="middle" />
      </Card>
    ),
    onOk() {},
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
      router.push("/recipe/recipeManage/view/"+record.recipeNo);
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
