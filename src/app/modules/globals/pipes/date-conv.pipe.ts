import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateConv'
})
export class DateConvPipe implements PipeTransform {

  transform(value: any, args?: any): any {

    Date.prototype['addDays'] = function(days) {
      var dat = new Date(this.valueOf());
      dat.setDate(dat.getDate() + days);
      return dat;
    }
    
    let today    = new Date();
    let date     = new Date(value);
    let timeDiff = date.getTime() - today.getTime();
    let diffDay  = Math.ceil(timeDiff / (1000 * 3600 * 24));
    var dateString;
    
    if (diffDay == 0) {
      dateString = "Today"
    } else if (diffDay == -1) {
      dateString = "Yesterday"
    } else if (diffDay == 1) {
      dateString = "Tomorrow"
    } else {
      date = date['addDays'](1);
      dateString = date.toISOString();
      dateString = dateString.substr(0, dateString.indexOf('T'));
    }
    
    return dateString;
  }

}
