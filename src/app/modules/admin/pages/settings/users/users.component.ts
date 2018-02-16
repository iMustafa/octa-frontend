import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms'
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material'
import { SystemAdminService } from '../../../services/system-admin.service'
import { SocketService } from '../../../../globals/services/socket.service'
import { Observable, Subject } from 'rxjs/Rx'

@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

	constructor(public dialog: MdDialog, public system: SystemAdminService, private _socket: SocketService) { }

	public getUsers() {
		this.system.getUsers().subscribe(
			(response) => {
				this.loading = false
				this.users = response
			},
			(err) => {
				this.loading = false
				this.failed = true
				throw new Error(err)
			}
		)
	}

	public openAddUserForm() {
		this.dialog.open(AddUserDialog, {
			width: '400px'
		})
	}

	public openUpdateUserDialog($user) {
		this.dialog.open(UpdateUserDialog, {
			width: '400px',
			data: $user
		})
	}

	ngOnInit() {
		this.getUsers()
	}

	public users: any

	public loading: Boolean = true
	public failed: Boolean = false

}

@Component({
	template: `
    <h3 class='text-center'>Create User</h3>

    <section *ngIf='_loading' class='loading text-center'>
      <md-spinner></md-spinner>
    </section>

    <div class='alert alert-danger' *ngIf='_editFailed'>Failed to add package, please check your connection.</div>

    <form *ngIf='!_loading && !_failed' [formGroup]='addUserForm' (ngSubmit)='addUser(addUserForm)'>
      <md-form-field class='col-xs-12'>
        <input mdInput formControlName='FULL_NAME' placeholder='Full Name'> 
			</md-form-field>
			<md-form-field class='col-xs-12'>
				<input mdInput formControlName='EMAIL' placeholder="Email">
			</md-form-field>
			<div formArrayName='ROLES' class='col-xs-12' style='margin-bottom: 15px'>
				<div class='col-xs-6' *ngFor='let role of _roles'>
					<md-checkbox [formControlName]='role.TITLE'>
						{{role.TITLE}}
					</md-checkbox>
				</div>
			</div>
      <div class='text-center'>
        <button md-button type='submit'>Create</button>
      </div>
    </form>

    <section *ngIf='_failed' class="failed text-center">
      <h3>
        loading failed, please check your connection and try again.
      </h3>
    </section>
  `,
	styles: [

	]
})
export class AddUserDialog implements OnInit {

	constructor(
		public dialogRef: MdDialogRef<AddUserDialog>,
		public fb: FormBuilder,
		public system: SystemAdminService,
		@Inject(MD_DIALOG_DATA) public data: any) {
		this.addUserFormBuilder()
		this.initRoles()
	}

	public addUserFormBuilder() {
		this.addUserForm = this.fb.group({
			EMAIL: [null, Validators.required],
			FULL_NAME: [null, Validators.required]
		})
	}

	public initRoles() {
		this.system.getSystemRoles()
			.toPromise()
			.then(res => {
				this._roles = res
				let roles = new FormGroup({})
				res.forEach(role => {
					roles.addControl(role.TITLE, new FormControl(false))
				})
				this.addUserForm.addControl('ROLES', <FormGroup>roles)
				this._loading = false
			}).catch(reject => {
				this._failed = true
				throw new Error(reject)
			})
	}

	public addUser($formData) {
		if ($formData.valid) {
			$formData.value.EMAIL = $formData.value.EMAIL.toLowerCase()
			$formData.value.ROLES = this.system.filterObject($formData.value.ROLES)
			this._loading = true
			this.system.addUser($formData.value)
				.toPromise()
				.then(response => {
					this._loading = false
				})
				.catch(reject => {
					throw new Error(reject)
				})
		} else {
			alert('Form Validation Failed')
		}
	}

	ngOnInit() {

	}

	public addUserForm: FormGroup

	private _roles: any = []
	private _failed: Boolean = false
	private _loading: Boolean = true
}
@Component({
	template: `
		<h3 class='text-center' style='margin-bottom: 10px'>Update User - {{_user.FULL_NAME}}</h3>

		<section *ngIf='_loading' class='loading text-center'>
			<md-spinner></md-spinner>
		</section>

		<div class='alert alert-danger' *ngIf='_editFailed'>Failed to add package, please check your connection.</div>

		<form *ngIf='!_loading && !_failed' [formGroup]='updateUserForm' (ngSubmit)='updateUser(updateUserForm)'>
			<md-form-field class='col-xs-12'>
				<input mdInput formControlName='FULL_NAME' placeholder='Full Name'> 
			</md-form-field>
			<md-form-field class='col-xs-12'>
				<input mdInput formControlName='EMAIL' placeholder="Email">
			</md-form-field>
			<md-form-field class='col-xs-12'>
				<input mdInput formControlName='PHONE_NUMBER' placeholder='Phone Number'> 
			</md-form-field>
			<md-form-field class='col-xs-12'>
				<input mdInput formControlName='SALARY' placeholder="Salary">
			</md-form-field>
			<div>
				<md-checkbox formControlName='IS_ADMIN'>Is Admin?</md-checkbox>
			</div>
			<div class='text-center'>
				<button md-button type='submit'>Update</button>
			</div>
		</form>

		<section *ngIf='_failed' class="failed text-center">
			<h3>
				loading failed, please check your connection and try again.
			</h3>
		</section>
	`,
	styles: [

	]
})
export class UpdateUserDialog implements OnInit {
	constructor(
		public dialogRef: MdDialogRef<UpdateUserDialog>,
		public fb: FormBuilder,
		public system: SystemAdminService,
		@Inject(MD_DIALOG_DATA) public data: any) {
		this._user = data
		this.updateUserFormBuilder()
		this.updateUserForm.patchValue(data)
	}

	public updateUser($formData) {
		if ($formData.valid) {
			const user = $formData.value
			this._loading = true
			this.system.updateUser(this._user._id, user)
				.toPromise()
				.then(response => {
					this._loading = false
					this.dialogRef.close(UpdateUserDialog)
				})
				.catch(reject => {
					this._failed = true
					throw new Error(reject)
				})
		} else {
			alert('Form Validation Failed')
		}
	}

	ngOnInit() {
		this.getSystemRoles()
	}

	public updateUserForm: FormGroup
	public updateUserFormBuilder() {
		this.updateUserForm = this.fb.group({
			FULL_NAME: [null, Validators.required],
			EMAIL: [null, Validators.required],
			PHONE_NUMBER: [null],
			SALARY: [null],
			IS_ADMIN: [null]
		})
	}

	private _user: any
	private _roles: any = []
	private _loading: boolean = true
	private _failed: boolean = false

	public getSystemRoles() {
		this.system.getSystemRoles()
			.toPromise()
			.then(response => {
				this._roles = response
				this._loading = false
			})
			.catch(reject => {
				this._failed = true
				throw new Error(reject)
			})
	}
}
