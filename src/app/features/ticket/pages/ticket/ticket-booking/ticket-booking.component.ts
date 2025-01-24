import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../../../../../core/core.module';
import { SharedModule } from '../../../../../shared/shared.module';
import { BaseTableCompoent } from '../../../../../shared/component/base/base-table.component';
import { TrainTicketService } from '../../../services/train-ticket.service';
import { SystemMessageService } from '../../../../../core/services/system-message.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { ActivatedRoute } from '@angular/router';
import { NavigateService } from '../../../../../core/services/navigate.service';
import { StorageService } from '../../../../../core/services/storage.service';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { StepQueryKey } from '../../../../../core/enums/step-query-key.enum copy';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseFormTableCompoent } from '../../../../../shared/component/base/base-form-table.component';

@Component({
  selector: 'app-ticket-booking',
  standalone: true,
  imports: [CommonModule, SharedModule, CoreModule],
  providers: [DialogService, TrainTicketService, NavigateService],
  templateUrl: './ticket-booking.component.html',
  styleUrl: './ticket-booking.component.scss',
})
export class TicketBookingComponent
  extends BaseFormTableCompoent
  implements OnInit, OnDestroy
{
  // 訂閱
  private readonly _destroying$ = new Subject<void>();

  detailVisible: boolean = false;

  rowSelected: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private trainTicketService: TrainTicketService,
    private messageService: SystemMessageService,
    private storageService: StorageService
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    // 初始化表單
    this.formGroup = new FormGroup({
      trainNo: new FormControl(''), // 車次
      trainKind: new FormControl(''), // 車種
      fromStop: new FormControl(''), // 起站
      toStop: new FormControl(''), // 起站
      takeDate: new FormControl(''), // 搭乘日期
      fromStopTime: new FormControl(''), // 發車時間
      seatNo: new FormControl('', [Validators.required]), // 座位編號
    });

    this.cols = [
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
        header: '起站',
        type: '',
      },
      {
        field: 'fromStopTime',
        header: '起站抵達時間',
        type: '',
      },
      {
        field: 'toStop',
        header: '迄站',
        type: '',
      },
      {
        field: 'toStopTime',
        header: '迄站抵達時間',
        type: '',
      },
    ];

    // 從 URL 的 queryParam 取得查詢條件
    this.route.queryParams.subscribe(async (params) => {
      let trainNo = params['trainNo'] || '';
      let trainKind = params['trainKind'] || ''; // 將字串轉為數字
      let fromStop = params['fromStop'] || '';
      let toStop = params['toStop'] || '';
      let takeDate = params['takeDate'] || '';
      let takeTime = params['takeTime'] || '';

      // 將 queryParam 轉換為字串存入 Session Storage
      const searchParams = new URLSearchParams(params).toString();
      this.storageService.setSessionStorageItem(
        StepQueryKey.STEP2,
        searchParams
      );

      this.tableData = await firstValueFrom(
        this.trainTicketService
          .query(trainNo, trainKind, fromStop, toStop, takeDate, takeTime)
          .pipe(takeUntil(this._destroying$))
      );
    });
  }

  ngOnDestroy(): void {}

  /**
   * 提交訂單
   */
  submit() {
    this.submitted = true;
    if (this.submitted || this.formGroup.invalid) {
      return;
    }
    // 執行後續動作
  }

  // 紀錄該筆資料
  override clickRowActionMenu(rowData: any) {
    // if (this.selectedData && this.rowSelected) {
    //   return;
    // }
    if (this.selectedData && rowData.uuid === this.selectedData.uuid) {
      // 若 SelectedData 有值 且 uuid 相等 => 代表點選同一筆，即取消該選取
      this.detailVisible = false;
      this.selectedData = null;
    } else {
      this.selectedData = rowData;
      console.log(rowData);
      this.detailVisible = true;
      this.rowSelected = true;
      this.patchFormGroupValue(rowData);
    }
  }

  // Patch FormGroup 的值
  override patchFormGroupValue(data?: any): void {
    console.log(data);
    // this.formGroup.patchValue(data);
    // this.formGroup.reset();
    this.formGroup.patchValue({
      trainNo: data.trainNo, // 角色名稱
      trainKind: data.kind, // 種類
      fromStop: data.fromStop, // 起站
      toStop: data.toStop, // 迄站
      takeDate: data.takeDate, // 搭乘日期
      fromStopTime: data.fromStopTime, // 搭乘時間
    });
  }

  /**
   * 檢查 rowData 的 uuid (唯一值) 是否與 當前 SelectedData 相同
   * @param rowData
   * @returns
   */
  isChecked(rowData: any): boolean {
    // 有選擇的資料 且有進行過 select 動作
    if (!this.selectedData && this.rowSelected === false) {
      return false;
    }

    return this.selectedData && this.selectedData.uuid === rowData.uuid;
  }

  /**
   * 取消選取
   */
  cancel() {
    this.selectedData = null;
    this.rowSelected = false;
    this.detailVisible = false;
  }
}
