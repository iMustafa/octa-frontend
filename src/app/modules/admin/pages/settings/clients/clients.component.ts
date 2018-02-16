import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms'
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material'
import { AddContractDialog } from '../contracts/contracts.component'
import { SystemAdminService } from '../../../services/system-admin.service'
import { SocketService } from '../../../../globals/services/socket.service'
import { Observable, Subject } from 'rxjs/Rx'

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {

  constructor(public dialog: MdDialog, public system: SystemAdminService, private _socket: SocketService) { }

  public getClients() {
    this.loading = true
    this.system.getClients().subscribe(
      (response) => {
        let that = this
        this.loading = false
        this.clients = response
      },
      (err) => {
        this.loading = false
        this.failed = true
        throw new Error(err)
      }
    )
  }

  public suspendClient($id, $state) {
    let update = { STATE: $state }
    this.system.updateClient($id, update)
      .subscribe(
      (data) => {
        // Socket Emitter
      },
      (err) => { throw new Error(err) },
      () => { return true }
      )
  }

  public openAddContractDialog($client): void {
    let dialogRef = this.dialog.open(AddContractDialog, {
      width: '400px',
      data: {client: $client}
    });
  }

  ngOnInit() {
    this.getClients()
  }

  public clients: any = {}

  public loading: Boolean = true
  public failed: Boolean = false

}