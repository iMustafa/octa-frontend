import { Component, OnInit, Inject } from '@angular/core'
import { Validators, FormBuilder, FormGroup } from '@angular/forms'
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material'
import { SystemAdminService } from '../../../services/system-admin.service'
import { SocketService } from '../../../../globals/services/socket.service'
import { Observable, Subject } from 'rxjs/Rx'

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.css']
})
export class PackagesComponent implements OnInit {

  constructor(public dialog: MdDialog, public system: SystemAdminService, private _socket: SocketService) { }

  public openAddPackageDialog() {
    this.dialog.open(AddPackgeDialog, {
      width: '400px'
    })
  }

  public openUpdatePackageDialog($package) {
    this.dialog.open(PackageEditDialog, {
      width: '400px',
      data: $package
    })
  }

  public updateStatus($id, $state) {
    let update = { STATE: $state }
    this.system.updatePackage($id, update).subscribe(
      (data) => { console.log(data) },
      (err) => { throw new Error(err) },
      () => { return true }
    )
  }

  public getPackages() {
    this.loading = true
    this.system.getPackages().subscribe(
      (response) => {
        let that = this
        this.loading = false
        this.packages = response
      },
      (err) => {
        this.loading = false
        this.failed = true
        throw new Error(err)
      }
    )
  }

  ngOnInit() {
    this.packageAddingObserver = this._socket.observePackageAddittion().subscribe(
      (data) => {
        console.log(data)
      }, (err) => {
        throw new Error(err)
      })
    this.getPackages()
  }

  public packages: any = {
    active: [], suspended: []
  }

  public loading: Boolean = true
  public failed: Boolean = false

  public packageAddingObserver: any
  public packageUpdatingObserver: any

}

@Component({
  template: `
    <h3 class='text-center'>Add Package</h3>
    <div class='alert alert-danger' *ngIf='addFaild'>Failed to add package, please check your connection.</div>
    <form [formGroup]='addPackageForm' (ngSubmit)='submitNewPackage(addPackageForm)'>
      <md-form-field class="col-xs-12">
        <input mdInput formControlName='NAME' placeholder="Package Name">
      </md-form-field>
      <md-form-field class='col-xs-6'>
        <input mdInput formControlName='REACH' placeholder='Reach'> 
      </md-form-field>
      <md-form-field class='col-xs-6'>
        <input mdInput formControlName='POSTS' placeholder='Posts'> 
      </md-form-field>
      <md-form-field class='col-xs-6'>
        <input mdInput formControlName='PRICE' placeholder='Price'> 
      </md-form-field>
      <md-form-field class='col-xs-6'>
        <input mdInput formControlName='DESIGNS' placeholder='Desings'> 
      </md-form-field>
      <div class='text-center'>
        <button md-button type='submit'>Add</button>
      </div>
    </form>
  `,
  styles: [
    "h3 {margin-bottom: 20px}"
  ]
})
export class AddPackgeDialog {

  constructor(
    public dialogRef: MdDialogRef<AddPackgeDialog>,
    public fb: FormBuilder,
    public system: SystemAdminService,
    @Inject(MD_DIALOG_DATA) public data: any) {
    this.addPackageFormBuilder()
  }

  public addPackageForm: FormGroup
  public addFaild: Boolean = false

  public addPackageFormBuilder() {
    this.addPackageForm = this.fb.group({
      NAME: [null, Validators.required],
      REACH: [null, Validators.required],
      POSTS: [null, Validators.required],
      PRICE: [null, Validators.required],
      DESIGNS: [null, Validators.required]
    })
  }

  public submitNewPackage($formData) {
    if ($formData.valid) {
      let newPackage = $formData.value
      this.system.addPackage(newPackage).subscribe(
        (data) => {
          let res = JSON.parse(data._body)
          if (res.state) {
            this.dialogRef.close()
          } else {
            this.addFaild = true
          }
        }, (err) => {
          throw new Error(err)
        }
      )
    } else {
      return false
    }
  }

  public onNoClick(): void {
    this.dialogRef.close()
  }

}

@Component({
  template: `
    <h3 class='text-center'>Edit Package - {{(_package).NAME}}</h3>
    <div class='alert alert-danger' *ngIf='_editFailed'>Failed to add package, please check your connection.</div>
    <form [formGroup]='_editPackageForm' (ngSubmit)='_updatePackageInfo(_editPackageForm)'>
      <md-form-field class="col-xs-12">
        <input mdInput formControlName='NAME' placeholder="Package Name">
      </md-form-field>
      <md-form-field class='col-xs-6'>
        <input mdInput formControlName='REACH' placeholder='Reach'> 
      </md-form-field>
      <md-form-field class='col-xs-6'>
        <input mdInput formControlName='POSTS' placeholder='Posts'> 
      </md-form-field>
      <md-form-field class='col-xs-6'>
        <input mdInput formControlName='PRICE' placeholder='Price'> 
      </md-form-field>
      <md-form-field class='col-xs-6'>
        <input mdInput formControlName='DESIGNS' placeholder='Desings'> 
      </md-form-field>
      <div class='text-center'>
        <button md-button type='submit'>Update</button>
      </div>
    </form>
  `,
  styles: [

  ]
})
export class PackageEditDialog {

  constructor(
    public dialogRef: MdDialogRef<PackageEditDialog>,
    public fb: FormBuilder,
    public system: SystemAdminService,
    @Inject(MD_DIALOG_DATA) public data: any) {
    this._package = data
    this._editPackageFormBuilder()
    this._editPackageForm.patchValue(data)
  }

  private _updatePackageInfo($formData) {
    if ($formData.valid) {
      let packageUpdate = $formData.value,
        packageID = this._package._id
      this.system.updatePackage(packageID, packageUpdate).subscribe(
        (data) => {
          let res = JSON.parse(data._body)
          if (res.state) {
            this.dialogRef.close()
          } else {
            this._editFailed = true
          }
        },
        (err) => { throw new Error(err) },
        () => { return true }
      )
    } else {
      return false
    }
  }

  private _editPackageFormBuilder() {
    this._editPackageForm = this.fb.group({
      NAME: [null, Validators.required],
      REACH: [null, Validators.required],
      POSTS: [null, Validators.required],
      DESIGNS: [null, Validators.required],
      PRICE: [null, Validators.required]
    })
  }

  private _editPackageForm: FormGroup
  private _package
  private _editFailed: Boolean = false
}