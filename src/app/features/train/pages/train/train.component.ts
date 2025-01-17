import { Component, OnInit } from '@angular/core';
import { CoreModule } from '../../../../core/core.module';
import { Option } from '../../../../shared/models/option.model';

import { SharedModule } from '../../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { BaseInlineEditeTableCompoent } from '../../../../shared/component/base/base-inline-edit-table.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OptionService } from '../../../../shared/services/option.service';
import { DataType } from '../../../../core/enums/data-type.enum';
import { SystemMessageService } from '../../../../core/services/system-message.service';
import { TrainService } from '../../services/train.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { BaseHeaderLineTableCompoent } from '../../../../shared/component/base/base-header-line-table.component';
import { LoadingMaskService } from '../../../../core/services/loading-mask.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogFormComponent } from '../../../../shared/component/dialog-form/dialog-form.component';

@Component({
  selector: 'app-train',
  standalone: true,
  imports: [CommonModule, SharedModule, CoreModule],
  providers: [DialogService],
  templateUrl: './train.component.html',
  styleUrl: './train.component.scss',
})
export class TrainComponent
  extends BaseHeaderLineTableCompoent
  implements OnInit
{
  trainNoList: Option[] = []; // Active Flag 的下拉式選單
  stops: Option[] = []; // 車站資料的下拉式選單
  kinds: Option[] = []; // 車種資料的下拉式選單
  protected override lineTableVisibled: boolean = false;

  readonly _destroying$ = new Subject<void>(); // 用來取消訂閱

  //Table Row Actions 選單。
  rowActionMenu: MenuItem[] = [];
  rowCurrentData: any;

  constructor(
    private optionService: OptionService,
    private trainService: TrainService,
    private dialogService: DialogService,
    private loadingMaskService: LoadingMaskService,
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
      takeDate: new FormControl('', [Validators.required]), // 搭乘日期
      takeTime: new FormControl('', [Validators.required]), // 搭乘時間
    });

    this.headerCols = [
      {
        field: 'trainNo',
        header: '車次',
        type: '',
      },
      {
        field: 'kind',
        header: '車種',
        type: '',
      },
      {
        field: 'fromStop',
        header: '起始站',
        type: '',
      },
      {
        field: 'fromStopTime',
        header: '起站到站時間',
        type: '',
      },
      {
        field: 'toStop',
        header: '終點站',
        type: '',
      },
      {
        field: 'toStopTime',
        header: '終點站到站時間',
        type: '',
      },
    ];

    this.lineCols = [
      {
        field: 'seq',
        header: '停靠站排序',
        type: '',
      },
      {
        field: 'stopName',
        header: '站名',
        type: '',
      },
      {
        field: 'stopTime',
        header: '抵達時間',
        type: '',
      },
    ];

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

    //	 取得火車種類的下拉式選單資料
    this.optionService.getTrainNoList().subscribe({
      next: (res) => {
        this.trainNoList = res;
      },
      error: (error) => {
        this.messageService.error(
          '取得火車車次的下拉式選單資料時，發生錯誤',
          error.message
        );
      },
    });
  }

  /**
   * 查詢火車車次資料
   * @returns
   */
  query() {
    this.submitted = true;

    if (!this.submit || this.formGroup.invalid) {
      return;
    }

    this.loadingMaskService.show();
    const formData = this.formGroup.value;
    this.lineTableVisibled = false;
    this.trainService
      .query(
        formData.trainNo,
        formData.trainKind,
        formData.fromStop,
        formData.toStop,
        formData.takeDate,
        formData.takeTime
      )
      .pipe(
        finalize(() => {
          this.loadingMaskService.hide();
          this.submitted = false;
        })
      )
      .subscribe((res) => {
        console.log(res);
        this.headerTableData = res;
      });
  }

  /**
   * Table Action 按鈕按下去的時候要把該筆資料記錄下來。
   * @param rowData 點選的資料
   */
  clickRowActionMenu(rowData: any): void {
    // console.log('clickRowActionMenu rowData = ' + JSON.stringify(rowData));
    this.rowCurrentData = rowData;
    console.log(this.rowCurrentData);

    // 開啟 Dialog
    // this.openFormDialog(FormAction.EDIT, this.rowCurrentData);
  }

  /**
   * 顯示 Stop 詳細資料
   * @param rowData
   */
  showLineTable(event: any) {
    let trainData = event.data;
    this.lineTableVisibled = true;
    this.lineTableData = trainData.stops;
  }

  /**
   * 清除所有資料
   */
  protected override clear(): void {
    this.formGroup.reset();
    this.lineTableData = [];
    this.headerTableData = [];
    this.lineTableVisibled = false;
  }

  // /**
  //  * 開啟 Dialog 表單
  //  * @returns DynamicDialogRef
  //  */
  // openFormDialog(data?: number): DynamicDialogRef {
  //   this.dialogOpened = true;

  //   console.log(data);

  //   const ref = this.dialogService.open(DialogFormComponent, {
  //     header: '角色功能配置',
  //     width: '60%',
  //     contentStyle: { overflow: 'auto' },
  //     baseZIndex: 10000,
  //     maximizable: true,
  //     data: data,
  //     templates: {
  //       content: FunctionsConfigComponent,
  //     },
  //   });
  //   // Dialog 關閉後要做的事情
  //   ref?.onClose
  //     .pipe(takeUntil(this._destroying$))
  //     .subscribe((returnData: any) => {
  //       console.log('關閉 Dialog');
  //       this.dialogOpened = false;
  //     });
  //   return ref;
  // }
}
