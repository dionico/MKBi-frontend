import { deleteChartUsingPOST, listMyChartByPageUsingPOST } from '@/services/MKbi/chartController';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import {
  Avatar,
  Button,
  Card,
  Col,
  List,
  message,
  Modal,
  Result,
  Row,
  Switch,
  Typography,
} from 'antd';
import Search from 'antd/es/input/Search';

import ReactECharts from 'echarts-for-react';
import moment from 'moment';

import { useEffect, useState } from 'react';

/**
 * 我的图表页面
 */
const MyChartPage: React.FC = () => {
  const { Paragraph, Text } = Typography;
  const [ellipsis, setellipsis] = useState(true);
  //设置初始查询条件
  const initSearchParams = {
    current: 1, //当前页数
    pageSize: 4, //每页展示数量
    sortField: 'createTime',
    sortOrder: 'desc',
  };

  //发送给后端的查询条件
  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({ ...initSearchParams });
  //获取用户状态
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState ?? {};
  /**
   * 分页获取图表
   */
  //存储图表
  const [chartList, setChartList] = useState<API.Chart[]>();
  //数据总数
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * 加载图表数据
   */
  const loadData = async () => {
    setLoading(true);
    try {
      //转为同步执行
      const res = await listMyChartByPageUsingPOST(searchParams);
      if (res.data) {
        setChartList(res.data.records ?? []);
        setTotal(res.data.total ?? 0);
        // 隐藏图表的 title
        if (res.data.records) {
          res.data.records.forEach((data) => {
            if (data.genChart === 'succeed') {
              const chartOption = JSON.parse(data.genChart ?? '{}');
              chartOption.title = undefined;
              data.genChart = JSON.stringify(chartOption);
            }
          });
        }
      } else {
        message.error('获取图表失败');
      }
    } catch (e: any) {
      message.error('获取我的图表失败. ' + e.message);
    }
    setLoading(false);
  };
  //页面初次渲染或者数据发生变化时调用
  useEffect(() => {
    loadData();
  }, [searchParams]);

  /**
   * 删除图表
   */
  const handleDelete = (chartId: any) => {
    Modal.confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: '确定要删除这个表吗',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          const res = await deleteChartUsingPOST({ id: chartId });
          console.log('res:', res.data);
          if (res.data) {
            message.success('删除成功');
            //删除成功后重新加载图表数据
            loadData();
          } else {
            message.error('删除失败');
          }
        } catch (e: any) {
          message.error('删除失败' + e.message);
        }
      },
    });
  };

  return (
    <div className="my-chart-page">
      {/*搜索框*/}
      <div>
        <Search
          placeholder="请输入图表名称"
          enterButton
          loading={loading}
          onSearch={(value) => {
            // 设置搜索条件
            setSearchParams({
              ...initSearchParams,
              name: value,
            });
          }}
        />
      </div>
      <div className="margin-16"></div>
      <List
        grid={{
          gutter: 16,
          // column: 2,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        pagination={{
          /**
           * 设置分页
           * @param page
           * @param pageSize
           */
          showTotal: () => `总数：${total}`,
          showSizeChanger: true,
          showQuickJumper: true,
          //设置每一页的图表数量
          pageSizeOptions: ['6', '10', '20'],
          onChange: (page, pageSize) => {
            //切换分页时，将页数调整为当前页数
            setSearchParams({
              ...searchParams,
              current: page,
              pageSize,
            });
          },
          current: searchParams.current,
          pageSize: searchParams.pageSize,
          total,
        }}
        dataSource={chartList}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <Card style={{ width: '100%' }}>
              <List.Item.Meta
                avatar={<Avatar src={currentUser && currentUser.userAvatar} />}
                title={item.name}
                description={item.chartType ? '图表类型：' + item.chartType : '图表类型：未选择'}
              />

              <>
                {item.status === 'wait' && (
                  <>
                    <Result
                      status="warning"
                      title="图表待生成"
                      subTitle={item.execMessage ?? '当前生成队列繁忙，请耐心等候'}
                    />
                  </>
                )}
                {item.status === 'running' && (
                  <>
                    <Result status="info" title="图表生成中" subTitle={item.execMessage} />
                  </>
                )}
                {item.status === 'succeed' && (
                  <>
                    <div className="margin-16"></div>
                    <div>{'分析目标：' + item.goal}</div>
                    <p>{'创建时间：' + moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')}</p>
                    {/*图表*/}
                    <ReactECharts option={item.genChart && JSON.parse(item.genChart)} />
                    {/*结论*/}
                    <Switch
                      checked={ellipsis}
                      onChange={() => {
                        setellipsis(!ellipsis);
                      }}
                    />
                    <Paragraph
                      ellipsis={ellipsis ? { rows: 2, expandable: true, symbol: '更多' } : false}
                    >
                      {item.genResult}
                    </Paragraph>
                  </>
                )}
                {item.status === 'failed' && (
                  <>
                    <Result status="error" title="图表生成失败" subTitle={item.execMessage} />
                  </>
                )}
              </>
              <Row>
                <Col push={10}>
                  {/*<Link to={``}><span>查看原始数据</span></Link>*/}
                  <Button>查看原始数据</Button>
                </Col>
                <Col push={10}>
                  <Button onClick={() => handleDelete(item.id)}>删除</Button>
                </Col>
              </Row>
            </Card>
          </List.Item>
        )}
      />
      <br />
    </div>
  );
};
export default MyChartPage;
