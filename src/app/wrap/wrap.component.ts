import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms'
import { faStop, faPlay, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-wrap',
  templateUrl: './wrap.component.html',
  styleUrls: ['./wrap.component.scss']
})
export class WrapComponent implements OnInit {

  // иконки fontawesome
  faCheck = faCheck;
  faTimes = faTimes;
  faStop = faStop;
  faPlay = faPlay;
  faGithub = faGithub;

  msg: string = null; // сообщение
  error: boolean = false; // ошибка
  ssIsSupport: boolean = true; // поддержка speechSynthesis

  format: string = null; // формат субтитров ass или str

  voices: any = []; // доступные голоса

  paused: boolean = false; // сейчас на паузе
  played: boolean = false; // сейчас проигрывается

  form: FormGroup;

  textArr: any = []; // массив субтитров которые читаются
  fullTextArr: any = []; // полный массив субтитров
  subStyleType: any = []; // для ass стили субтитров

  subStyleSelected: string = null; // для ass выбранный стиль

  current: number = 0; // текущий саб

  timer: any = null; // задержка проигрываения - отсчет от самого начала
  delay: number = null; // задержка проигрываения - отсчет от предыдущего саба

  timelineChange: boolean = false; // таймлайн изменен

  time: number = 0; // счетчик времени
  interval;
  currentTime;

  constructor() {
    // проверка поддержки speechSynthesis
    if ('speechSynthesis' in window) {
      // поддерживыает загружаем
      this.msg = 'Support';
      window.speechSynthesis.onvoiceschanged = (e) => {
        this.loadVoices();
      };
    } else {
      // не поддерживает - выводим сообщение об ошибке
      this.msg = 'No support';
      this.error = true;
      this.ssIsSupport = false;
    }
  }

  ngOnInit() {
    // форма
    this.form = new FormGroup({
      text: new FormControl(''),
      voice: new FormControl(null),
      timeline: new FormControl(-1),
      volume: new FormControl(1),
      rate: new FormControl(1),
      ratedep: new FormControl(true),
      pitch: new FormControl(1)
    })
  }

  // загрузка файла через drag and drop
  uploadFile(event) {
    this.form.patchValue({text: event}) // сохраняем текст в форму
    this.checkFormatSub() // обрабатываем
  }

  // подгрузка доступных голосов
  loadVoices(){
    this.voices = window.speechSynthesis.getVoices();
  }

  // получение выбранного времени (чч:мм:сс) на таймлайне
  getTime() {
    // если есть субтитры
    if(this.textArr.length){
      const timlineValue = +this.form.get('timeline').value
      // если таймлайн на первом пункте - выводим сообщение "по порядку"
      if(timlineValue === -1){
        return 'in order'
      }else{
        // получаем время старта из массива сабов
        return this.textArr[timlineValue].time.start
      }
    }
  }

  // измениние таймлайна
  onChangeTimeline(){
    this.timelineChange = true
  }

  // при смене субтитров сохраняем выбранный стиль и фильтруем массив всех сабов
  onChangeStyleSub(style){
    this.subStyleSelected = style;
    this.filterTextByStyle();
  }

  // возвращает количество субтитров по стилю
  getCountSubByStyle(style){
    return this.fullTextArr.filter(item=>item.style===style).length
  }

  // для ass
  // фильтрует стили субтитров
  filterTextByStyle() {
    let filtredArr = [];
    let fullArr = this.fullTextArr;
    let delayCommon = 0;
    // если выбранны все - копируем все сабы в читаемые
    if(this.subStyleSelected === 'All'){
      this.textArr = fullArr;
    }else{
      // если выбранный отдельный - фильтруем по стилю
      filtredArr = fullArr.filter(item=>item.style===this.subStyleSelected);
      // переназначаем задержки
      filtredArr.forEach((item,index)=>{
        item.time.delay = item.time.timer - delayCommon
        delayCommon = item.time.timer
      });
      // результат сохраняем в массив читаемых
      this.textArr = filtredArr;
    }
  }

