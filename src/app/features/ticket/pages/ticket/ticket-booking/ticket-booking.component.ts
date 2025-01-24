import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../../../../../core/core.module';
import { SharedModule } from '../../../../../shared/shared.module';
import { BaseTableCompoent } from '../../../../../shared/component/base/base-table.component';
import { TrainTicketService } from '../../../services/train-ticket.service';
import { SystemMessageService } from '../../../../../core/services/system-message.service';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { map } from 'rxjs/internal/operators/map';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { Subscription } from 'rxjs/internal/Subscription';
import { ActivatedRoute } from '@angular/router';
import { NavigateService } from '../../../../../core/services/navigate.service';
import { StorageService } from '../../../../../core/services/storage.service';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { StepQueryKey } from '../../../../../core/enums/step-query-key.enum copy';

@Component({
  selector: 'app-ticket-booking',
  standalone: true,
  imports: [CommonModule, SharedModule, CoreModule],
  providers: [DialogService, TrainTicketService, NavigateService],
  templateUrl: './ticket-booking.component.html',
  styleUrl: './ticket-booking.component.scss',
})
export class TicketBookingComponent
  extends BaseTableCompoent
  implements OnInit, OnDestroy
{
  // 訂閱
  subscription: Subscription = new Subscription();
  receivedData: any;
  private readonly _destroying$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private trainTicketService: TrainTicketService,
    private messageService: SystemMessageService,
    private storageService: StorageService
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
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
        header: '起始站',
        type: '',
      },
      {
        field: 'fromStopTime',
        header: '起站發車時間',
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

  query() {}

  clear() {}

  override clickRowActionMenu(rowData: any) {
    this.selectedData = rowData;
    console.log(rowData);
  }
}
