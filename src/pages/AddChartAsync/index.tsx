import { genChartByAiAsyncUsingPOST} from '@/services/MKbi/chartController';
import { UploadOutlined } from '@ant-design/icons';
import {Button, Card, Form, message, Select, Space, Upload} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React,{ useState } from 'react';
import {ProForm} from "@ant-design/pro-form";
import useForm = ProForm.useForm;



/**
 * 添加图表（异步）页面
 */
const AddChartAsync: React.FC = () => {
  const [submitting,setSubmitting] = useState<boolean>(false)
  const [form] = useForm()

  /**
   * 提交
   * @param values
   */
  const onFinish = async (values: any) => {
    if (submitting){//避免反复提交
      return;
    }
    setSubmitting(true);
    //  对接后端，上传数据
    const params = {
      ...values,
      file: undefined,
    };
    try {
      const res = await genChartByAiAsyncUsingPOST(params, {}, values.file.file.originFileObj);
      // const res = await genChartByAiAsyncMqUsingPOST(params, {}, values.file.file.originFileObj);
      if (!res?.data){
        message.error('分析失败');
      }else {
        message.success('提交成功，稍后请在我的图表页面查看吧');
        form.resetFields();
      }
    } catch (e: any) {
      message.error('分析失败. ' + e.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="add-chart-async">
      {/*表单中的name要对应后端接口请求参数的字段*/}
          <Card title="智能分析（异步）">
            <Form form={form} name="addChart" labelAlign="right" labelCol={{ span: 5 }}
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
    </div>
  );
};
export default AddChartAsync;
