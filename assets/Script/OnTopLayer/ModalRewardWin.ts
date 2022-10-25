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
} from "cc";
import { RewardModel } from "../Schema/data.schemas";
import { ModalController } from "./ModalController";
const { ccclass, property } = _decorator;

@ccclass("ModalRewardWin")
export class ModalRewardWin extends ModalController {
  @property(Node)
  imageVoucher: Node | null = null;

  @property(Node)
  buttonOK: Node | null = null;

  @property(Label)
  title: Label | null = null;

  @property(Label)
  desc: Label | null = null;

  showReward(reward: RewardModel) {
    this.title.string = reward.name;

    const image = this.imageVoucher;
    assetManager.loadRemote<ImageAsset>(
      reward.image,
      function (err, imageAsset) {
        console.log(err);
        const spriteFrame = new SpriteFrame();
        const texture = new Texture2D();
        texture.image = imageAsset;
        spriteFrame.texture = texture;
        image.getComponent(Sprite).spriteFrame = spriteFrame;
      }
    );
    this.desc.string = reward.desc;
    this.show();
  }
}
