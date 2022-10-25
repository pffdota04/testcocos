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
} from "cc";
import { CS_EVENTS, eventTarget } from "./Event/EventManager";
import { ModalRewardWin } from "./OnTopLayer/ModalRewardWin";
import { ScanController } from "./ScanController";
import {
  REWARD_TYPE,
  SOUND,
  UserModal,
  WheelModal,
} from "./Schema/data.schemas";
const { ccclass, property } = _decorator;

@ccclass("GameController")
export class GameController extends Component {
  @property({ type: Node })
  wheel: Node | null = null;

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

  @property({ type: Node })
  UI: Node | null = null;

  @property(Node)
  scanPage: Node | null = null;

  @property(Button)
  BtnSpin: Button | null = null;

  userData: UserModal | null = null;
  wheelData: WheelModal;
  isWheeling: Boolean = false;

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
  }

  showGameScreen(user: UserModal, wheel: WheelModal, logoSprite: SpriteFrame) {
    this.userData = user;
    this.wheelData = wheel;

    this.countSpin.getComponent(
      RichText
    ).string = `<color=#000000>Bạn còn </color><color=#ff0000><b>${user.spinCount.toString()}</b></color> <color=#000000>lượt quay </color>`;
    user.spinCount.toString();
    this.userName.getComponent(
      RichText
    ).string = `<color=#000000>Xin chào, <b>${user.name}</b></color>`;
    this.wheelName.string = wheel.displayName;

    let remoteUrl = wheel.logo;
    this.logoBrand.getComponent(Sprite).spriteFrame = logoSprite;

    this.wheelBg.getComponent(Animation).play("moveUp");
    this.UI.getComponent(Animation).play("moveUp");
    this.wheel.angle = 0;
  }

  letSpin() {
    let apiResult = null;
    let resultIndex = null;
    const user = this.userData;
    let moreAngle = 0;
    const lengthOfItem = this.wheelData.giftDesc.length;
    let wheel = this.wheel;
    let wheelDot = this.wheelDot;
    const startAngle = wheel.angle;
    const countSpinLabel = this.countSpin.getComponent(RichText);

    if (user.spinCount > 0) {
      const openModalResult = (apiResult) => {
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
          setTimeout(() => {
            resultIndex = Math.floor(Math.random() * lengthOfItem);
            apiResult = this.wheelData.giftDesc[resultIndex];
          }, 3000);
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

              if (apiResult !== null) {
                moreAngle =
                  (360 / lengthOfItem) * (lengthOfItem - resultIndex) + // move to result
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
                            openModalResult(apiResult);

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
    }
  }

  backToScan() {
    this.wheelBg.getComponent(Animation).play("moveDown");
    this.UI.getComponent(Animation).play("moveDown");
  }

  __playSound(sound) {
    eventTarget.emit(CS_EVENTS.PlaySound, sound);
  }
}
