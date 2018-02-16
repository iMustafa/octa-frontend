import { Component, OnInit, Inject } from '@angular/core'
import { Validators, FormBuilder, FormGroup } from '@angular/forms'
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material'
import { SystemAdminService } from '../../../services/system-admin.service'
import { SocketService } from '../../../../globals/services/socket.service'
import { Observable, Subject } from 'rxjs/Rx'

@Component({
	selector: 'app-contracts',
	templateUrl: './contracts.component.html',
	styleUrls: ['./contracts.component.css']
})
export class ContractsComponent implements OnInit {

	constructor(public dialog: MdDialog, public system: SystemAdminService, private _socket: SocketService) { }

	public getContracts() {
		this.system.getContracts().subscribe(
			(data) => {
				this.contracts.active = data.active
				this.contracts.suspended = data.suspended
				this.loading = false
			},
			(err) => {
				this.failed = true
				throw new Error(err)
			},
			() => { return true }
		)
	}

	public openExtendContractDialog($contract) {
		let dialogRef = this.dialog.open(ExtendContractDialog, {
			width: '400px',
			data: $contract
		});
	}

	public openAddContractDialog() {
		let dialogRef = this.dialog.open(AddContractDialog, {
			width: '400px',
			data: {}
		})
	}

	ngOnInit() {
		this.getContracts()
	}

	public contracts: any = {
		active: [], suspended: []
	}

	public loading: Boolean = true
	public failed: Boolean = false
	private _date: Date = new Date()

}

@Component({
	template: `
    <h3 class='text-center'>Create Contract</h3>

    <section *ngIf='_loading' class='loading text-center'>
      <md-spinner></md-spinner>
    </section>

    <div class='alert alert-danger' *ngIf='addFaild'>Failed to add package, please check your connection.</div>
    <form *ngIf='!_loading && !_failed' [formGroup]='_addContractForm' (ngSubmit)='_createContract(_addContractForm)'>
      
			<div *ngIf='_client && !_page'>
				<md-form-field class="col-xs-12">
					<input mdInput formControlName='CLIENT' [placeholder]="_client.FULL_NAME">
				</md-form-field>
				
				<div style='margin: 5px 0'>
					<md-select class='col-xs-12' formControlName='PAGE' placeholder='Page'>
						<md-option *ngFor='let page of _pages' [value]='(page)?._id'>
							{{(page)?.NAME}}
						</md-option>
					</md-select>
				</div>
			</div>

			<div *ngIf='_page && _client'>
				<md-form-field class="col-xs-12">
					<input mdInput formControlName='CLIENT' [placeholder]="_client.FULL_NAME">
				</md-form-field>
				<md-form-field class="col-xs-12">
					<input mdInput formControlName='PAGE' [placeholder]="_page.name">
				</md-form-field>
			</div>

			<div *ngIf='!_page && !_client'>
				<div style='margin: 5px 0'>
					<md-select class='col-xs-12' formControlName='CLIENT' placeholder='Client'>
						<md-option *ngFor='let client of _clients' [value]='(client)?._id'>
							{{(client)?.FULL_NAME}}
						</md-option>
					</md-select>
				</div>
				
				<div style='margin: 5px 0'>
					<md-select class='col-xs-12' formControlName='PAGE' placeholder='Page'>
						<md-option *ngFor='let page of _pages' [value]='(page)?._id'>
							{{(page)?.NAME}}
						</md-option>
					</md-select>
				</div>
			</div>

      <div style='margin: 5px 0'>
        <md-select class='col-xs-12' formControlName='PACKAGE' placeholder='Package'>
          <md-option *ngFor='let package of _packages' [value]='(package)?._id'>
            {{(package)?.NAME}}
          </md-option>
        </md-select>
      </div>

      <md-form-field class="col-xs-12">
        <input mdInput formControlName='START_TIME' [mdDatepicker]="START_TIME_PICKER" placeholder="Start Date">
        <md-datepicker-toggle mdSuffix [for]="START_TIME_PICKER"></md-datepicker-toggle>
        <md-datepicker #START_TIME_PICKER></md-datepicker>
      </md-form-field>
      <md-form-field class="col-xs-12">
        <input mdInput formControlName='RENEWAL_TIME' [mdDatepicker]="RENEWAL_TIME_PICKER" placeholder="Expire Date">
        <md-datepicker-toggle mdSuffix [for]="RENEWAL_TIME_PICKER"></md-datepicker-toggle>
        <md-datepicker #RENEWAL_TIME_PICKER></md-datepicker>
      </md-form-field>
      <div class='text-center'>
        <button md-button type='submit'>Add</button>
      </div>
    </form>

    <section *ngIf='_failed' class="failed text-center">
      <h3>
        loading failed, please check your connection and try again.
      </h3>
    </section>
  `,
	styles: [
		"h3 {margin-bottom: 20px}",
		"md-spinner { text-align: center; width: 100%; margin-top: 50px }",
		"md-form-field {margin: 5px 0}"
	]
})
export class AddContractDialog implements OnInit {

	constructor(
		public dialogRef: MdDialogRef<AddContractDialog>,
		private _fb: FormBuilder,
		private _system: SystemAdminService,
		@Inject(MD_DIALOG_DATA) public data: any) {
		this._client = data.client
		this._page = data.page
		this._addContractFormBuilder()
	}

