import { Injectable } from '@angular/core';
import { Http } from '@angular/http'
import * as path from 'path'
import * as FB from 'fb'

@Injectable()
export class GraphAPIService {

	public getRoute($route, $param = null): string {
		if ($param) {
			return path.join('graph_api', $route, $param)
		} else {
			return path.join('graph_api', $route)
		}
	}

	public handleAPIResponse($response) {
		return JSON.parse($response._body).response
	}

	public datePeriod($startDate, $endDate) {
		var oneDay = 24 * 60 * 60 * 1000
		var firstDate = new Date($startDate)
		var secondDate = new Date($endDate)

		return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)))
	}

	constructor(private http: Http) { }

	public getPageList = async () => {
		const route = this.getRoute('pages')
		return this.http.get(route)
			.toPromise()
			.then(response => this.handleAPIResponse(response))
			.catch(reject => reject)
	}

	public getPagePosts = async ($pageID: string, $since: string, $until: string) => {
		const route = this.getRoute(`page_posts/${$pageID}/${$since}/${$until}`)
		return this.http.get(route)
			.toPromise()
			.then(response => this.handleAPIResponse(response))
			.catch(reject => reject)
	}

	public getPagePostTotalReach = async ($postID: string) => {
		const route = this.getRoute(`post_impressions_unique/${$postID}`)
		return this.http.get(route)
			.toPromise()
			.then(response => this.handleAPIResponse(response))
			.catch(reject => reject)
	}

	public getPagePostPaidReach = async ($postID: string) => {
		const route = this.getRoute(`post_impressions_paid_unique/${$postID}`)
		return this.http.get(route)
			.toPromise()
			.then(response => this.handleAPIResponse(response))
			.catch(reject => reject)
	}

	public getPageTotalDailyReach = async ($pageID: any, $since, $until) => {
		const route = this.getRoute(`page_impressions/${$pageID}/${$since}/${$until}`)
		return this.http.get(route)
			.toPromise()
			.then(response => this.handleAPIResponse(response))
			.catch(reject => reject)
	}

	public getTotalPostsReach = async ($pageID, $since, $until) => {
		const route = this.getRoute(`page_posts_impressions_paid_unique/${$pageID}/${$since}/${$until}`)
		return this.http.get(route)
			.toPromise()
			.then(response => this.handleAPIResponse(response))
			.catch(reject => reject)
	}

	public getPagePostsFeedbacks = async ($pageID, $since, $until) => {
		const route = this.getRoute(`page_positive_feedback_by_type/${$pageID}/${$since}/${$until}`)
		return this.http.get(route)
			.toPromise()
			.then(response => this.handleAPIResponse(response))
			.catch(reject => reject)
	}

	public getPageCTA = async ($pageID, $since, $until) => {
		const route = this.getRoute(`page_total_actions/${$pageID}/${$since}/${$until}`)
		return this.http.get(route)
			.toPromise()
			.then(response => this.handleAPIResponse(response))
			.catch(reject => reject)
	}

	public getPageLikes = async ($pageID, $since, $until) => {
		const route = this.getRoute(`page_fan_adds/${$pageID}/${$since}/${$until}`)
		return this.http.get(route)
			.toPromise()
			.then(response => this.handleAPIResponse(response))
			.catch(reject => reject)
	}

	public getPagePostEngatements = async ($pageID, $since, $until) => {
		const route = this.getRoute(`page_post_engagements/${$pageID}/${$since}/${$until}`)
		return this.http.get(route)
			.toPromise()
			.then(response => this.handleAPIResponse(response))
			.catch(reject => reject)
	}

	public getAdAccounts = async () => {
		const route = this.getRoute(`adaccounts`)
		return this.http.get(route)
			.toPromise()
			.then(response => this.handleAPIResponse(response))
			.catch(reject => reject)
	}

	public getAdAccountCampaigns = async ($accID, $nextToken = false) => {
		const route = $nextToken ? this.getRoute(`campaigns/${$accID}/${$nextToken}`) : this.getRoute(`campaigns/${$accID}`)
		console.log(route)
		return this.http.get(route)
			.toPromise()
			.then(response => this.handleAPIResponse(response))
			.catch(reject => reject)
	}

	public getCampaignSpendings = async ($camID, $since, $until) => {
		const route = this.getRoute(`campiagn_spent/${$camID}/${$since}/${$until}`)
		return this.http.get(route)
			.toPromise()
			.then(response => this.handleAPIResponse(response))
			.catch(reject => reject)
	}

	public getPageConversionRate = async ($pageID, $since, $until) => {

	}

}
