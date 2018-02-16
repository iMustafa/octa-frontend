import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { Headers, Response, RequestOptions, RequestMethod, URLSearchParams, Request } from '@angular/http';
import 'rxjs';

@Injectable()
export class HttpService {

  constructor(private http: Http) { }

  public send($method: any, $url: string, $data: any = null): Promise<any> {

    let submitedata: any = $data,
      requstOptions: RequestOptions = new RequestOptions({
        method: RequestMethod[$method],
        url: $url,
        body: submitedata
      });
    return this.http.request(new Request(requstOptions)).toPromise()
      .then(response => {
        return response;
      })
      .catch(reject => {
        return reject
      });
  }
}