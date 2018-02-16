export class User {

    public EMAIL: string
    public FULL_NAME: string
    public ROLES: any

    constructor(obj?: any) {
				this.FULL_NAME  = obj && obj.FULL_NAME
        this.EMAIL      = obj && obj.EMAIL
        this.ROLES      = obj && Object.keys(obj.ROLES)
    }

}