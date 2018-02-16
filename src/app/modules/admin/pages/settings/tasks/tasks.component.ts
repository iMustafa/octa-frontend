import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms'
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material'
import { SystemAdminService } from '../../../services/system-admin.service'
import { SocketService } from '../../../../globals/services/socket.service'
import { Observable, Subject } from 'rxjs/Rx'

@Component({
	selector: 'admin-tasks',
	templateUrl: `./tasks.component.html`,
	styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

	constructor(public dialog: MdDialog,
		public system: SystemAdminService,
		private _fb: FormBuilder,
		private _socket: SocketService) {
			this.dateRangeFormBuilder()
	}

	public getTasks() {
		this.loading = true
		this.system.getTasks().subscribe(
			(response) => {
				this.loading = false
				this.tasks = response
			},
			(err) => {
				this.loading = false
				this.failed = true
				throw new Error(err)
			}
		)
	}

	public getTasksByDateRange($formData) {
		if ($formData.valid) {
			const { TIME } = $formData.value,
				{ SINCE } = $formData.value,
				{ UNTIL } = $formData.value

			this.system.getTasksByDateRange(TIME, SINCE, UNTIL)
				.toPromise()
				.then(response => {
					this.tasks = response
				})
				.catch(reject => {
					console.log(reject)
				})
		} else {
			alert('Invalid Period Selected')
		}
	}

	ngOnInit() {
		this.getTasks()
	}

	public changeTaskState($task) {
		const state = !$task.STATE
		this.system.changeTaskState($task._id, state)
			.toPromise()
			.then(res => { return true })
			.catch(rej => { throw new Error(rej) })
	}

	public openAddTaskForm() {
		this.dialog.open(AddTaskDialog, {
			width: '800px'
		})
	}

	public openUpdateTaskDialog($task) {
		this.dialog.open(UpdateTaskDialog, {
			width: '400px',
			data: $task
		})
	}

	public dateRangeForm: FormGroup
	public dateRangeFormBuilder() {
		this.dateRangeForm = this._fb.group({
			TIME: [null, Validators.required],
			SINCE: [null, Validators.required],
			UNTIL: [null]
		})
	}

	public tasks: any

	public loading: Boolean = true
	public failed: Boolean = false

}

@Component({
	template: `
	<h3 class='text-center'>Add Task</h3>
	
			<section *ngIf='_loading' class='loading text-center'>
				<md-spinner></md-spinner>
			</section>
	
			<div class='alert alert-danger' *ngIf='_editFailed'>Failed to add package, please check your connection.</div>
	
			<form *ngIf='!_loading && !_failed' [formGroup]='_addTaskForm' (ngSubmit)='_addTaskFormSubmit(_addTaskForm)'>
				<md-form-field class='col-xs-6'>
					<input mdInput formControlName='NAME' placeholder='Name'> 
				</md-form-field>
				<md-select style='margin-bottom: 15px' placeholder="Page" formControlName='PAGE' class='col-xs-6'>
					<md-option *ngFor="let page of _pages" [value]="page._id">
						{{ page.NAME }}
					</md-option>
				</md-select>
				<md-form-field class='col-xs-12'>
					<input mdInput formControlName='DESCRIPTION' placeholder="Description">
				</md-form-field>
				<md-form-field class="col-xs-6">
					<input mdInput formControlName='START_TIME' [mdDatepicker]="START_TIME_PICKER" placeholder="Start Date">
					<md-datepicker-toggle mdSuffix [for]="START_TIME_PICKER"></md-datepicker-toggle>
					<md-datepicker #START_TIME_PICKER></md-datepicker>
				</md-form-field>
				<md-form-field class="col-xs-6">
					<input mdInput formControlName='DEAD_LINE' [mdDatepicker]="DEAD_LINE_PICKER" placeholder="Dead Line">
					<md-datepicker-toggle mdSuffix [for]="DEAD_LINE_PICKER"></md-datepicker-toggle>
					<md-datepicker #DEAD_LINE_PICKER></md-datepicker>
				</md-form-field>
				<div class='clearfix'></div>
				<hr>
				<md-form-field class='col-xs-12'>
					<input mdInput #filter placeholder="Filter Team..." (keyup)='_filterUsers(filter.value)'>
				</md-form-field>	
				<div formGroupName='TEAM' class='col-xs-12' style='margin-bottom: 15px'>
					<div class='col-xs-6' *ngFor='let user of _filteredUsers'>
						<md-checkbox [formControlName]='user._id'>
							{{user.FULL_NAME}}
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
export class AddTaskDialog implements OnInit {

	constructor(
		public dialogRef: MdDialogRef<AddTaskDialog>,
		public fb: FormBuilder,
		public system: SystemAdminService,
		@Inject(MD_DIALOG_DATA) public data: any) {
		this._addTaskFormBuilder()
		let inits = [this._initPages(), this._initUsers()]
			
		Promise.all(inits)
			.then(res => { this._loading = false })
			.catch(reject => { this._failed = true })
	}

	private _addTaskFormBuilder() {
		this._addTaskForm = this.fb.group({
			NAME: [null, Validators.required],
			DESCRIPTION: [null, Validators.required],
			START_TIME: [null, Validators.required],
			DEAD_LINE: [null, Validators.required],
			PAGE: [null, Validators.required]
		})
	}

	private _addTaskFormSubmit($formData) {
		if ($formData.valid) {
			$formData.value.TEAM = this.system.filterObject($formData.value.TEAM)
			this._loading = true
			this.system.addTask($formData.value)
				.toPromise()
				.then(response => {
					this._loading = false
				})
				.catch(reject => {
					this._failed = true
					throw new Error(reject)
				})
		} else {
			alert('Form Validation Failed')
		}
	}

	private _filterUsers($name) {
		if ($name.replace(/\s/g, '').length == 0) {
			this._filteredUsers = this._users
		} else {
			this._filteredUsers = this._users.filter(user => {
				return user.FULL_NAME.startsWith($name)
			})
		}
	}

	private _initUsers() {
		return this.system.getUsers()
			.toPromise()
			.then(res => {
				this._filteredUsers = this._users = res.active
				let users = new FormGroup({})
				this._filteredUsers.forEach(user => {
					users.addControl(user._id, new FormControl(false))
				})
				this._addTaskForm.addControl('TEAM', <FormGroup>users)
			})
			.catch(reject => {
				this._failed = true
				throw new Error(reject)
			})
	}

	private _initPages() {
		return this.system.getPages()
			.toPromise()
			.then(res => { this._pages = res.active })
			.catch(reject => {
				this._failed = true
				throw new Error(reject)
			})
	}

	ngOnInit() {

	}

	private _pages: any = []
	private _users: any = []
	private _filteredUsers: any = []
	private _addTaskForm: FormGroup
	private _failed: Boolean = false
	private _loading: Boolean = true

}

@Component({
	template: `
	
	`,
	styles: [

	]
})
export class UpdateTaskDialog implements OnInit {

	constructor(
		public dialogRef: MdDialogRef<UpdateTaskDialog>,
		public fb: FormBuilder,
		public system: SystemAdminService,
		@Inject(MD_DIALOG_DATA) public data: any) {

	}

	ngOnInit() {

	}

}