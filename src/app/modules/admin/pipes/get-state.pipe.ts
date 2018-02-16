import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getState'
})
export class GetStatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let RETURN_STRING: String
    
    if (args == 'CLIENT_STATE') {
        if (value) RETURN_STRING = 'Active Client'
        else if (!value) RETURN_STRING = 'Inactive Client'
    }

    return RETURN_STRING
  }

}
