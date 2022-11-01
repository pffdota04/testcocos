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
import { UserModal, WHEEL_MODAL } from "./Schema/data.schemas";
import Colyseus from "./colyseus.js";
import { CS_EVENTS, eventTarget } from "./Event/EventManager";
import { ModalError } from "./OnTopLayer/ModalError";
let client = new Colyseus.Client("ws://localhost:3000");

const { ccclass, property } = _decorator;

@ccclass("ScanController")
export class ScanController extends Component {
  @property({ type: Sprite })
  qr: Sprite | null = null;

  @property({ type: Label })
  wheelName: Label | null = null;

  // @property({ type: Node })
  // logoBrand: Node | null = null;

  @property({ type: Node })
  modalScan: Node | null = null;

  @property({ type: Node })
  modalError: Node | null = null;

  @property({ type: Node })
  UI: Node | null = null;

  @property(Node)
  gamePlay: Node | null = null;

  @property(Sprite)
  wheelImage: Sprite | null = null;

  @property(Node)
  tnc: Node | null = null;

  spriteFrameBrandLogo: SpriteFrame = new SpriteFrame();
  colyseusRoom: any;
  scanUser: UserModal;
  scanWheel: WHEEL_MODAL;
  token: string;

  onLoad() {
    const anim = this.UI.getComponent(Animation);
    anim.on(
      Animation.EventType.FINISHED,
      (type: Animation.EventType, state: AnimationState) => {
        if (state.name === "moveDown" && type == "finished") {
          this.goGame();
          this.qr.getComponent(Animation).play("zoomOut");
        }
      }
    );
  }

  async start() {
    eventTarget.emit(CS_EVENTS.Waiting, true);
    this.main();

    // this.wheelName.string = dummy_wheel_2.displayWheelName;
    // let remoteUrl = dummy_wheel_2.wheelImageUrl;
    // const that = this;
    // assetManager.loadRemote<ImageAsset>(remoteUrl, function (err, imageAsset) {
    //   const texture = new Texture2D();
    //   texture.image = imageAsset;
    //   const sf = new SpriteFrame();
    //   sf.texture = texture;
    //   that.wheelImage.spriteFrame = sf;
    // });
  }

  async main() {
    const wid = this.__parseWwheelIdFromURL();
    const token = this.__parseTokenFromURL();
    if (wid && token) {
      this.coly(token, wid);
    }
  }

  __parseWwheelIdFromURL(): string {
    let search = window.location.search;
    if (search.length > 0) {
      let urlParams = new URLSearchParams(search);
      return urlParams.get("wid");
    }
    return null;
  }

  __parseTokenFromURL(): string {
    let search = window.location.search;
    if (search.length > 0) {
      let urlParams = new URLSearchParams(search);
      return urlParams.get("utoken");
    }
    return null;
  }

  coly = async (token: string, wid: string) => {
    try {
      this.colyseusRoom = await client.joinOrCreate("wheelRoom", {
        mess: "xin chao server, toi den tu cocos",
      });
      this.colyseusRoom.send("check", {
        wid: wid,
        token: token,
        rid: this.colyseusRoom.id,
        sid: this.colyseusRoom.sessionId,
      });
      console.log(this.colyseusRoom);

      const that = this;
      this.colyseusRoom.onMessage("check-result", (message) => {
        console.log(message);
        if (message.status.success) {
          const that = this;
          // ------------ QR
          const img = new Image();
          img.src = message.qrUrl;
          const tex = new Texture2D();
          img.onload = function () {
            tex.reset({
              width: img.width,
              height: img.height,
            });
            tex.uploadData(img, 0, 0);
            tex.loaded = true;
            const sp = new SpriteFrame();
            sp.texture = tex;
            that.qr.spriteFrame = sp;
          };

          // -------------  wheel name and img
          this.wheelName.string = message.data.wheel.displayWheelName;
          let remoteUrl = "https://i.imgur.com/cFzkvJv.png";
          assetManager.loadRemote<ImageAsset>(
            remoteUrl,
            function (err, imageAsset) {
              const texture = new Texture2D();
              texture.image = imageAsset;
              const sf = new SpriteFrame();
              sf.texture = texture;
              that.wheelImage.spriteFrame = sf;
            }
          );
        } else {
          let ctr = that.modalError.getComponent(ModalError);
          ctr.showError(message.status.message + "");
        }
      });

      this.colyseusRoom.onMessage("user-scan", (message) => {
        console.log(message);
        this.triggerScan(message.user, message.wheel, message.token);
      });
    } catch (e) {
      console.log(e);
    }
    eventTarget.emit(CS_EVENTS.Waiting, false);
  };

  triggerScan(user: UserModal, wheel: WHEEL_MODAL, token: string) {
    // comfirm user before go game
    let ctr = this.modalScan.getComponent(ModalScanComfirm);
    this.scanUser = user;
    this.scanWheel = wheel;
    this.token = token;
    ctr.showConfirm(user);
  }

  goGame() {
    const ctr = this.gamePlay.getComponent(GameController);
    ctr.showGameScreen(
      this.scanUser,
      this.scanWheel,
      this.spriteFrameBrandLogo,
      this.colyseusRoom,
      this.token,
      this.wheelImage
    );
    this.node.active = false;
    this.gamePlay.active = true;
  }

  goTnC() {
    if (this.tnc) {
      let ctr = this.tnc.getComponent(TnCController);
      if (ctr) {
        ctr.show();
      }
    }
  }

  showThisScreen() {
    // this.bgWheel.getComponent(Animation).play("moveUp");
    this.UI.getComponent(Animation).play("moveUp");
    this.qr.getComponent(Animation).play("zoomIn");
  }

  hideScanScreen() {
    this.UI.getComponent(Animation).play("moveDown");
    // this.bgWheel.getComponent(Animation).play("moveDown");
    this.qr.getComponent(Animation).play("zoomOut");
  }
}
