import {
  _decorator,
  Component,
  Node,
  Animation,
  AnimationState,
  Label,
  assetManager,
  ImageAsset,
  SpriteFrame,
  Texture2D,
  Sprite,
} from "cc";
import { GameController } from "./GameController";
import { ModalScanComfirm } from "./OnTopLayer/ModalScanComfirm";
import { UserModal } from "./Schema/data.schemas";
const { ccclass, property } = _decorator;

const dummy_wheel = {
  displayName: "Quay vui qua vui luon kaka",
  background:
    "https://png.pngtree.com/thumb_back/fh260/background/20211031/pngtree-abstract-bg-image_914283.png",
  cover:
    "https://png.pngtree.com/thumb_back/fh260/background/20211031/pngtree-abstract-bg-image_914283.png",
  start: new Date("17/12/2022"),
  end: new Date("17/10/2022"),
  logo: "https://cdn.80.lv/api/upload/vendor/462/5d27504cc8981.jpg",
  wheelName: "something",
  giftDesc: [
    {
      name: "5 VUI",
      desc: "Chúc mừng bạn đã nhận được 5 VUI",
      image: "https://i.imgur.com/vELT21k.png",
      type: "point",
    },
    {
      name: "Voucher 50k",
      desc: "Chúc mừng bạn đã nhận Voucher 50k",
      image: "https://i.imgur.com/h3Gcjk3.png",
      type: "voucher",
    },
    {
      name: "10 VUI",
      desc: "Chúc mừn bạn đã nhận được 10 VUI",
      image: "https://i.imgur.com/vELT21k.png",
      type: "point",
    },
    {
      name: "Voucher 30k",
      desc: "Chúc mừng bạn đã nhận Voucher 30k",
      image: "https://i.imgur.com/h3Gcjk3.png",
      type: "voucher",
    },
    {
      name: "100 VUI",
      desc: "Chúc mừn bạn đã nhận được 100 VUI",
      image: "https://i.imgur.com/vELT21k.png",
      type: "point",
    },
    {
      name: "Xém vui",
      desc: "Pun` gh3 lu0n a'",
      image: "https://i.imgur.com/vELT21k.png",
      type: "unlucky",
    },
  ],
};

const user_dummy: UserModal = {
  name: "Luis Vandurad",
  phone: "032123477777",
  spinCount: 7,
};

@ccclass("ScanController")
export class ScanController extends Component {
  @property({ type: Node })
  qr: Node | null = null;

  @property({ type: Label })
  wheelName: Label | null = null;

  @property({ type: Node })
  logoBrand: Node | null = null;

  @property({ type: Node })
  modalScan: Node | null = null;

  @property({ type: Node })
  bgWheel: Node | null = null;

  @property({ type: Node })
  UI: Node | null = null;

  @property(Node)
  gamePlay: Node | null = null;

  spriteFrameBrandLogo: SpriteFrame = new SpriteFrame();

  onLoad() {
    this.wheelName.string = dummy_wheel.displayName;
    let remoteUrl = dummy_wheel.logo;
    const logoBrand = this.logoBrand;
    const that = this;

    assetManager.loadRemote<ImageAsset>(remoteUrl, function (err, imageAsset) {
      const texture = new Texture2D();
      texture.image = imageAsset;
      that.spriteFrameBrandLogo.texture = texture;
      logoBrand.getComponent(Sprite).spriteFrame = that.spriteFrameBrandLogo;
    });

    const anim = this.bgWheel.getComponent(Animation);
    anim.on(
      Animation.EventType.FINISHED,
      (type: Animation.EventType, state: AnimationState) => {
        if (state.name === "moveDown" && type == "finished") {
          this.goGame();
          this.qr.getComponent(Animation).play("zoomOut");
          that.node.active = false;
          that.gamePlay.active = true;
        }
      }
    );
  }

  triggerScan() {
    // got data from dummy
    let ctr = this.modalScan.getComponent(ModalScanComfirm);
    ctr.showConfirm(user_dummy);
  }

  goGame() {
    const ctr = this.gamePlay.getComponent(GameController);
    ctr.showGameScreen(user_dummy, dummy_wheel, this.spriteFrameBrandLogo);
  }

  showThisScreen() {
    this.bgWheel.getComponent(Animation).play("moveUp");
    this.UI.getComponent(Animation).play("moveUp");
    this.qr.getComponent(Animation).play("zoomIn");
  }

  hideScanScreen() {
    this.UI.getComponent(Animation).play("moveDown");
    this.bgWheel.getComponent(Animation).play("moveDown");
    this.qr.getComponent(Animation).play("zoomOut");
  }
}
