export class Task {

	public NAME: string
	public DESCRIPTION: string
	public TEAM: any
	public PAGE: any
	public START_TIME: Date
	public DEAD_LINE: Date

	constructor(obj?: any) {
		this.NAME = obj && obj.NAME
		this.DESCRIPTION = obj && obj.DESCRIPTION
		this.TEAM = obj && Object.keys(obj.TEAM)
		this.PAGE = obj && obj.PAGE
		this.START_TIME = obj && obj.START_TIME
		this.DEAD_LINE = obj && obj.DEAD_LINE
	}
}