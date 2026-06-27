import type { School } from '../types/profile'

export const pilotSchools: School[] = [
  {
    id: 'tongji',
    name: '同济大学',
    city: '上海',
    colleges: [
      { id: 'design', name: '设计创意学院' },
      { id: 'architecture', name: '建筑与城市规划学院' },
      { id: 'software', name: '软件学院' },
      { id: 'economics', name: '经济与管理学院' },
      { id: 'music', name: '艺术与传媒学院' },
    ],
  },
  {
    id: 'fudan',
    name: '复旦大学',
    city: '上海',
    colleges: [
      { id: 'computer-science', name: '计算机科学技术学院' },
      { id: 'journalism', name: '新闻学院' },
      { id: 'management', name: '管理学院' },
      { id: 'chinese', name: '中国语言文学系' },
    ],
  },
  {
    id: 'sjtu',
    name: '上海交通大学',
    city: '上海',
    colleges: [
      { id: 'electronic-info', name: '电子信息与电气工程学院' },
      { id: 'media-design', name: '媒体与设计学院' },
      { id: 'foreign-language', name: '外国语学院' },
      { id: 'ant-ai', name: '人工智能学院' },
    ],
  },
]

export const gradeOptions = ['大一', '大二', '大三', '大四', '研一', '研二', '研三', '博士']
