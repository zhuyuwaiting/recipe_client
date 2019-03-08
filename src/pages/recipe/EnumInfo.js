import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import {
  Table, Badge, Menu, Dropdown, Icon,
  Form,
  Card,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './EnumInfo.less';


/* eslint react/no-multi-comp:0 */
@connect(({ enumInfo, loading }) => ({
  enumInfo,
  loading: loading.models.enumInfo,
}))
@Form.create()
class EnumInfo extends PureComponent {
  state = {
    
  };

  

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
    var subList = enumInfo.enumInfo;

    const expandedRowRender = (value) => {
   
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
          title: 'Action',
          dataIndex: 'operation',
          key: 'operation',
          render: () => (
            <span className="table-operation">
              <a href="javascript:;">删除</a>
            </span>
          ),
        },
      ];
      return (
        <Table
          columns={columns}
          dataSource={data}
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
    ];
  
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
          />
        </Card>
      </PageHeaderWrapper>
      
    );


  }
}

export default EnumInfo;
