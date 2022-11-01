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
    collider.on(
      Contact2DType.BEGIN_CONTACT,
      (from, start) => {
        this.playSound(audio);
        // console.log(from);
        // console.log(start);
      },
      this
    );
  }

  playSound(audio: AudioSource) {
    // console.log("HIT");
    audio.play();
  }
}
