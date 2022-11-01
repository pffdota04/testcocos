import { _decorator, Component, Node, Label } from "cc";
import { ModalController } from "./ModalController";
const { ccclass, property } = _decorator;

@ccclass("ModalError")
export class ModalError extends ModalController {
  @property(Label)
  desc: Label | null = null;

  showError(message: string) {
    this.desc.string = message;
    this.show();
  }
}
