import { NgModule } from "@angular/core"
import { CommonModule } from '@angular/common'

import {
	MdNativeDateModule, MdProgressSpinnerModule, MdIconModule, MdSelectModule,
	MdDatepickerModule, MdButtonModule, MdSidenavModule, MdInputModule, MatCheckboxModule
} from '@angular/material'

@NgModule({
	imports: [
		MdNativeDateModule, MdProgressSpinnerModule, MdIconModule, MdSelectModule,
		MdDatepickerModule, MdButtonModule, MdSidenavModule, MdInputModule, MatCheckboxModule
	],
	exports: [
		MdNativeDateModule, MdProgressSpinnerModule, MdIconModule, MdSelectModule,
		MdDatepickerModule, MdButtonModule, MdSidenavModule, MdInputModule, MatCheckboxModule
	]
})
export class MaterialModule {

}