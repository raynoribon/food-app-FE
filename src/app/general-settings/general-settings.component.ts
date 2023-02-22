import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { GeneralSettingsService } from '../_services/general-settings.service';

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.css']
})
export class GeneralSettingsComponent implements OnInit {
  pageTitle = 'Update Restaurant | The Food Hub';

  generalForm: FormGroup
  timezoneForm: FormGroup
  socialForm: FormGroup

  selectedImage: ImageSnippet;
  selectedImageBW: ImageSnippet;
  imagePreview: string;
  submitted: boolean = false;
  errorMsg: string;
  successMsg: string;
  fileData: File;

  store: any = [];
  logo: any;
  logobw:any
  store_name: any;
  city:any
  country:any
  phone: any
  email: any
  secphone: any;

  constructor(private generalService: GeneralSettingsService,
    private fb: FormBuilder,
    private title: Title) { }

  ngOnInit(): void {

    //general form
    this.generalForm = this.fb.group({
      store_name:[null],
      logo:[null],
      email:[null],
      phone:[null],
      secondary_phone:[null],
      city:[null],
      country:[null]
    })

    //timezone form
    this.timezoneForm = this.fb.group({
      city:[null],
      country:[null],
      timezone_offset:[null]
    })

    //social form
    this.socialForm = this.fb.group({
      
    })
  }


  processImage(imageID: any) {
    const file: File = imageID.files[0];
    this.fileData = file;
    var fileExtension = '.' + file.name.split('.').pop();

    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.selectedImage = event.target.result;
    });
    reader.readAsDataURL(file);
  }

  processImageBW(imageID: any) {
    const file: File = imageID.files[0];
    this.fileData = file;
    var fileExtension = '.' + file.name.split('.').pop();

    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.selectedImageBW = event.target.result;
    });
    reader.readAsDataURL(file);
  }

}
