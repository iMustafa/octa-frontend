import { Injectable } from '@angular/core'
import { HttpModule, Http } from '@angular/http'
import { Headers, Response, RequestOptions, RequestMethod, URLSearchParams, Request } from '@angular/http'
import { Observable, Subject } from 'rxjs/Rx'
import 'rxjs/add/operator/map'
import { SocketService } from '../../globals/services/socket.service'
import * as path from 'path'

import { Package } from '../models/package-model'
import { Client } from '../models/client-model'
import { Page } from '../models/page-model'
import { Contract } from '../models/contract-model'
import { User } from '../models/user-model'
import { Task } from '../models/task-model'


@Injectable()
export class SystemAdminService {

	public getRoute($route, $param = null): string {
		if ($param) {
			return path.join('system_api', $route, $param)
		} else {
			return path.join('system_api', $route)
		}
	}

	public getDate($dateString): Date {
		return new Date($dateString)
	}

	public getDateDifference($date1, $date2 = new Date()) {
		$date1 = new Date($date1)
		$date2 = new Date($date2)
		let timeDiff = Math.abs($date2.getTime() - $date1.getTime())
		return Math.ceil(timeDiff / (1000 * 3600 * 24))
	}

	// Task Deadline - Start Countdown
	public getTaskMetaData($task) {
		switch ($task.time_frame) {
			case 'in_progress': {
				let { START_TIME } = $task,
					{ DEAD_LINE } = $task,
					message = this.getDateDifference(DEAD_LINE) === 1 ? 'Deadline today' : `Deadline in ${this.getDateDifference(DEAD_LINE)} days`
				$task['message'] = message
				break
			}
			case 'inactive': {
				let { START_TIME } = $task,
					{ DEAD_LINE } = $task
				$task['message'] = `Starts in ${this.getDateDifference(DEAD_LINE, START_TIME)} days`
				break
			}
			case 'late': {
				let { DEAD_LINE } = $task
				$task['message'] = `${this.getDateDifference(DEAD_LINE)} days late`
				break
			}
			case 'done': {
				let { START_TIME } = $task,
					{ DEAD_LINE } = $task
				$task['message'] = `Done on time`
				break
			}
			case 'done_late': {
				let { DONE_TIME } = $task,
					{ DEAD_LINE } = $task
				$task['message'] = `Done ${this.getDateDifference(DEAD_LINE, DONE_TIME)} days late`
				break
			}
		}
		return $task
	}

	// Dual Level Object Into An Array
	public filterTasksObjectIntoAnArray($object) {
		let tasks = []
		for (let key in $object) {
			for (let key2 in $object[key]) {
				$object[key][key2].forEach(element => {
					element['time_frame'] = key2
					tasks.push(this.getTaskMetaData(element))
				})
			}
		}
		return tasks
	}

	public filterObject($obj) {
		for (let key in $obj) { !$obj[key] ? delete $obj[key] : null }
		return $obj
	}

	constructor(private _http: Http, private _socket: SocketService) { }

	// #Ref: system-admin.service#sendRequest()
	public sendRequest($data: any, $url: string, $method: string): Promise<any> {
		const headerObj = { 'Content-Type': 'application/json', 'api_call_token': 'V1' },
			headers: Headers = new Headers(headerObj),
			submitedData: any = $data,
			requestOptions: RequestOptions = new RequestOptions({
				method: $method,
				url: $url,
				headers: headers,
				body: submitedData
			})
		return this._http.request(new Request(requestOptions)).toPromise()
			.then(response => {
				return response
			})
			.catch(reject => {
				return new Error(reject)
			})
	}

	// #Ref: system-admin.service#getPackages()
	public getPackages(): Observable<any> {
		let url = this.getRoute('packages'),
			promise = this.sendRequest(null, url, 'Get')
				.then(response => {
					let res = JSON.parse(response._body)
					if (res.state) {
						return res.response
					} else {
						return new Error(res.error)
					}
				})
				.catch(reject => {
					return reject
				})

		return Observable.fromPromise(promise)
	}

	// #Ref: system-admin.service#getPackage($id)
	public getPackage($id): Observable<any> {
		let url = this.getRoute('package', $id),
			promise = this.sendRequest(null, url, 'Get')
				.then(response => {
					let res = JSON.parse(response)
					if (res.state) {
						return res.response
					} else {
						return new Error(res.error)
					}
				})
				.catch(reject => {
					return new Error(reject)
				})

		return Observable.fromPromise(promise)
	}

	// #Ref: system-admin.service#addPackage()
	public addPackage($package): Observable<any> {
		let url = this.getRoute('package'),
			newPackage = new Package($package),
			promise = this.sendRequest(newPackage, url, 'Put')
				.then(response => {
					// #Emitter: system-admin.service#addPackage()
					this._socket.packageAdded(newPackage)
					return response
				})
				.catch(reject => {
					return new Error(reject)
				})

		return Observable.fromPromise(promise)
	}

