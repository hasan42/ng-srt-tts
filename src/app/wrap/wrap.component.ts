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

  textArr: any = [];

  current: number = 0;

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

  speak(nowmsg) {
    this.current = nowmsg;
    let msg = new SpeechSynthesisUtterance();

    let delay = this.textArr[this.current].time.delay;
  
    msg.text = this.textArr[this.current].text;
    msg.volume = this.form.volume;
    msg.rate = this.form.rate;
    msg.pitch = this.form.pitch;
    
    if (this.form.voice) {
      msg.voice = speechSynthesis.getVoices().filter(voice => voice.name == this.form.voice)[0];
    }
    setTimeout(()=>{
      window.speechSynthesis.speak(msg);
      this.speak(this.current + 1)
    }, delay)
    
  }

  textIt() {
    this.textArr = this.form.text.split('\n\n');

    let newArr = [];
    let delayCommon = 0;
    this.textArr.forEach((item)=>{
      let obj = {
        id: null,
        time: {
          start: null,
          end: null,
          delay: null,
          timer: null
        }, 
        text: null
      };
      let arr = item.split('\n');

      [obj.id, , ...obj.text] = arr;

      obj.text = obj.text.join(' ');

      let timeArr = arr[1].split(' --> ');
      [obj.time.start, obj.time.end] = timeArr;

      let delayArr = obj.time.start.split(':');
      let delayHH = ((Number(delayArr[0]) * 60) * 60) * 1000
      let delayMM = (Number(delayArr[1]) * 60) * 1000
      let delaySS = Number(delayArr[2].replace(',', '.')) * 1000
      console.log(delayArr, delayHH, delayMM, delaySS);
      obj.time.timer = delayHH + delayMM + delaySS
      obj.time.delay = obj.time.timer - delayCommon
      delayCommon = obj.time.timer

      newArr.push(obj);
    });
    this.textArr = newArr;
    console.log(newArr);
  }

  play() {
    this.speak(0)
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
