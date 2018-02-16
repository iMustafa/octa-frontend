import { Component, OnInit, Inject } from '@angular/core'
import { Validators, FormBuilder, FormGroup } from '@angular/forms'
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material'
import { AddContractDialog } from '../contracts/contracts.component'
import { SystemAdminService } from '../../../services/system-admin.service'
import { GraphAPIService } from '../../../services/graph-api.service'
import { SocketService } from '../../../../globals/services/socket.service'
import { Observable, Subject } from 'rxjs/Rx'

@Component({
	selector: 'app-pages',
	templateUrl: './pages.component.html',
	styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {

	constructor(public dialog: MdDialog,
		public system: SystemAdminService,
		private _socket: SocketService) {

	}

	public getDBPages() {
		this.system.getPages().subscribe(
			(data) => {
				let that = this
				this.loading = false
				this.pages = data
			},
			(err) => {
				this.loading = false
				this.failed = true
			},
			() => { return true }
		)
	}

	ngOnInit() {
		this.getDBPages()
	}

	public openAddPageDialog(): void {
		let dialogRef = this.dialog.open(AddPageDialog, {
			width: '400px'
		});
	}

	public pages: any = {}

	public loading: Boolean = true
	public failed: Boolean = false

}

@Component({
	template: `
		<h3 class='text-center'>Add Page</h3>
		<div class='alert alert-danger' *ngIf='_addFailed'>Failed to add page, please check your connection.</div>
		<form [formGroup]='addPageForm' (ngSubmit)='addPage(addPageForm)'>
			<md-select placeholder="Ad Account Pages" formControlName='SAVED' class='col-xs-12'>
				<md-option *ngFor="let page of FBPages" [value]="page">
					{{ page.name }}
				</md-option>
			</md-select>
			<md-form-field class="col-xs-12" style='margin-top: 15px'>
				<input mdInput formControlName='NAME' placeholder="Name">
			</md-form-field>
			<md-form-field class='col-xs-12'>
				<input mdInput formControlName='ID' placeholder='ID'> 
			</md-form-field>
			<md-select placeholder="Registered Clients" formControlName='CLIENT' class='col-xs-12'>
				<md-option *ngFor="let client of clients" [value]="client">
					{{ client.FULL_NAME }}
				</md-option>
			</md-select>
			<md-select class='col-xs-12' #adAccount (change)='getCampaigns(adAccount.value)' placeholder='Ad Account'>
				<md-option *ngFor='let account of adAccounts' [value]='account.id'>
					{{account.id}}
				</md-option>
			</md-select>

			<md-select class='col-xs-12' formControlName='CAMPAIGN_ID' placeholder='Campaign'>
				<md-option style='color: #F00' *ngFor='let campaign of campaigns' [value]='campaign.id'>
					{{campaign.name}}
				</md-option>
				<md-option (click)='loadmore()'>Load More</md-option>
			</md-select>
			<div class='clearfix'></div>
			<div class='text-center' style='margin-top: 15px'>
				<button md-button type='submit'>Add</button>
			</div>
		</form>
	`,
	styles: [

	]
})
export class AddPageDialog implements OnInit {

	constructor(
		public dialog: MdDialog,
		public dialogRef: MdDialogRef<AddPageDialog>,
		@Inject(MD_DIALOG_DATA) public data: any,
		private _graph: GraphAPIService,
		private _system: SystemAdminService,
		private _fb: FormBuilder) {
		this.addPageFormBuilder()
	}

	public getFBPages = async () => {
		let FBPages: any = await this._graph.getPageList()
		let DBPages: any = await this._system.getPages(true).toPromise()
		if (FBPages instanceof Array) {
			let DBPageIDs = DBPages.map(DBPage => { return DBPage.ID })
			return FBPages.filter(FBPage => {
				if (!DBPageIDs.includes(FBPage.id)) {
					return FBPage
				}
			})
		} else {
			throw new Error('Error getting Facebook Pages')
		}
	}

	public getClients = async () => {
		return await this._system.getClients(true).toPromise()
	}

	public getAdAccounts = async () => {
		return this._graph.getAdAccounts()
			.then(response => {
				this.adAccounts = response
			})
			.catch(err => { throw new Error(err) })
	}

	public getCampaigns = async ($adAccountID = this.adAccountID, $nextToken = this.nextCampaignsToken) => {
		this.adAccountID = $adAccountID
		this._graph.getAdAccountCampaigns($adAccountID, $nextToken)
			.then(response => {
				response.campaigns.forEach(campaign => {
					this.campaigns.push(campaign)
				})
				this.nextCampaignsToken = response.after
			})
			.catch(reject => {
				throw new Error(reject)
			})
	}

	public loadmore($adAccountID ,$nextToken) {
		this.getCampaigns($adAccountID, $nextToken)
	}

	ngOnInit() {
		this.getAdAccounts()
		Promise
			.all([this.getClients(), this.getFBPages()])
			.then(response => {
				this.clients = response[0]
				this.FBPages = response[1]
			})
			.catch(reject => {
				throw new Error(reject)
			})

		this.addPageForm.get('SAVED').valueChanges.subscribe(data => {
			if (data) {
				this.addPageForm.get('NAME').setValue(data.name)
				this.addPageForm.get('ID').setValue(data.id)
			} else {
				throw new Error('Err')
			}
		})

		this.addPageForm.get('CLIENT').valueChanges.subscribe(data => {
			if (data) {
				this._client = data
			} else {
				throw new Error('Err')
			}
		})
	}

	public addPage($formData) {
		if ($formData.valid) {
			const page = $formData.value
			this._system.addPage(page).subscribe(data => {
				let res = JSON.parse(data._body)
				if (res.state) {
					this.dialog.open(AddContractDialog, {
						width: '400px',
						data: { page: res.response, client: this._client }
					})
				} else {
					throw new Error(res.resposne)
				}
			})
		} else {
			throw new Error('Form Validation Failed')
		}
	}

	public adAccountID
	public adAccounts: any = []
	public campaigns: any = []
	public nextCampaignsToken
	public FBPages: any = []
	public clients: any = []
	public addPageForm: FormGroup
	private _client: any
	private _page: any
	public addPageFormBuilder() {
		this.addPageForm = this._fb.group({
			SAVED: [null],
			NAME: [null, Validators.required],
			ID: [null, Validators.required],
			CLIENT: [null, Validators.required],
			CAMPAIGN_ID: [null, Validators.required]
		})
	}

	public onNoClick(): void {
		this.dialogRef.close()
	}

}