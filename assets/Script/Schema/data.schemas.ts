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

export interface RewardModel {
  name: string;
  type: string;
  desc: string;
  image: string;
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
