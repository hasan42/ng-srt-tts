# NgSrtTts

[DEMO](https://ng-srt-tts.irustam.ru)

Angular приложение для озвучивания субтитров.  
Поддерживает `*.srt` и `*.ass`.

Для формата `ass` дополнительно отображается тип субтитров (диалоги, текст, песни и т.д.).

Есть возможность небольшой настроки:
- выбор голоса;
- громкость;
- скорость (при изменение значения так же меняется и скорость отсчета времени);
- тембр.

**Сделал:**
- озвучивание по тамингам;
- поддержка форматов `srt` и `ass`;
- `ass` выбор читаемого типа субтитров;
- изменение настроек (скорость, громкость, тембр, голос);
- перемотка (стартует сразу без задержки);
- отсчет времени и текущий строки.

**Доделать:**
- возможность изменения скорости речи не меняя тайминги;
- визуальные правки для текста перемотки;
- отсчет времени зависимый от позиции перемотки;
- визуальное отображение, когда чтение заканчивается полностью;
- для `ass` возможность копирования не всего текста;
- поддержка горячих клавиш;
- дебаг паузы и стопа;
- отображение ошибок при неправильном использовании;
- drag and drop.

### Пример для теста

**srt**  
1  
00:00:1,000 --> 00:00:3,400  
Съешь еще этих  
французких булочек,  

2  
00:00:5,600 --> 00:00:7,800  
да выпей чаю


**ass**  
[Script Info]  
; Script generated by Aegisub 3.2.2  
; http://www.aegisub.org/  
Title: Default Aegisub file  
ScriptType: v4.00+  
WrapStyle: 0  
PlayResX: 1280  
PlayResY: 720  
ScaledBorderAndShadow: yes  
Video Aspect Ratio: 0  
Video Zoom: 6  
YCbCr Matrix: TV.601  
  
[Aegisub Project Garbage]  
Last Style Storage: Default  
Video AR Mode: 4  
Video AR Value: 1.777778  
Video Zoom Percent: 0.625000  
Scroll Position: 211  
Active Line: 254  
Video Position: 26090  

[V4+ Styles]  
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding  
Style: Text,Tahoma,38,&H00FFFFFF,&H000000FF,&H00545556,&H002C2D2F,-1,0,0,0,133.333,100,0,0,1,2.25,0,8,20,20,12,1  
Style: Default,a_FuturaRoundDemi,50,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,2,0,2,10,10,10,204  

[Events]  
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text  
Dialogue: 0,0:00:1.00,0:00:4.10,Default,,0,0,0,,Съешь еще этих французких булочек,  
Dialogue: 0,0:00:1.00,0:00:4.10,Text,,0,0,0,,Lorem ipsum dolor sit amet  
Dialogue: 0,0:00:5.12,0:00:7.54,Default,,0,0,0,,да выпей чаю  
Dialogue: 0,0:00:5.55,0:00:10.19,Text,,0,0,0,,consectetur adipiscing elit