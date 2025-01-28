import { Component, DoCheck, OnInit } from '@angular/core';
import { CoreModule } from '../../../../core/core.module';
import { SharedModule } from '../../../../shared/shared.module';
import { BaseFormCompoent } from '../../../../shared/component/base/base-form.component';
import { BaseFormTableCompoent } from '../../../../shared/component/base/base-form-table.component';
import { FormControl, FormGroup } from '@angular/forms';
import { MoneyAccountQueriedResource } from '../../models/money-account-queried-resource.model';
import { Observable } from 'rxjs/internal/Observable';
import { AccountService } from '../../services/account.service';
import { StorageService } from '../../../../core/services/storage.service';
import { finalize, firstValueFrom, lastValueFrom, map, of } from 'rxjs';
import { LoadingMaskService } from '../../../../core/services/loading-mask.service';
import { SystemStorageKey } from '../../../../core/enums/system-storage.enum';
import { SystemMessageService } from '../../../../core/services/system-message.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [SharedModule, CoreModule],
  providers: [LoadingMaskService, AccountService],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent extends BaseFormTableCompoent implements OnInit {
  account!: any;

  mode: string = '';

  tableVisible: boolean = false;

  constructor(
    private accountService: AccountService,
    private loadingMaskService: LoadingMaskService,
    private messageService: SystemMessageService,
    private storageService: StorageService
  ) {
    super();
  }
  async ngOnInit(): Promise<void> {
    // 初始化表單
    this.formGroup = new FormGroup({
      username: new FormControl(''),
      name: new FormControl(''),
      email: new FormControl(''),
      balance: new FormControl(''),
    });

    const username = await firstValueFrom(
      of(
        this.storageService.getLocalStorageItem(SystemStorageKey.USERNAME) ||
          this.storageService.getSessionStorageItem(SystemStorageKey.USERNAME)
      )
    );

    if (username) {
      this.account = await lastValueFrom(
        this.queryAccount(username).pipe(
          map((res) => {
            if (res.code === 'VALIDATION_EXCEPTION' && res?.message) {
              this.messageService.error(res?.message);
            }
            return res;
          })
        )
      );
      this.tableData = await lastValueFrom(
        this.accountService.getBooking(username).pipe(
          map((res) => {
            return res.bookedDatas;
          })
        )
      );
    }

    this.cols = [
      {
        field: 'number',
        header: '車次',
      },
      {
        field: 'kind',
        header: '火車種類',
      },
      {
        field: 'carNo',
        header: '車廂',
      },
      {
        field: 'seatNo',
        header: '座位',
      },
      {
        field: 'from',
        header: '起站',
      },
      {
        field: 'startTime',
        header: '發車時間',
      },
      {
        field: 'to',
        header: '迄站',
      },
      {
        field: 'takeDate',
        header: '乘車日期',
      },
    ];

    this.formGroup.patchValue({
      username: this.account.username,
      name: this.account.name,
      email: this.account.email,
      balance: this.account.balance,
    });
  }

  /**
   * 取得該使用者儲值帳戶資料
   * @param username
   * @returns
   */
  queryAccount(username: string): Observable<MoneyAccountQueriedResource> {
    return this.accountService.getAccountData(username).pipe(
      map((res) => {
        return res;
      })
    );
  }

  /**
   * 查詢該使用者的訂票資訊
   *
   * @param username
   */
  queryBooking(username: string) {
    return this.accountService.getBooking(username).pipe(
      map((res) => {
        return res;
      })
    );
  }

  /**
   * 顯示訂票資料
   */
  onToggleTable() {
    this.tableVisible = !this.tableVisible;
  }
}
