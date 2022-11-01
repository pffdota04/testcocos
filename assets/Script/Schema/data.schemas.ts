import { _decorator } from "cc";
const { ccclass, property } = _decorator;

export enum SOUND {
  WIN = "win",
  LOSE = "lose",
  TICK = "tick",
}

export enum REWARD_TYPE {
  UNLUCKY = "unlucky",
  POINT = "point",
  BC_POINT = "bc_point",
  VOUCHER = "voucher",
}

export interface REWARD_MODEL {
  giftId: string;
  name: string;
  type: string;
  logoUrl: string;
  label: string;
  rate: number;
  quantity: number;
  unitPoint: number;
  offerId: any;
  brandCurrencyId: any;
  brandCurrencyPoint: any;
  triggerData: any;
  isDefaultForNewUser: number;
  used: number;
  index: number;
}

export interface RewardModel {
  name: string;
  type: string;
  desc: string;
  image: string;
}

export interface GIFT_DES_MODEL {
  name: string;
  logoUrl: string;
  _id: string;
}

export interface UserModal {
  name: string;
  phone: string;
  spinCount: number;
}

export interface WheelModal {
  wheelName: string;
  displayName: string;
  start: Date;
  end: Date;
  background: string;
  cover: string;
  logo: string;
  giftDesc: RewardModel[];
}

export interface WHEEL_MODAL {
  wheelImageUrl: string;
  _id: string;
  wheelName: string;
  state: string;
  type: string;
  hidden: string;
  startDate: string;
  endDate: string;
  teaserDate: string;
  brandCode: string;
  storeCode: string;
  displayWheelName: string;
  coverImageUrl: string;
  thumbnailImageUrl: string;
  logoUrl: string;
  backgroundColor: string;
  textColor: string;
  defaultNumberOfSpins: number;
  maxSpins: number;
  purchaseByVUIPoint: number;
  tncLink: string;
  giftDescriptions: GIFT_DES_MODEL[];
  giftDetails: REWARD_MODEL[];
  createdAt: string;
  updatedAt: string;
}
