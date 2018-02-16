
export class Contract {

    public CLIENT: string
    public PACKAGE: string
    public PAGE: String
    public CREATE_TIME: Date
    public START_TIME: Date
    public RENEWAL_TIME: Date

    constructor(obj?: any) {
        this.CLIENT         = obj && obj.CLIENT
        this.PACKAGE        = obj && obj.PACKAGE
        this.PAGE           = obj && obj.PAGE
        this.CREATE_TIME    = obj && new Date()
        this.START_TIME     = obj && obj.START_TIME
        this.RENEWAL_TIME   = obj && obj.RENEWAL_TIME
    }
}