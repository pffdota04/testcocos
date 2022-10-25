import { _decorator, Component, Node, AudioClip, AudioSource } from "cc";
import { CS_EVENTS, eventTarget } from "./Event/EventManager";
import { SOUND } from "./Schema/data.schemas";
const { ccclass, property } = _decorator;

@ccclass("SoundController")
export class SoundController extends Component {
  @property(AudioClip)
  public soundWin: AudioClip = null!;

  @property(AudioClip)
  public soundLose: AudioClip = null!;

  @property(AudioSource)
  public audioSource: AudioSource = null!;

  //------------------------
  onLoad() {
    eventTarget.on(CS_EVENTS.PlaySound, this.__onPlaySound, this);
  }

  __onPlaySound(soundClip) {
    switch (soundClip) {
      case SOUND.WIN:
        this.__playOneShotClip(this.soundWin);
        return;
      case SOUND.LOSE:
        this.__playOneShotClip(this.soundLose);
        return;
    }
  }

  __playOneShotClip(clip: AudioClip) {
    this.audioSource.playOneShot(clip, 1);
  }
}
