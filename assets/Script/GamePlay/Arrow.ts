import {
  _decorator,
  Component,
  Node,
  PolygonCollider2D,
  Contact2DType,
  AudioSource,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("Arrow")
export class Arrow extends Component {
  start() {
    let collider = this.getComponent(PolygonCollider2D);
    let audio = this.getComponent(AudioSource);
    collider.on(Contact2DType.BEGIN_CONTACT, () => this.playSound(audio), this);
  }

  playSound(audio: AudioSource) {
    audio.play();
  }
}
