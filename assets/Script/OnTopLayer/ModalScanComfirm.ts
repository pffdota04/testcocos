import {
  _decorator,
  Component,
  Node,
  Label,
  ImageAsset,
  assetManager,
  SpriteFrame,
  Texture2D,
  Sprite,
  Animation,
  AnimationState,
} from "cc";
import { GameController } from "../GameController";
import { ScanController } from "../ScanController";
import { RewardModel, UserModal } from "../Schema/data.schemas";
import { ModalController } from "./ModalController";
const { ccclass, property } = _decorator;

@ccclass("ModalScanComfirm")
export class ModalScanComfirm extends ModalController {
  @property(Label)
  phone: Label | null = null;

  @property(Node)
  scanPage: Node | null = null;

  onLoad() {}

  showConfirm(user: UserModal) {
    this.phone.string = user.phone;
    this.show();
  }

  confirm() {
    this.scanPage.getComponent(ScanController).hideScanScreen();
    this.hide();
  }
}
