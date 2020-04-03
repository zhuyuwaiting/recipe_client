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

import styles from './WesternMedicine.less';

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
      style={{ top: 0 }}
      width={700}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="药品名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '药品名称不可以为空', }],
        })(<Input placeholder="请输入药品名称" />)}
      </FormItem>

       <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="英文名称">
        {form.getFieldDecorator('englishName', {

        })(<Input placeholder="请输入英文名称" />)}
      </FormItem>
      
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="基础重量">
        {form.getFieldDecorator('cellWeight', {
          rules: [{ required: true, message: '药品基础重量不可以为空', }],
        })(<InputNumber placeholder="基础重量(0.3g*12/盒中的0.3)" precision='2' style={{ width: '100%' }}/>)}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="药品组成单位">
        {form.getFieldDecorator('cellUnit', {
          rules: [{ required: true, message: '药品基础单位不可以为空', }],
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
        })(<InputNumber placeholder="药品1单位的基础单位数量(0.3g*12/盒中的12)" precision='0' style={{ width: '100%' }}/>)}
      </FormItem>

    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="药品单位">
        {form.getFieldDecorator('unit', {
          rules: [{ required: true, message: '药品单位不可以为空', }],
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
        })(<InputNumber placeholder="每日剂量" precision='2' style={{ width: '100%' }}/>)}
      </FormItem>

       {/* <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="每日次数">
        {form.getFieldDecorator('dailyTimes', {
          rules: [{ required: true, message: '每日次数不可以为空', }],
        })(<InputNumber placeholder="每日次数" precision='0' style={{ width: '100%' }}/>)}
      </FormItem> */}

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用药频次">
        {form.getFieldDecorator('frequency', {
          rules: [{ required: true, message: '用药频次不可以为空', }],
        })(
          <Select placeholder="请选择" style={{ width: '100%' }}>
            {(enumInfos&&enumInfos['MEDICINE_FREQUENCY'])?
            enumInfos['MEDICINE_FREQUENCY'].map(function(k) {
              return <Option value={k.value}>{k.name}</Option>
            }):"" }
          </Select>
        )}
      </FormItem>

     <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="服用方式">
        {form.getFieldDecorator('takingWay', {
          rules: [{ required: true, message: '服用方式不可以为空', }],
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

       {/* <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="每日次数">
        {form.getFieldDecorator('dailyTimes', {
          rules: [{ required: true, message: '每日次数不可以为空', }],
          initialValue:updateRow?updateRow.dailyTimes:"",
        })(<InputNumber placeholder="每日次数" precision='0' style={{ width: '100%' }}/>)}
      </FormItem> */}

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用药频次">
        {form.getFieldDecorator('frequency', {
          rules: [{ required: true, message: '用药频次不可以为空', }],
          initialValue:updateRow?updateRow.frequency:"",
        })(
          <Select placeholder="请选择" style={{ width: '100%' }}>
            {(enumInfos&&enumInfos['MEDICINE_FREQUENCY'])?
            enumInfos['MEDICINE_FREQUENCY'].map(function(k) {
              return <Option value={k.value}>{k.name}</Option>
            }):"" }
          </Select>
        )}
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
@connect(({ westMedicine, loading }) => ({
  westMedicine,
  loading: loading.models.westMedicine,
}))
@Form.create()
class WesternMedicine extends PureComponent {
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
      title: '用药频次',
      dataIndex: 'frequencyInfo',
      render(val,row) {
        return val?val.name:"";
      },
    },
    {
      title: '服用方式',
      dataIndex: 'takingWayInfo',
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
      type: 'westMedicine/fetch',
      payload:{
        type:"WESTERN_MEDICINE",
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
      type:"WESTERN_MEDICINE",
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'westMedicine/fetch',
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
      type: 'westMedicine/fetch',
      payload: {
        type:"WESTERN_MEDICINE",
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
          type: 'westMedicine/remove',
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
        type:"WESTERN_MEDICINE",
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'westMedicine/fetch',
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
      type: 'westMedicine/add',
      payload: {
        ...fields,
        type:'WESTERN_MEDICINE',
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
      type: 'westMedicine/update',
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
      type: 'westMedicine/remove',
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
      type: 'westMedicine/batchRemove',
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
      westMedicine: { list,pagination,enumInfos },
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

export default WesternMedicine;
