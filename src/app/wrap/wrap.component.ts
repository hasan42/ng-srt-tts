import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wrap',
  templateUrl: './wrap.component.html',
  styleUrls: ['./wrap.component.scss']
})
export class WrapComponent implements OnInit {

  msg: string = null;
  ssIsSupport: boolean = true;

  voices: any = []

  paused: boolean = false;

  form = {
    text: null,
    voice: null,
    volume: 1,
    rate: 1,
    pitch: 1
  };

  constructor() {
    if ('speechSynthesis' in window) {
      this.msg = 'Support';

      window.speechSynthesis.onvoiceschanged = (e) => {
        this.loadVoices();
      };
    } else {
      this.msg = 'No support';
      this.ssIsSupport = false;
    }
  }

  ngOnInit() {
  }

  loadVoices(){
    this.voices = window.speechSynthesis.getVoices();
  }

  onChangeVoice(voice){
    this.form.voice = voice
  }

  speak() {
    let msg = new SpeechSynthesisUtterance();
  
    msg.text = this.form.text;
    msg.volume = this.form.volume;
    msg.rate = this.form.rate;
    msg.pitch = this.form.pitch;
    
    if (this.form.voice) {
      msg.voice = speechSynthesis.getVoices().filter(voice => voice.name == this.form.voice)[0];
    }
    
    window.speechSynthesis.speak(msg);
  }

  pause() {
    this.paused = !this.paused;
    window.speechSynthesis.pause();
  }
  resume() {
    this.paused = !this.paused;
    window.speechSynthesis.resume();
  }
  stop() {
    window.speechSynthesis.cancel();
  }

}