	private _addContractFormBuilder() {
		this._addContractForm = this._fb.group({
			CLIENT: [{ value: this._client ? this._client._id : null, disabled: this._client ? true : false }],
			PACKAGE: [null, Validators.required],
			PAGE: [{ value: this._page ? this._page._id : null, disabled: this._page ? true : false }],
			START_TIME: [null, Validators.required],
			RENEWAL_TIME: [null, Validators.required]
		})
	}

	private _createContract($formData) {
		$formData.value.CLIENT = $formData.controls.CLIENT.value
		$formData.value.PAGE = $formData.controls.PAGE.value
		if ($formData.valid) {
			let newContract = $formData.value
			this._system.addContract(newContract).subscribe(
				(data) => {
					let res = JSON.parse(data._body)
					if (res.state) {
						this.dialogRef.close()
					} else {
						this._addFaild = true
					}
				}, (err) => {
					throw new Error(err)
				}
			)
		} else {
			return false
		}
	}

	private _getPackages(): Promise<any> {
		return new Promise((resolve, reject) => {
			this._system.getPackages().subscribe(
				(data) => { resolve(data.active) },
				(err) => { reject(err) },
				() => { return true }
			)
		})
	}

	private _getClients(): Promise<any> {
		return new Promise((resolve, reject) => {
			this._system.getClients(true).subscribe(
				(data) => { resolve(data) },
				(err) => { reject(err) },
				() => { return true }
			)
		})
	}

	private _getPages(): Promise<any> {
		return new Promise((resolve, reject) => {
			this._system.getPages(true).subscribe(
				(data) => { resolve(data) },
				(err) => { reject(err) },
				() => { return true }
			)
		})
	}

	ngOnInit() {
		let promises: any = [
			this._getPackages(),
			this._getPages(),
			this._getClients()
		]

		Promise
			.all(promises)
			.then((resolve: any) => {
				this._packages = resolve[0]
				this._pages = resolve[1]
				this._clients = resolve[2]
				this._loading = false
			})
			.catch((reject) => {
				this._failed = true
				throw new Error(reject)
			})
	}

	onNoClick(): void {
		this.dialogRef.close();
	}

	private _client: any
	private _page: any

	private _addContractForm: FormGroup

	private _packages: any = []
	private _pages: any = []
	private _clients: any = []

	private _addFaild: boolean = false
	private _loading: boolean = true
	private _failure: boolean = false
	private _failed: boolean = false

}

@Component({
	template: `
    <h3 class='text-center'>Extend Contract</h3>
    <section *ngIf='_loading' class='loading text-center'>
      <md-spinner></md-spinner>
    </section>

    <div class='alert alert-danger' *ngIf='addFaild'>Failed to update contract, please check your connection.</div>
    <form [formGroup]='_extendContractForm' (ngSubmit)='_updateContract(_extendContractForm, _contract._id)'>

      <md-form-field class="col-xs-12">
        <input mdInput formControlName='START_TIME' [mdDatepicker]="START_TIME_PICKER" placeholder="Start Date">
        <md-datepicker-toggle mdSuffix [for]="START_TIME_PICKER"></md-datepicker-toggle>
        <md-datepicker #START_TIME_PICKER></md-datepicker>
      </md-form-field>

      <md-form-field class="col-xs-12">
        <input mdInput formControlName='RENEWAL_TIME' [mdDatepicker]="RENEWAL_TIME_PICKER" placeholder="Expire Date">
        <md-datepicker-toggle mdSuffix [for]="RENEWAL_TIME_PICKER"></md-datepicker-toggle>
        <md-datepicker #RENEWAL_TIME_PICKER></md-datepicker>
      </md-form-field>

      <div class='text-center'>
        <button md-button type='submit'>Update</button>
      </div>
    </form>
  `,
	styles: [

	]
})
export class ExtendContractDialog {

	constructor(
		public dialogRef: MdDialogRef<ExtendContractDialog>,
		private _fb: FormBuilder,
		private _system: SystemAdminService,
		@Inject(MD_DIALOG_DATA) public data: any) {
		this._contract = data
		this._extendContractFormBuilder()
		this._extendContractForm.patchValue(data)
	}

	private _extendContractFormBuilder() {
		this._extendContractForm = this._fb.group({
			START_TIME: [{ value: this._contract.START_TIME, disabled: true }],
			RENEWAL_TIME: [null, Validators.required]
		})
	}

	private _updateContract($formData, $contractID) {
		if ($formData.valid) {
			let updateValue = $formData.value
			this._loading = true

			this._system.updateContract($contractID, updateValue).subscribe(
				(data) => {
					let res = JSON.parse(data._body)
					this._loading = false
					if (res.state) {
						this.dialogRef.close()
					} else {
						this._updateFailed = true
					}
				},
				(err) => {
					this._loading = false
					throw new Error(err)
				},
				() => { return true }
			)
		} else {
			return false
		}
	}

	private _extendContractForm: FormGroup
	private _contract: any
	private _updateFailed: Boolean = false
	private _loading: Boolean = false

}