export class Client {

    public FULL_NAME: string
    public EMAIL: string
    public PHONE_NUMBER: string
    public FACEBOOK_PAGES: any[]
    public CREATE_TIME: Date

    constructor(obj?: any) {
        this.FULL_NAME      = obj && obj.FULL_NAME
        this.EMAIL          = obj && obj.EMAIL
        this.PHONE_NUMBER   = obj && obj.PHONE_NUMBER
        this.FACEBOOK_PAGES = obj && []
        this.CREATE_TIME    = obj && new Date()
    }
}