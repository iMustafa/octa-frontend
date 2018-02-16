import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms'
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material'
import { SystemAdminService } from '../../../../modules/admin/services/system-admin.service'
import { Observable, Subject } from 'rxjs/Rx'

@Component({
  selector: 'app-tasks-page',
  templateUrl: './tasks-page.component.html',
  styleUrls: ['./tasks-page.component.css']
})
export class TasksPageComponent implements OnInit {

  constructor(public dialog: MdDialog,
		public system: SystemAdminService,
		private _fb: FormBuilder) {
			this.dateRangeFormBuilder()
	}

	public getTasks() {
		this.loading = true
		this.system.getMyData().subscribe(
			(response) => {
				this.loading = false
				this.tasks = response.TASKS
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