	// #Ref: system-admin.service#updatePackage()
	public updatePackage($id, $update): Observable<any> {
		let url = this.getRoute('package', $id),
			promise = this.sendRequest($update, url, 'Post')
				.then(resolve => {
					return resolve
				})
				.catch(reject => {
					return new Error(reject)
				})
		return Observable.fromPromise(promise)
	}

	// #Ref: system-admin.service#getClients()
	public getClients($returnArr = false): Observable<any> {
		let url = this.getRoute('clients'),
			promise = this.sendRequest(null, url, 'Get')
				.then(response => {
					let res = JSON.parse(response._body)
					if (res.state) {
						if ($returnArr) {
							return res.response.active.concat(res.response.suspended)
						} else {
							return res.response
						}
					} else {
						return new Error(res.error)
					}
				})
				.catch(reject => {
					return reject
				})

		return Observable.fromPromise(promise)
	}

	// #Ref: system-admin.service#getClient($id)
	public getClient($id): Observable<any> {
		let url = this.getRoute('clients', $id),
			promise = this.sendRequest(null, url, 'Get')
				.then(response => {
					let res = JSON.parse(response._body)
					if (res.state) {
						return res.response
					} else {
						return new Error(res.error)
					}
				})
				.catch(reject => {
					return reject
				})

		return Observable.fromPromise(promise)
	}

	// #Ref: system-admin.service#addClient($client)
	public addClient($client): Observable<any> {
		let url = this.getRoute('package'),
			newClient = new Client($client),
			promise = this.sendRequest(newClient, url, 'Put')
				.then(response => {
					return response
				})
				.catch(reject => {
					return new Error(reject)
				})

		return Observable.fromPromise(promise)
	}

	// #Ref: system-admin.service#updateClient($id, $client)
	public updateClient($id, $update): Observable<any> {
		let url = this.getRoute('client', $id),
			promise = this.sendRequest($update, url, 'Post')
				.then(resolve => {
					return resolve
				})
				.catch(reject => {
					return new Error(reject)
				})

		return Observable.fromPromise(promise)
	}

	// #Ref: system-admin.service#getPages()
	public getPages($returnArr = false): Observable<any> {
		let url = this.getRoute('pages'),
			promise = this.sendRequest(null, url, 'Get')
				.then(response => {
					let res = JSON.parse(response._body)
					if (res.state) {
						if ($returnArr) {
							return res.response.active.concat(res.response.suspended)
						} else {
							return res.response
						}
					} else {
						return new Error(res.error)
					}
				})
				.catch(reject => {
					return reject
				})

		return Observable.fromPromise(promise)
	}

	// #Ref: system-admin.service#getPage($id)
	public getPage($id): Observable<any> {
		let url = this.getRoute('page', $id),
			promise = this.sendRequest(null, url, 'Get')
				.then(response => {
					let res = JSON.parse(response._body)
					if (res.state) {
						return res.response
					} else {
						return new Error(res.error)
					}
				})
				.catch(reject => {
					return reject
				})

		return Observable.fromPromise(promise)
	}

	// #Ref: system-admin.service#addPage($page)
	public addPage($page): Observable<any> {
		let url = this.getRoute('page'),
			newPage = new Page($page),
			promise = this.sendRequest(newPage, url, 'Put')
				.then(response => {
					return response
				})
				.catch(reject => {
					return new Error(reject)
				})

		return Observable.fromPromise(promise)
	}

	// #Ref: system-admin.service#updatePage($id, $update)
	public updatePage($id, $update): Observable<any> {
		let url = this.getRoute('page', $id),
			promise = this.sendRequest($update, url, 'Post')
				.then(resolve => {
					return resolve
				})
				.catch(reject => {
					return new Error(reject)
				})

		return Observable.fromPromise(promise)
	}

	// #Ref: system-admin.service#getContracts()
	public getContracts(): Observable<any> {
		let url = this.getRoute('contracts'),
			promise = this.sendRequest(null, url, 'Get')
				.then(response => {
					let res = JSON.parse(response._body)
					if (res.state) {
						return res.response
					} else {
						return new Error(res.error)
					}
				})
				.catch(reject => {
					return reject
				})

		return Observable.fromPromise(promise)
	}

	// #Ref: system-admin.service#getContract($id)
	public getContract($id): Observable<any> {
		let url = this.getRoute('contract', $id),
			promise = this.sendRequest(null, url, 'Get')
				.then(response => {
					let res = JSON.parse(response._body)
					if (res.state) {
						return res.response
					} else {
						return new Error(res.error)
					}
				})
				.catch(reject => {
					return reject
				})

		return Observable.fromPromise(promise)
	}

