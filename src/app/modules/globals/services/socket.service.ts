import { Injectable } from '@angular/core'
import { Observable, Subject } from 'rxjs/Rx'
import * as io from 'socket.io-client'

@Injectable()
export class SocketService {
  
  constructor() {
    this._socket = io(this._url)
  }

  public connect() {
    this._socket.on('connect', () => {
      console.log('Connected to server')
    })
  }

  // #Emitter: system-admin.service#updatePackage()
  public packageUpdated($package) {
    this._socket.emit('package-updated', $package)
  }
  // #Observer: system-admin.service#updatePackage()
  public observePackageUpdate(): Subject<any> {
    let observable = new Observable(observer => {
      this._socket.on('package-updated', (data) => {
        observer.next(data)
      })
    })
    let observer = {
      next: (data: Object) => {
        this._socket.emit('package-updated', JSON.stringify(data))
      }
    }
    return Subject.create(observer, Observable)
  }

  // #Emitter: system-admin.service#addPackage()
  public packageAdded($package) {
    return this._socket.emit('package-added', $package)
  }
  // #Observer: system-admin.service#addPackage()
  public observePackageAddittion(): Observable<any> {
    return Observable.create((observer) => {
      this._socket.on('package-added', (data) => {
        observer.next(data)
      })
    })
  }

  private _url    = 'ws://localhost:3000'
  private _socket;

}
