import {
  _decorator,
  Component,
  Node,
  tween,
  Label,
  Sprite,
  assetManager,
  ImageAsset,
  SpriteFrame,
  Texture2D,
  Animation,
  AnimationState,
  Button,
  RichText,
  Quat,
  Vec3,
  CircleCollider2D,
} from "cc";
import { CS_EVENTS, eventTarget } from "./Event/EventManager";
import { ModalRewardWin } from "./OnTopLayer/ModalRewardWin";
import { ScanController } from "./ScanController";
import {
  GIFT_DES_MODEL,
  REWARD_MODEL,
  REWARD_TYPE,
  SOUND,
  UserModal,
  WheelModal,
  WHEEL_MODAL,
} from "./Schema/data.schemas";
const { ccclass, property } = _decorator;

const sketUrl = {
  2: "https://i.imgur.com/picGfkj.png",
  3: "https://i.imgur.com/DBFUSk7.png",
  4: "https://i.imgur.com/KyI1YYV.png",
  5: "https://i.imgur.com/lOw0zr5.png",
  6: "https://i.imgur.com/p60fEn7.png",
  7: "https://i.imgur.com/O4idlsx.png",
  8: "https://i.imgur.com/9dpzkqT.png",
  9: "https://i.imgur.com/2W77owG.png",
  10: "https://i.imgur.com/HtmOkYW.png",
  11: "https://i.imgur.com/4CRdLcG.png",
  12: "https://i.imgur.com/KMXTvFj.png",
};

@ccclass("GameController")
export class GameController extends Component {
  @property({ type: Node })
  wheel: Node | null = null;

  @property({ type: Node })
  sket: Node | null = null;

  @property({ type: Node })
  wheelDot: Node | null = null;

  @property({ type: Node })
  modalResult: Node | null = null;

  @property({ type: Node })
  countSpin: Node | null = null;

  @property({ type: Node })
  userName: Node | null = null;

  @property({ type: Node })
  ModalRewardWin: Node | null = null;

  @property({ type: Node })
  logoBrand: Node | null = null;

  @property({ type: Label })
  wheelName: Label | null = null;

  @property({ type: Node })
  wheelBg: Node | null = null;

  // @property({ type: Node })
  // UI: Node | null = null;

  @property(Node)
  scanPage: Node | null = null;

  @property(Button)
  BtnSpin: Button | null = null;

  userData: UserModal | null = null;
  // wheelData: WheelModal;
  wheelData: WHEEL_MODAL;
  isWheeling: Boolean = false;
  loaded: Boolean = false;
  colyseusRoom: any;
  token: string;
  spinReward = null;

  onLoad() {
    const animWheelUpDown = this.wheelBg.getComponent(Animation);
    animWheelUpDown.on(
      Animation.EventType.FINISHED,
      (type: Animation.EventType, state: AnimationState) => {
        if (state.name === "moveDown" && type == "finished") {
          this.scanPage.active = true;
          this.node.active = false;
          this.scanPage.getComponent(ScanController).showThisScreen();
        }
      }
    );

    // this.colyseusRoom.onMessage("spin-reward", (message) => {
    //   console.log("Ok, got reward ", message);
    //   if (message.status.success) this.spinReward = message;
    //   else alert("Đã xảy ra lỗi");
    //   // apiResult = this.wheelData.giftDesc[this.resultIndex];
    // });
  }

  showGameScreen(
    user: UserModal,
    // wheel: WheelModal,
    wheel: WHEEL_MODAL,
    logoSprite: SpriteFrame,
    colyseusRoom: any,
    token: string,
    wheelImage: Sprite
  ) {
    console.log(colyseusRoom);

    this.colyseusRoom = colyseusRoom;

    this.colyseusRoom.onMessage("spin-reward", (message) => {
      console.log("Ok, got reward ", message);
      if (message.status.success) this.spinReward = message;
      else alert("Đã xảy ra lỗi");
      // apiResult = this.wheelData.giftDesc[this.resultIndex];
    });

    //
    this.wheelBg.getComponent(Animation).play("moveUp");
    this.wheel.angle = 0;
    this.wheel.getComponent(Sprite).spriteFrame = wheelImage.spriteFrame;
    // load one first time
    if (!this.loaded) {
      this.userData = user;
      this.token = token;
      this.wheelData = wheel;
      //
      const that = this;
      assetManager.loadRemote<ImageAsset>(
        sketUrl[wheel.giftDescriptions.length],
        function (err, imageAsset) {
          const texture = new Texture2D();
          texture.image = imageAsset;
          const sf = new SpriteFrame();
          sf.texture = texture;
          that.sket.getComponent(Sprite).spriteFrame = sf;
          that.sket.angle = 180 / wheel.giftDescriptions.length;
        }
      );

      this.countSpin.getComponent(
        RichText
      ).string = `<color=#000000>Bạn còn </color><color=#ff0000><b>${user.spinCount.toString()}</b></color> <color=#000000>lượt quay </color>`;
      user.spinCount.toString();
      this.userName.getComponent(
        RichText
      ).string = `<color=#000000>Xin chào, <b>${user.name}</b></color>`;
      this.wheelName.string = wheel.displayWheelName;

      this.logoBrand.getComponent(Sprite).spriteFrame = logoSprite;

      const deg = 360 / this.wheelData.giftDescriptions.length;
      function toRadians(angle) {
        return angle * (Math.PI / 180);
      }

      for (
        let index = 0;
        index < this.wheelData.giftDescriptions.length;
        index++
      ) {
        // let collider = this.wheelDot.addComponent(CircleCollider2D)!;
        let collider = this.wheel.addComponent(CircleCollider2D)!;
        collider.radius = 10;
        const x = Math.floor(Math.sin(toRadians(deg / 2 + deg * index)) * 390); // 390 là bán kính
        const y = Math.floor(Math.cos(toRadians(deg / 2 + deg * index)) * 390);
        collider.offset.x = x;
        collider.offset.y = y;
        console.log(collider); // 390 là bán kính
      }
      this.loaded = true;
    }
  }

