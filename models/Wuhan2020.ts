/**
 * WuHan-2020 新冠救援信息平台 — 归档数据模型
 *
 * 数据来源：https://github.com/nicedoc/wuhan2020
 * 最后更新时间：2020 年春季
 */

export type RescueCategory =
  | 'hospital'
  | 'hotel'
  | 'logistics'
  | 'factory'
  | 'donation'
  | 'consulting';

export interface RescueRecord {
  id: string;
  category: RescueCategory;
  name: string;
  city: string;
  province: string;
  address?: string;
  phone?: string;
  description: string;
  url?: string;
  verified?: boolean;
  /** ISO date string */
  createdAt?: string;
}

export interface RescueCategoryMeta {
  key: RescueCategory;
  icon: string;
  count: number;
}

// ─── Sample archival data (historical snapshot from early 2020) ───────────────

export const rescueRecords: RescueRecord[] = [
  // ── 定点医院 ──
  {
    id: 'h1',
    category: 'hospital',
    name: '武汉市金银潭医院',
    city: '武汉市',
    province: '湖北省',
    address: '武汉市东西湖区银潭路1号',
    phone: '027-85509106',
    description: '武汉市传染病定点收治医院，最早收治新冠肺炎患者的医院之一。',
    verified: true,
    createdAt: '2020-01-20',
  },
  {
    id: 'h2',
    category: 'hospital',
    name: '火神山医院',
    city: '武汉市',
    province: '湖北省',
    address: '武汉市蔡甸区知音湖大道',
    description: '参照北京小汤山医院模式建设的专门医院，2020年2月2日建成投入使用，设置床位1000张。',
    verified: true,
    createdAt: '2020-02-02',
  },
  {
    id: 'h3',
    category: 'hospital',
    name: '雷神山医院',
    city: '武汉市',
    province: '湖北省',
    address: '武汉市江夏区黄家湖畔',
    description: '参照火神山医院模式建设，2020年2月8日投入使用，设置床位1600张。',
    verified: true,
    createdAt: '2020-02-08',
  },
  {
    id: 'h4',
    category: 'hospital',
    name: '武汉大学中南医院',
    city: '武汉市',
    province: '湖北省',
    address: '武汉市武昌区东湖路169号',
    phone: '027-67812888',
    description: '大型综合性三甲医院，承担新冠肺炎重症患者救治任务。',
    verified: true,
    createdAt: '2020-01-22',
  },
  {
    id: 'h5',
    category: 'hospital',
    name: '武汉市中心医院',
    city: '武汉市',
    province: '湖北省',
    address: '武汉市江岸区胜利街26号',
    phone: '027-82811080',
    description: '新冠肺炎定点收治医院，该院医生李文亮在疫情初期发出预警。',
    verified: true,
    createdAt: '2020-01-21',
  },

  // ── 酒店住宿 ──
  {
    id: 'o1',
    category: 'hotel',
    name: '武汉洲际酒店',
    city: '武汉市',
    province: '湖北省',
    address: '武汉市汉阳区晴川大道666号',
    phone: '027-84888888',
    description: '免费为医疗救援人员提供住宿。',
    verified: true,
    createdAt: '2020-01-26',
  },
  {
    id: 'o2',
    category: 'hotel',
    name: '武汉光谷希尔顿酒店',
    city: '武汉市',
    province: '湖北省',
    address: '武汉市东湖新技术开发区花山生态新城',
    phone: '027-59338888',
    description: '为赴鄂医疗队提供免费住宿服务。',
    verified: true,
    createdAt: '2020-01-28',
  },
  {
    id: 'o3',
    category: 'hotel',
    name: '如家酒店（武汉多家门店）',
    city: '武汉市',
    province: '湖北省',
    description: '全国3000余家如家酒店为医护人员提供免费住宿。',
    verified: true,
    createdAt: '2020-01-27',
  },
  {
    id: 'o4',
    category: 'hotel',
    name: '汉庭酒店武汉区域门店',
    city: '武汉市',
    province: '湖北省',
    description: '武汉地区所有汉庭酒店为医疗人员提供免费入住。',
    verified: true,
    createdAt: '2020-01-27',
  },

  // ── 物流运输 ──
  {
    id: 'l1',
    category: 'logistics',
    name: '顺丰速运',
    city: '全国',
    province: '全国',
    description: '开通全国至武汉救援物资免费运输绿色通道，不限运输次数。',
    url: 'https://www.sf-express.com',
    verified: true,
    createdAt: '2020-01-25',
  },
  {
    id: 'l2',
    category: 'logistics',
    name: '京东物流',
    city: '全国',
    province: '全国',
    description: '向武汉地区捐赠大量医疗物资，并开通绿色通道免费承运救援物资。',
    url: 'https://www.jdl.com',
    verified: true,
    createdAt: '2020-01-25',
  },
  {
    id: 'l3',
    category: 'logistics',
    name: '中通快递',
    city: '全国',
    province: '全国',
    description: '开通全国至武汉的绿色通道，免费运输救援物资。',
    verified: true,
    createdAt: '2020-01-27',
  },
  {
    id: 'l4',
    category: 'logistics',
    name: '菜鸟网络',
    city: '全国',
    province: '全国',
    description: '联合全球物流合作伙伴开通绿色通道，免费将救援物资运抵武汉。',
    verified: true,
    createdAt: '2020-01-25',
  },
  {
    id: 'l5',
    category: 'logistics',
    name: '满帮集团',
    city: '全国',
    province: '全国',
    description: '开通免费运输通道，组织运力支援武汉物资运输。',
    verified: true,
    createdAt: '2020-01-28',
  },

  // ── 物资生产工厂 ──
  {
    id: 'f1',
    category: 'factory',
    name: '稳健医疗',
    city: '武汉',
    province: '湖北省',
    description: '全力生产口罩、防护服等医疗防护物资，春节期间不停工。',
    verified: true,
    createdAt: '2020-01-23',
  },
  {
    id: 'f2',
    category: 'factory',
    name: '3M 中国',
    city: '上海',
    province: '上海市',
    description: '加大口罩生产力度，全力保障防疫物资供应。',
    verified: true,
    createdAt: '2020-01-24',
  },
  {
    id: 'f3',
    category: 'factory',
    name: '振德医疗',
    city: '绍兴',
    province: '浙江省',
    description: '紧急调配医疗物资，全力生产口罩和医用敷料供应疫区。',
    verified: true,
    createdAt: '2020-01-24',
  },

  // ── 捐赠信息 ──
  {
    id: 'd1',
    category: 'donation',
    name: '武汉市红十字会',
    city: '武汉市',
    province: '湖北省',
    address: '武汉市江岸区胜利街1号',
    phone: '027-82785900',
    description: '接受社会各界捐赠的疫情防控物资和资金。',
    verified: true,
    createdAt: '2020-01-23',
  },
  {
    id: 'd2',
    category: 'donation',
    name: '湖北省慈善总会',
    city: '武汉市',
    province: '湖北省',
    phone: '027-87433333',
    description: '接受社会捐赠，用于湖北省新冠肺炎疫情防控工作。',
    verified: true,
    createdAt: '2020-01-24',
  },
  {
    id: 'd3',
    category: 'donation',
    name: '韩红爱心慈善基金会',
    city: '北京',
    province: '北京市',
    description: '通过韩红爱心慈善基金会进行定向捐赠，支援武汉医疗物资。',
    url: 'https://www.hhax.org',
    verified: true,
    createdAt: '2020-01-25',
  },

  // ── 免费咨询 ──
  {
    id: 'c1',
    category: 'consulting',
    name: '丁香医生在线问诊',
    city: '全国',
    province: '全国',
    description: '提供免费在线问诊服务，7x24小时医生在线咨询。',
    url: 'https://dxy.com',
    verified: true,
    createdAt: '2020-01-24',
  },
  {
    id: 'c2',
    category: 'consulting',
    name: '阿里健康在线义诊',
    city: '全国',
    province: '全国',
    description: '在支付宝上线在线义诊服务，提供免费医生问诊。',
    url: 'https://www.alihealth.cn',
    verified: true,
    createdAt: '2020-01-24',
  },
  {
    id: 'c3',
    category: 'consulting',
    name: '微医互联网总医院',
    city: '全国',
    province: '全国',
    description: '提供免费在线义诊服务，汇集全国2万余名医生。',
    url: 'https://www.guahao.com',
    verified: true,
    createdAt: '2020-01-23',
  },
];

export const categoryMeta: RescueCategoryMeta[] = [
  { key: 'hospital', icon: '🏥', count: 5 },
  { key: 'hotel', icon: '🏨', count: 4 },
  { key: 'logistics', icon: '🚚', count: 5 },
  { key: 'factory', icon: '🏭', count: 3 },
  { key: 'donation', icon: '💝', count: 3 },
  { key: 'consulting', icon: '🩺', count: 3 },
];

export const categoryLabelMap: Record<RescueCategory, string> = {
  hospital: 'hospital',
  hotel: 'hotel',
  logistics: 'logistics',
  factory: 'factory',
  donation: 'donation',
  consulting: 'consulting',
};

/** Get records filtered by category (or all if omitted) */
export function getRecords(category?: RescueCategory) {
  return category ? rescueRecords.filter(r => r.category === category) : rescueRecords;
}

/** Get unique provinces from records */
export function getProvinces() {
  return [...new Set(rescueRecords.map(r => r.province))].sort();
}

/** Get stats per category */
export function getCategoryStats() {
  return categoryMeta.map(meta => ({
    ...meta,
    count: rescueRecords.filter(r => r.category === meta.key).length,
  }));
}
