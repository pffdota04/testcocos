import {
  _decorator,
  Component,
  Node,
  tween,
  Vec2,
  Vec3,
  Sprite,
  Color,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("ModalController")
export class ModalController extends Component {
  protected _isOpen = false;
  //   protected _isProcessing = false;

  @property({ type: Node })
  public DimLayer: Node | null = null;

  show() {
    if (this._isOpen) {
      return;
    }

    this._isOpen = true;
    this.DimLayer.active = true;
    this.node.active = true;
    tween(this.node)
      .to(0.25, { position: new Vec3(0, 0, 0) }, { easing: "quartInOut" })
      .start();

    tween(this.DimLayer.getComponent(Sprite))
      .to(
        0.25,
        { color: new Color(255, 255, 255, 210) },
        { easing: "quartInOut" }
      )
      .start();
  }

  hide() {
    if (!this._isOpen) {
      return;
    }
    this._isOpen = false;
    this.DimLayer.active = false;
    tween(this.node)
      .to(0.25, { position: new Vec3(0, 1280, 0) }, { easing: "quartInOut" })
      .call(() => (this.node.active = false))
      .start();

    tween(this.DimLayer.getComponent(Sprite))
      .to(
        0.25,
        { color: new Color(255, 255, 255, 0) },
        { easing: "quartInOut" }
      )
      .start();
  }
}
