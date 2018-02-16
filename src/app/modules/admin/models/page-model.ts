export class Page {

	public NAME: string
	public ID: string
	public CLIENT: string
	public CAMPAIGN_ID: string

	constructor(obj?: any) {
		this.NAME = obj && obj.NAME
		this.ID = obj && obj.ID
		this.CLIENT = obj && obj.CLIENT
		this.CAMPAIGN_ID = obj && obj.CAMPAIGN_ID
	}
}