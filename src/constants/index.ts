/**
 * @author Mikufans
 * 全局常量
 */

/**
 * 项目logo与背景
 */
import logo from '/logo.svg';



export const LOGO = logo;

/**
 * 图表类型
 */
export const CHART_TYPE = [
  { value: '折线图', label: '折线图' },
  { value: '柱状图', label: '柱状图' },
  { value: '饼图', label: '饼图' },
  { value: '雷达图', label: '雷达图' },
  { value: '散点图', label: '散点图' },
  { value: 'K线图', label: 'K线图' },
  { value: '漏斗图', label: '漏斗图' },
]

/**
 * 默认头像
 */
export const DEFAULT_AVATAR = '';

/**
 * 选择头像
 */
export const SELECT_AVATAR = [
  {
    value: '',
    label: '头像1'
  }
]

/**
 * 用户权限
 */
export const USER_ROLE = [
  { value: 'user', label: '普通用户'},
  { value: 'admin', label: '管理员'},
  { value: 'ban', label: '封号'},
]

