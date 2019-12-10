import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secondsToTime'
})
export class SecondsToTimePipe implements PipeTransform {

  transform(value: any, args?: any): any {
  	let time = new Date(1000 * value).toISOString().substr(11, 8)
    return time;
  }

}