  letSpin() {
    let apiResult = null;

    const user = this.userData;
    let moreAngle = 0;
    const lengthOfItem = this.wheelData.giftDescriptions.length;
    let wheel = this.wheel;
    let wheelDot = this.wheelDot;
    const startAngle = wheel.angle;
    const countSpinLabel = this.countSpin.getComponent(RichText);
    let that = this;

    if (user.spinCount > 0) {
      const openModalResult = (apiResult: REWARD_MODEL) => {
        console.log("apiResult");
        console.log(apiResult);
        let ctr = this.ModalRewardWin.getComponent(ModalRewardWin);
        ctr.showReward(apiResult);
        if (apiResult.type == REWARD_TYPE.UNLUCKY) this.__playSound(SOUND.LOSE);
        else this.__playSound(SOUND.WIN);
        this.BtnSpin.interactable = true;
      };

      const tweenWheelStart = tween(wheel)
        .to(
          3,
          {
            angle: wheel.angle - 360,
          },
          {
            easing: "cubicIn",
            onUpdate(target: any) {
              wheelDot.angle = target.angle;
            },
          }
        )
        .call(() => {
          tweenWheelLinear.start();
          // setTimeout(() => {
          this.colyseusRoom.send("spin", {
            token: this.token,
            wheelId: this.wheelData._id,
          });

          // }, 3000);
        });

      const tweenWheelLinear = tween({ angle: startAngle })
        .to(
          1,
          { angle: startAngle - 360 },
          {
            easing: "linear",
            onUpdate: (target: any, ratio) => {
              wheel.angle = target.angle;
              wheelDot.angle = target.angle;
            },
            onComplete(target: any) {
              target.angle = startAngle;

              if (that.spinReward !== null) {
                moreAngle =
                  (360 / lengthOfItem) *
                    (lengthOfItem - that.spinReward.data.index) + // move to result
                  (startAngle + 360); // move to 0

                tweenWheelLinear.stop();

                // move to result
                tween({ angle: startAngle })
                  .to(
                    1 / (360 / moreAngle),
                    { angle: startAngle - moreAngle },
                    {
                      easing: "linear",
                      onUpdate: (target: any, ratio) => {
                        wheel.angle = target.angle;
                        wheelDot.angle = target.angle;
                      },
                      onComplete(target?) {
                        //  slow down
                        tween({ angle: startAngle - moreAngle })
                          .to(
                            3,
                            {
                              angle: startAngle - moreAngle - 360,
                            },
                            {
                              easing: "cubicOut",
                              onUpdate: (target: any, ratio) => {
                                wheel.angle = target.angle;
                                wheelDot.angle = target.angle;
                              },
                            }
                          )
                          .call(() => {
                            wheel.angle = wheel.angle % 360;
                            wheelDot.angle = wheel.angle;
                            openModalResult(
                              // that.wheelData.giftDetails[that.resultIndex]
                              that.spinReward.data
                            );
                            that.spinReward = null;
                            user.spinCount = user.spinCount - 1;
                            countSpinLabel.string = `<color=#000000>Bạn còn </color><color=#ff0000><b>${user.spinCount.toString()}</b></color> <color=#000000>lượt quay </color>`;
                            console.log("OK END WWHEeL");
                          })
                          .start();
                      },
                    }
                  )
                  .start();
              }
            },
          }
        )
        .repeatForever();

      this.isWheeling = true;
      this.BtnSpin.interactable = false;
      tweenWheelStart.start();
    }else
  }

  backToScan() {
    this.wheelBg.getComponent(Animation).play("moveDown");
  }

  __playSound(sound) {
    eventTarget.emit(CS_EVENTS.PlaySound, sound);
  }
}
