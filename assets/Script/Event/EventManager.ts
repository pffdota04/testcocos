import { Event, EventTarget } from "cc";
const eventTarget = new EventTarget();

export enum CS_EVENTS {
  SpinBtn = "SpinBtn",
  ShowResultDlg = "ShowResultDlg",
  PlaySound = "PlaySound",
}

export { eventTarget };
