import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CookiesService } from './cookies.service';
import { HttpModule, Http } from '@angular/http';
import { Headers, Response, RequestOptions, RequestMethod, URLSearchParams, Request } from '@angular/http';
import 'rxjs';

@Injectable()
export class AuthorizationService {

  constructor(public http: Http, public cookies: CookiesService) { }

  /*
    $data       => Submited Form/Request Data
    $url        => Form action ( Submits the data to a URL )
    $method     => Submited Form/Request Method
    $tokenName  => the api token with a deffult values 
  */
  sendTokenizedRequest($data: any, $url: string, $method: string, $tokenName: string = 'API_TOKEN'): Promise<any> {
    const $tokenValue = this.cookies.getCookie($tokenName),
      headerObj = { 'Content-Type': 'application/json' };
    headerObj[$tokenName] = $tokenValue;
    const headers: Headers = new Headers(headerObj),
      submitedData: any = $data,
      requestOptions: RequestOptions = new RequestOptions({
        method: $method,
        url: $url,
        headers: headers,
        body: submitedData
      });
    return this.http.request(new Request(requestOptions)).toPromise()
      .then(response => {
        return response;
      })
      .catch(reject => {
        return reject;
      });
  }
}
