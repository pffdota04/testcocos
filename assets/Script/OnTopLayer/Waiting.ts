import { _decorator, Component, Node, Vec3 } from "cc";
import { CS_EVENTS, eventTarget } from "../Event/EventManager";
const { ccclass, property } = _decorator;

@ccclass("Waiting")
export class Waiting extends Component {
  onLoad() {
    eventTarget.on(CS_EVENTS.Waiting, this.openWaiting, this);
  }
  openWaiting(isOpen) {
    console.log("Waiting ");
    console.log(isOpen);
    this.node.position = new Vec3(0, 0, 0);
    if (isOpen) this.node.active = true;
    else this.node.active = false;
  }
}
