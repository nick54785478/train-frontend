import { Component, OnInit } from '@angular/core';
import { BaseInlineEditeTableCompoent } from '../../../../shared/component/base/base-inline-edit-table.component';
import { Option } from '../../../../shared/models/option.model';
import { FormControl, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { CoreModule } from '../../../../core/core.module';
import { OptionService } from '../../../../shared/services/option.service';
import { DataType } from '../../../../core/enums/data-type.enum';
import { SystemMessageService } from '../../../../core/services/system-message.service';

@Component({
  selector: 'app-train-stops',
  standalone: true,
  imports: [CommonModule, SharedModule, CoreModule],
  providers: [SystemMessageService],
  templateUrl: './train-stops.component.html',
  styleUrl: './train-stops.component.scss',
})
export class TrainStopsComponent
  extends BaseInlineEditeTableCompoent
  implements OnInit
{
  trainNoList: Option[] = []; // Active Flag 的下拉式選單
  stops: Option[] = []; // 車站資料的下拉式選單
  kinds: Option[] = []; // 車種資料的下拉式選單

  constructor(
    private optionService: OptionService,
    private messageService: SystemMessageService
  ) {
    super();
  }

  ngOnInit(): void {
    // 初始化表單
    this.formGroup = new FormGroup({
      trainNo: new FormControl(''), // 車次
      trainKind: new FormControl(''), // 車種
      fromStop: new FormControl(''), // 起站
      toStop: new FormControl(''), // 起站
      takeDate: new FormControl(''), // 搭乘日期
      takeTime: new FormControl(''), // 搭乘時間
    });

    this.optionService.getSettingTypes(DataType.STOP_KIND).subscribe({
      next: (res) => {
        this.stops = res;
      },
      error: (err) => {
        this.messageService.error(err);
      },
    });

    //	 取得火車種類的下拉式選單資料
    this.optionService.getTrainKinds().subscribe({
      next: (res) => {
        this.kinds = res;
      },
      error: (error) => {
        this.messageService.error(
          '取得火車種類的下拉式選單資料時，發生錯誤',
          error.message
        );
      },
    });
  }

  query() {}
}
