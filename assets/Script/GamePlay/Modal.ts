import {
  _decorator,
  Component,
  Node,
  PolygonCollider2D,
  Contact2DType,
  AudioSource,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("Modal")
export class Modal extends Component {
  start() {
    let audio = this.getComponent(AudioSource);
    audio.play();
  }

  playSound(audio) {}
}
