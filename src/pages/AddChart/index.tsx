import { genChartByAiUsingPOST } from '@/services/MKbi/chartController';
import { UploadOutlined } from '@ant-design/icons';
import {Button, Card, Col, Divider, Empty, Form, message, Row, Select, Space, Upload} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React,{ useState } from 'react';
import ReactECharts from 'echarts-for-react';
import {Spin} from "antd/lib";



/**
 * 添加图表页面
 */
const AddChart: React.FC = () => {
  const [chart, setChart] = useState<API.BiResponse>();
  const [option, setOption] = useState<any>();
  const [submitting,setSubmitting] = useState<boolean>(false)

  /**
   * 提交
   * @param values
   */
  const onFinish = async (values: any) => {

    if (submitting){//避免反复提交
      return;
    }
    setSubmitting(true);
    //提交后清空上次数据
    setChart(undefined);
    setOption(undefined);
    // todo 对接后端，上传数据
    const params = {
      ...values,
      file: undefined,
    };
    try {
      const res = await genChartByAiUsingPOST(params, {}, values.file.file.originFileObj);
      if (!res?.data){
        message.error('分析失败');
      }else {
        message.success('分析成功');
        const chartOption = JSON.parse(res.data.genChart ?? '');
        if (!chartOption){
          throw new Error('图表代码解析错误')
        }else {
          setChart(res.data);
          setOption(chartOption);
        }
      }
    } catch (e: any) {
      message.error('分析失败. ' + e.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="add-chart">
      {/*表单中的name要对应后端接口请求参数的字段*/}
      <Row gutter={24}>
        <Col span={12}>
          <Card title="智能分析">
            <Form name="addChart" labelAlign="right" labelCol={{ span: 5 }}
                  wrapperCol={{ span: 18 }} onFinish={onFinish} initialValues={{}}>
              {/*多行输入*/}
              <Form.Item
                name="goal"
                label="分析目标"
                rules={[{ required: true, message: '请输入分析目标' }]}
              >
                <TextArea placeholder="请输入你的分析需求。比如：分析网站用户的增长情况" />
              </Form.Item>
              <Form.Item name="name" label="图表名称">
                <TextArea placeholder="请输入图表名称" />
              </Form.Item>
              <Form.Item
                name="chartType"
                label="图表类型"
                hasFeedback
                rules={[{ required: true, message: 'Please select your country!' }]}
              >
                {/*下拉选择框*/}
                <Select
                  options={[
                    { value: '折线图', label: '折线图' },
                    { value: '柱状图', label: '柱状图' },
                    { value: '饼图', label: '饼图' },
                    { value: '雷达图', label: '雷达图' },
                    { value: '散点图', label: '散点图' },
                    { value: 'K线图', label: 'K线图' },
                    { value: '漏斗图', label: '漏斗图' },
                  ]}
                />
              </Form.Item>
              <Form.Item name="file" label="原始数据">
                <Upload name="file" maxCount={1}>
                  <Button icon={<UploadOutlined />}>上传 XLSX 文件</Button>
                </Upload>
              </Form.Item>

              <Form.Item wrapperCol={{ span: 18, offset: 5 }}>
                <Space>
                  <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
                    提交
                  </Button>
                  <Button htmlType="reset">重置</Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="分析结论">
            {chart?.genResult ?? <Empty />}
            <Spin spinning={submitting}/>{/*显示加载动画*/}
          </Card>
          <Divider/>
          <Card title="生成图表">
            {
              option ? <ReactECharts option={option} /> : <Empty />
            }
            <Spin spinning={submitting}/>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default AddChart;
