import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms'
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material'
import { SystemAdminService } from '../../services/system-admin.service'
import { GraphAPIService } from '../../services/graph-api.service'
import { SocketService } from '../../../globals/services/socket.service'
import { Observable, Subscription } from 'rxjs/Rx'

@Component({
	selector: 'app-marketing-tools',
	templateUrl: './marketing-tools.component.html',
	styleUrls: ['./marketing-tools.component.css']
})
export class MarketingToolsComponent implements OnInit {

	constructor(private _fb: FormBuilder,
		public system: SystemAdminService,
		public graph: GraphAPIService,
		private _socket: SocketService) {
		this.pageSelectFormBuilder()
	}

	public getPage($id) {
		this.system.getPage($id)
			.subscribe(
			(data) => {
				this.selectedPage = data.page
				this.pageTasks = data.tasks
				console.log(data)
			},
			(err) => {
				this.failedToGetPage = true
				throw new Error(err)
			},
			() => true)
	}

	public getPages() {
		this.system.getPages()
			.subscribe(
			(data) => {
				this.loadingView = false
				this.pages = data.active.concat(data.suspended)
			},
			(err) => {
				this.failedToGetView = true
				throw new Error(err)
			})
	}

	private _getPageGraphData = async ($pageID, $since, $until) => {
		let pagePosts = await this.graph.getPagePosts($pageID, $since, $until),
			pagePostsInfo = {},
			promises = []

		// Posts Related Data
		pagePosts.forEach(async post => {
			pagePostsInfo[post.id] = {
				id: post.id,
				paidReach: await this.graph.getPagePostPaidReach(post.id),
				totalReach: await this.graph.getPagePostTotalReach(post.id)
			}
		})
		promises.push(pagePostsInfo)

		// Page Related Data
		promises.push({
			pageTotalFeebacks: await this.graph.getPagePostsFeedbacks($pageID, $since, $until),
			pageCTA: await this.graph.getPageCTA($pageID, $since, $until),
			convRate: await this.graph.getPageConversionRate($pageID, $since, $until),
			totalDailyReach: await this.graph.getPageTotalDailyReach($pageID, $since, $until),
			postEngagements: await this.graph.getPagePostEngatements($pageID, $since, $until),
			totalPostsReach: await this.graph.getTotalPostsReach($pageID, $since, $until),
			pageLikes: await this.graph.getPageLikes($pageID, $since, $until),
			totalSpent: await this.graph.getCampaignSpendings(this.selectedPage.CAMPAIGN_ID, $since, $until)
		})

		return Promise
			.all(promises)
			.then(response => {
				console.log(response)
				return response
			})
			.catch(reject => {
				return reject
			})

	}

	ngOnInit() {
		this.pageSelectForm
			.get('pageName')
			.valueChanges
			.subscribe(data => {
				this.getPage(data._id)
				this.selectedPage = data
				console.log(data)
				let since = data.CONTRACTS[data.CONTRACTS.length - 1].START_TIME,
					until = data.CONTRACTS[data.CONTRACTS.length - 1].RENEWAL_TIME

				this._getPageGraphData(data.ID, since, until).then(res => {
					this.postsGraphInfo = Object.values(res[0])
					this.pageGraphInfo = res[1]
				}).catch(reject => {
					throw new Error(reject)
				})

				this.loadingPage = true
			})

		this.getPages()
	}

	public postsGraphInfo: any = []
	public pageGraphInfo: any = {}
	public pages: any[]
	public selectedPage: any
	public pageTasks: any

	public pageSelectForm: FormGroup
	public pageSelectFormBuilder() {
		this.pageSelectForm = this._fb.group({
			pageName: [null]
		})
	}

	public loadingView: Boolean = true
	public failedToGetView: Boolean = false

	public loadingPage: Boolean = false
	public failedToGetPage: Boolean = false
	public pageLoaded: Boolean = false
}
