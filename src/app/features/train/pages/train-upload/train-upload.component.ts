import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { CoreModule } from '../../../../core/core.module';
import { BaseFormCompoent } from '../../../../shared/component/base/base-form.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseUploadCompoent } from '../../../../shared/component/base/base-upload.component';

@Component({
  selector: 'app-train-upload',
  standalone: true,
  imports: [CommonModule, SharedModule, CoreModule],
  templateUrl: './train-upload.component.html',
  styleUrl: './train-upload.component.scss',
})
export class TrainUploadComponent extends BaseUploadCompoent implements OnInit {
  sheetNames: any[] = [];
  constructor() {
    super();
  }
  ngOnInit(): void {
    this.formGroup = new FormGroup({
      fileName: new FormControl('', [Validators.required]),
      sheetName: new FormControl('', Validators.required),
    });
  }

  preview() {
    this.showPreview = true;
  }

  upload() {}
}