  speak(nowmsg) {
    if(this.timelineChange && +this.form.get('timeline').value !== -1){
      this.delay = 0;
      this.timelineChange = false;
      this.current = +this.form.get('timeline').value;
    }else{
      this.current = nowmsg;
      this.delay = this.form.get('ratedep').value === true ? this.textArr[this.current].time.delay / this.form.get('rate').value : this.textArr[this.current].time.delay;
    }
    this.msg = 'current: ' + this.current
    let curSpk = new SpeechSynthesisUtterance();
  
    curSpk.text = this.textArr[this.current].text;
    curSpk.volume = this.form.get('volume').value;
    curSpk.rate = this.form.get('rate').value;
    curSpk.pitch = this.form.get('pitch').value;
    
    if (this.form.get('voice').value) {
      curSpk.voice = speechSynthesis.getVoices().filter(voice => voice.name == this.form.get('voice').value)[0];
    }
    this.timer = setTimeout(()=>{
      window.speechSynthesis.speak(curSpk);
      if( this.current + 1 <  this.textArr.length) {
        this.speak(this.current + 1);
      }else{
        this.msg = 'finish: ' + (this.current + 1);
      }
    }, this.delay)
  }

  // очистка текста от лишних тегов
  cleanTextSrt(text){
    let clean = text.join(' ').replace(/<[^>]+>/g, '');
    return clean;
  }
  cleanTextAss(text){
    let clean = text.join('').replace(/{[^}]+}/g, '').replace(/\\N/g, ' ');
    return clean;
  }

  // время из чч:мм:сс переводим в милисекунды
  makeTimer(time): number{
    const delayArr = time.split(':'); // из отфарматированной строки делаем массив
    const delayHH = ((+delayArr[0] * 60) * 60) * 1000; // часы в милисекунды
    const delayMM = (+delayArr[1] * 60) * 1000; // минуты в милисекунды
    // заменяем запятую точкой если надо
    if(delayArr[2].indexOf(',') >= 0){
      delayArr[2] = delayArr[2].replace(',', '.')
    }
    const delaySS = +delayArr[2] * 1000; // секунды в милисекунды
    const timer = delayHH + delayMM + delaySS; // собираем, отправляем
    return timer
  }

  // создание массива для слайдеров настроек
  makeArray(min: number, max: number, step: number): any[] {
    let arr = [];
    for(let i = min; i<max; i=i+step){
      arr.push(i.toFixed(1))
    }
    return arr;
  }

  // проверка типа сабов
  checkFormatSub() {
    // сабы бьем на строки
    let checkStyleSub = this.form.get('text').value.split('\n');
    // проверяем первое значение
    if(checkStyleSub[0].trim() === '1'){
      // если "1" - str 
      this.format = 'str'; // отмечаем формат
      this.subStyleType = []; // очищаем массив стилей сабов для ass
      this.textToArrStr() // обработчик сабов в читаемый вариант
    }else if(checkStyleSub[0].trim() === '[Script Info]'){
    // }else if(checkStyleSub[0] === '[Script Info]' || checkStyleSub[0].indexOf('Dialogue: ') >= 0){
      // если фраза - ass
      this.format = 'ass'; // отмечаем формат
      this.takeStyleAss() // собираем имеющиеся стили
      this.textToArrAss() // обрабатываем сабы в читаемый вариант
    }else{
      // если не один из двух
      this.format = null; // сбрасываем формат
      this.error = true; // отмечавем что етсь ошибка
      this.msg = 'wrong format'; // выводим ошибку
    }
  }

  takeStyleAss() {
    let styleArr = [];
    let newArr = this.form.get('text').value.split('\n');
    // let startText = newArr.findIndex(item => item.indexOf(' Styles]') >= 0);
    // let finishText = newArr.findIndex(item => item === '[Events]');
    newArr.filter(item=>item.indexOf('Style: ')===0).forEach((item,index)=>{
      let el = item.replace('Style: ', '').split(',');
      styleArr.push(el[0])
    })
    this.subStyleType = styleArr;
  }

  textToArrAss() {
    let formatArr = [];
    let newArr = this.form.get('text').value.split('\n');
    let startText = newArr.findIndex(item => item.trim() === '[Events]');
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
    // console.log(formatArr);
  }

  textToArrStr() {
    this.textArr = this.form.get('text').value.split('\n\n');

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
        let arr = item.split('\n').filter(el=>el!=='');

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

  setInterval(){
    let delay = this.form.get('ratedep').value === true ? 1000 / this.form.get('rate').value : 1000;
    this.interval = setInterval(() => {
      this.time++;
    },delay);
  }

  play() {
    this.stop();
    this.played = true;
    // this.checkFormatSub()
    this.setInterval()
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
    this.played = false;
    this.time = 0;
    window.speechSynthesis.cancel();
    if(+this.form.get('timeline').value !== -1){
      this.timelineChange = true;
    }
    clearTimeout(this.timer);
    clearInterval(this.interval);
  }

}
