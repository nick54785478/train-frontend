import { Component, OnInit } from '@angular/core';
import { BaseFormCompoent } from '../../../../../shared/component/base/base-form.component';
import { FormControl, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../../shared/shared.module';
import { CoreModule } from '../../../../../core/core.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-deposit-form',
  standalone: true,
  imports: [CommonModule, SharedModule, CoreModule],
  templateUrl: './deposit-form.component.html',
  styleUrl: './deposit-form.component.scss',
})
export class DepositFormComponent extends BaseFormCompoent implements OnInit {
  constructor(
    private dialogConfig: DynamicDialogConfig,
    public ref: DynamicDialogRef
  ) {
    super();
  }
  ngOnInit(): void {
    // 初始化表單
    this.formGroup = new FormGroup({
      money: new FormControl(''), // 車次
    });
  }
  onSubmit() {}
  onCloseForm() {}
}
