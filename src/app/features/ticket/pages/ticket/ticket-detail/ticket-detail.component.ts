import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseFormTableCompoent } from '../../../../../shared/component/base/base-form-table.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../../shared/shared.module';
import { CoreModule } from '../../../../../core/core.module';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [CommonModule, SharedModule, CoreModule],
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.scss',
})
export class TicketDetailComponent
  extends BaseFormTableCompoent
  implements OnInit
{
  ngOnInit(): void {
    // 初始化表單
    this.formGroup = new FormGroup({
      trainNo: new FormControl(''), // 車次
      trainKind: new FormControl(''), // 車種
      fromStop: new FormControl(''), // 起站
      toStop: new FormControl(''), // 起站
      fromStopTime: new FormControl(''), // 起站
      toStopTime: new FormControl(''), // 起站
      takeDate: new FormControl(''), // 搭乘日期
      price: new FormControl(''), // 搭乘日期
    });

    // 從 state 中取得資料
    const state = history ? history.state : null;
    console.log(state);
    if (state) {
      this.formGroup.patchValue({
        trainNo: state.trainNo,
        trainKind: state.trainKind,
        fromStop: state.fromStop,
        toStop: state.toStop,
        fromStopTime: state.fromStopTime,
        toStopTime: state.toStopTime,
        takeDate: state.takeDate,
        price: state.price,
      });
    }
  }

  submit() {}

  cancel() {}
}
