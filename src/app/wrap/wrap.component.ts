import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wrap',
  templateUrl: './wrap.component.html',
  styleUrls: ['./wrap.component.scss']
})
export class WrapComponent implements OnInit {

  msg: string = null;
  ssIsSupport: boolean = true;

  format: string = null;

  voices: any = []

  paused: boolean = false;

  form = {
    text: null,
    voice: null,
    timeline: -1,
    volume: 1,
    rate: 1,
    pitch: 1
  };

  textArr: any = [];
  fullTextArr: any = [];
  subStyleType: any = [];

  subStyleSelected: string = null;

  current: number = 0;

  timer: any = null;

  timelineChange: boolean = false;

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

  getTime() {
    if(this.textArr.length){
      console.log(this.form.timeline);
      if(Number(this.form.timeline) === -1){
        return 'in order'
      }else{
        return this.textArr[this.form.timeline].time.start
      }
    }
  }

  onChangeVoice(voice){
    this.form.voice = voice
  }

  onChangeTimeline(timeline){
    this.timelineChange = true
    this.form.timeline = timeline
  }

  onChangeStyleSub(style){
    this.subStyleSelected = style;
    this.filterTextByStyle();
  }

  getCountSubByStyle(style){
    return this.fullTextArr.filter(item=>item.style===style).length
  }

  filterTextByStyle() {
    let filtredArr = [];
    let fullArr = this.fullTextArr;
    let delayCommon = 0;
    if(this.subStyleSelected === 'All'){
      this.textArr = fullArr;
    }else{
      filtredArr = fullArr.filter(item=>item.style===this.subStyleSelected)
      filtredArr.forEach((item,index)=>{
        item.time.delay = item.time.timer - delayCommon
        delayCommon = item.time.timer
      })

      this.textArr = filtredArr;
    }
    
    console.log(this.textArr);
  }

  speak(nowmsg) {
    // console.log(this.form);
    let delay = null;
    if(this.timelineChange && Number(this.form.timeline) !== -1){
      delay = 0;
      this.timelineChange = false;
      this.current = Number(this.form.timeline);
    }else{
      delay = this.textArr[this.current].time.delay / this.form.rate;
      this.current = nowmsg;
    }
    // console.log(this.current, delay);
    this.msg = 'current: ' + this.current
    let msg = new SpeechSynthesisUtterance();

  
    msg.text = this.textArr[this.current].text;
    msg.volume = this.form.volume;
    msg.rate = this.form.rate;
    msg.pitch = this.form.pitch;
    
    if (this.form.voice) {
      msg.voice = speechSynthesis.getVoices().filter(voice => voice.name == this.form.voice)[0];
    }
    this.timer = setTimeout(()=>{
      window.speechSynthesis.speak(msg);
      if( this.current + 1 <  this.textArr.length) {
        this.speak(this.current + 1)
      }else{
        this.msg = 'finish: ' + (this.current + 1)
      }
    }, delay)
    
  }

  cleanTextSrt(text){
    let clean = text.join(' ').replace(/<[^>]+>/g, '');
    return clean;
  }
  cleanTextAss(text){
    let clean = text.join('').replace(/{[^}]+}/g, '').replace(/\\N/g, ' ');
    return clean;
  }

  makeTimer(time){
    let delayArr = time.split(':');
    let delayHH = ((Number(delayArr[0]) * 60) * 60) * 1000
    let delayMM = (Number(delayArr[1]) * 60) * 1000
    if(delayArr[2].indexOf(',') >= 0){
      delayArr[2].replace(',', '.')
    }
    let delaySS = Number(delayArr[2]) * 1000
    let timer = delayHH + delayMM + delaySS
    return timer
  }

  checkFormatSub() {
    let checkStyleSub = this.form.text.split('\n');
    if(checkStyleSub[0] === '1'){
      this.format = 'str';
      this.textToArrStr()
    }else if(checkStyleSub[0] === '[Script Info]'){
    // }else if(checkStyleSub[0] === '[Script Info]' || checkStyleSub[0].indexOf('Dialogue: ') >= 0){
      this.format = 'ass';
      this.takeStyleAss()
      this.textToArrAss()
    }else{
      this.format = null;
      this.msg = 'wrong format';
    }
  }

  takeStyleAss() {
    let styleArr = [];
    let newArr = this.form.text.split('\n');
    // let startText = newArr.findIndex(item => item.indexOf(' Styles]') >= 0);
    // let finishText = newArr.findIndex(item => item === '[Events]');
    newArr.filter(item=>item.indexOf('Style: ')===0).forEach((item,index)=>{
      let el = item.replace('Style: ', '').split(',');
      styleArr.push(el[0])
    })
    console.log(styleArr);
    this.subStyleType = styleArr;
  }

  textToArrAss() {
    let formatArr = [];
    let newArr = this.form.text.split('\n');
    let startText = newArr.findIndex(item => item === '[Events]');
    newArr.splice(0, startText + 1);

    let formatSub = newArr.splice(0, 1);
    formatSub = formatSub[0].replace('Format: ', '');
    formatSub = formatSub.split(', ')
    let formatSubLength = formatSub.length
    formatSub = formatSub.reduce((a,b)=> (a[b]=null,a),{});
    
    let delayCommon = 0;
    newArr.forEach((item, index)=>{
      if(item.length){
        item = item.replace('Dialogue: ', '');

        let obj = {};
        for(let k in formatSub) obj[k]=formatSub[k];
        let keys = Object.keys( obj );

        let arr = item.split(',');
        for (let i = 0; i < formatSubLength - 1; i++) obj[keys[i]] = arr[i]

        let last = arr.slice(formatSubLength - 1);
        last = this.cleanTextAss(last);
        obj[keys[formatSubLength - 1]] = last

        let timer = this.makeTimer(obj['Start'])

        let standartObj = {
          id: index,
          time: {
            start: obj['Start'],
            end: obj['End'],
            delay: null,
            timer: timer
          }, 
          text: obj[keys[formatSubLength - 1]],
          style: obj['Style']
        };

        formatArr.push(standartObj)
      }
    });

    formatArr.sort((a,b)=>{
      return a.time.timer - b.time.timer
    }).forEach((item, index)=>{
      // let delay = item.time.timer - delayCommon < 0 ? 0 : item.time.timer - delayCommon
      item.time.delay = item.time.timer - delayCommon
      delayCommon = item.time.timer
    });
    this.fullTextArr = formatArr;
    this.textArr = formatArr;
    console.log(formatArr);
  }

  textToArrStr() {
    this.textArr = this.form.text.split('\n\n');

    let newArr = [];
    let delayCommon = 0;
    this.textArr.forEach((item)=>{
      if(item.length){
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

        obj.text = this.cleanTextSrt(obj.text);

        let timeArr = arr[1].split(' --> ');
        [obj.time.start, obj.time.end] = timeArr;

        obj.time.timer = this.makeTimer(obj.time.start)
        obj.time.delay = obj.time.timer - delayCommon < 0 ? 0 : obj.time.timer - delayCommon
        delayCommon = obj.time.timer

        newArr.push(obj);
      }
    });
    this.textArr = newArr;
  }

  play() {
    clearTimeout(this.timer);
    // this.checkFormatSub()
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
    clearTimeout(this.timer);
  }

}