	// #Ref: system-admin.service#addContract($contract)
	public addContract($contract): Observable<any> {
		let url = this.getRoute('contract'),
			newContract = new Contract($contract),
			promise = this.sendRequest(newContract, url, 'Put')
				.then(response => {
					return response
				})
				.catch(reject => {
					return new Error(reject)
				})

		return Observable.fromPromise(promise)
	}

	// #Ref: system-admin.service#updateContract($id, $update)
	public updateContract($id, $update): Observable<any> {
		let url = this.getRoute('contract', $id),
			promise = this.sendRequest($update, url, 'Post')
				.then(resolve => {
					return resolve
				})
				.catch(reject => {
					return new Error(reject)
				})

		return Observable.fromPromise(promise)
	}

	public getMyData(): Observable<any> {
		let url = this.getRoute('me'),
			promise = this.sendRequest(null, url, 'Get')
				.then(response => {
					let res = JSON.parse(response._body)
					if (res.state) {
						return res.response
					} else {
						return new Error(res.error)
					}
				})
				.catch(reject => {
					return reject
				})

		return Observable.fromPromise(promise)
	}

	// #Ref: system-admin.service#getUsers()
	public getUsers(): Observable<any> {
		let url = this.getRoute('users'),
			promise = this.sendRequest(null, url, 'Get')
				.then(response => {
					let res = JSON.parse(response._body)
					if (res.state) {
						return res.response
					} else {
						return new Error(res.error)
					}
				})
				.catch(reject => {
					return reject
				})

		return Observable.fromPromise(promise)
	}

	public addUser($user): Observable<any> {
		const newUser = new User($user)
		let url = this.getRoute('user'),
			promise = this.sendRequest(newUser, url, 'Put')
				.then(response => {
					let res = JSON.parse(response._body)
					if (res.state) {
						return res.response
					} else {
						return new Error(res.error)
					}
				})
				.catch(reject => {
					return reject
				})
		return Observable.fromPromise(promise)
	}

	public updateUser($id, $update): Observable<any> {
		let url = this.getRoute('user', $id),
			promise = this.sendRequest($update, url, 'Post')
				.then(resolve => {
					return resolve
				})
				.catch(reject => {
					return new Error(reject)
				})

		return Observable.fromPromise(promise)
	}

	public getTasks(): Observable<any> {
		let url = this.getRoute('tasks'),
			promise = this.sendRequest(null, url, 'Get')
				.then(response => {
					let res = JSON.parse(response._body)
					if (res.state) {
						return this.filterTasksObjectIntoAnArray(res.response)
					} else {
						return new Error(res.error)
					}
				})
				.catch(reject => {
					return new Error(reject)
				})

		return Observable.fromPromise(promise)
	}

	public changeTaskState($taskID, $state): Observable<any> {
		let url = this.getRoute('task', $taskID),
			query = {
				STATE: $state,
				DONE_TIME: $state ? new Date() : null
			},
			promise = this.sendRequest(query, url, 'post')
				.then(response => {
					let res = JSON.parse(response._body)
					if (res.state) {
						return res.response
					} else {
						return new Error(res.error)
					}
				})
				.catch(reject => {
					return new Error(reject)
				})

		return Observable.fromPromise(promise)
	}

	public getTasksByDateRange($time, $since, $until): Observable<any> {
		const since = new Date($since).getTime(),
			until = new Date($until).getTime()
		let url = this.getRoute(`tasks/filter/${$time}/${since}/${until}`);
		console.log(url)
		let promise = this.sendRequest(null, url, 'Get')
			.then(response => {
				let res = JSON.parse(response._body)
				if (res.state) {
					return res.response
				} else {
					return new Error(res.error)
				}
			})
			.catch(reject => {
				return new Error(reject)
			})
		return Observable.fromPromise(promise)
	}

	public addTask($taskData): Observable<any> {
		let url = this.getRoute('task'),
			task = new Task($taskData),
			promise = this.sendRequest(task, url, 'Put')
				.then(response => {
					let res = JSON.parse(response._body)
					if (res.state) {
						return res.response
					} else {
						return new Error(res.error)
					}
				})
				.catch(reject => {
					return new Error(reject)
				})
		return Observable.fromPromise(promise)
	}

	public getSystemRoles(): Observable<any> {
		let url = this.getRoute('roles'),
			promise = this.sendRequest(null, url, 'Get')
				.then(response => {
					let res = JSON.parse(response._body)
					if (res.state) {
						return res.response.ROLES
					} else {
						return new Error(res.error)
					}
				})
				.catch(reject => {
					return reject
				})
		return Observable.fromPromise(promise)
	}

}
