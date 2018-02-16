
export class Package {
    
    public NAME: string
    public STATE: boolean
    public REACH: string
    public POSTS: string
    public PRICE: string
    public DESIGNS: string
    public CREATE_TIME: Date

    constructor(obj?:any) {
        this.NAME        = obj && obj.NAME
        this.STATE       = obj && true
        this.REACH       = obj && obj.REACH
        this.POSTS       = obj && obj.POSTS
        this.DESIGNS     = obj && obj.DESIGNS
        this.PRICE       = obj && obj.PRICE
        this.CREATE_TIME = obj && new Date()
    }
}