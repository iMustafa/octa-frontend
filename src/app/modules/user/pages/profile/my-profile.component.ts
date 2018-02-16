import { Component, OnInit, Inject } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'


@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

	ngOnInit() {

	}

}

