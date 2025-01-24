import { Component, DoCheck, Input, OnInit } from '@angular/core';
import { BaseFormCompoent } from '../../../../shared/component/base/base-form.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TrainService } from '../../../train/services/train.service';
import { OptionService } from '../../../../shared/services/option.service';
import { DialogService } from 'primeng/dynamicdialog';
import { LoadingMaskService } from '../../../../core/services/loading-mask.service';
import { SystemMessageService } from '../../../../core/services/system-message.service';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../../../../core/core.module';
import { SharedModule } from '../../../../shared/shared.module';
import { Option } from '../../../../shared/models/option.model';
import { DataType } from '../../../../core/enums/data-type.enum';
import { Subject } from 'rxjs/internal/Subject';
import { TicketBookingComponent } from './ticket-booking/ticket-booking.component';
import { TrainInfoFormComponent } from './train-info-form/train-info-form.component';
import { TrainTicketService } from '../../services/train-ticket.service';
import { firstValueFrom, map } from 'rxjs';
import { StorageService } from '../../../../core/services/storage.service';
import { Router } from '@angular/router';
import { StepQueryKey } from '../../../../core/enums/step-query-key.enum copy';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [CommonModule, SharedModule, CoreModule],
  providers: [DialogService, TrainTicketService],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.scss',
})
export class TicketComponent implements OnInit {
  activeStepIndex: number = 0; // 控制階段

  constructor(private storageService: StorageService, private router: Router) {}

  ngOnInit() {
    this.activeStepIndex = Number(
      this.storageService.getSessionStorageItem('step')
    );
    console.log(this.activeStepIndex);
  }

  query() {}

  clear() {}

  /**
   * 切換 Step
   * @param event
   */
  onStepChange(event: any): void {
    console.log('Active step changed to:', event);
    this.storageService.setSessionStorageItem('step', event);
    this.activeStepIndex = event;

    // 當點擊 step 1
    if (this.activeStepIndex === 0) {
      this.router.navigate(['/ticket/train-info']);
      // 當點擊 step 2
    } else if (this.activeStepIndex === 1) {
      let queryParam = this.storageService.getSessionStorageItem(
        StepQueryKey.STEP2
      );

      // 如果 Session Storage 有 queryParam 資料，代表要從其他 Step 切回 Step2
      if (queryParam) {
        this.router.navigate(['/ticket/ticket-booking/'], {
          queryParams: this.parseQueryString(queryParam),
        });
      }
    }
  }

  /**
   * 將 queryParam 字串轉換為 queryParam
   * @param queryString
   */
  parseQueryString(queryString: string): any {
    const params: any = {};
    const searchParams = new URLSearchParams(queryString);

    searchParams.forEach((value, key) => {
      params[key] = value; // 將 key 和 value 存入物件
    });

    console.log(params);
    return params;
  }
}
