import { Component, OnInit } from '@angular/core';
import { BaseFormTableCompoent } from '../../../../shared/component/base/base-form-table.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Option } from '../../../../shared/models/option.model';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { CoreModule } from '../../../../core/core.module';
import { OptionService } from '../../../../shared/services/option.service';
import { DataType } from '../../../../core/enums/data-type.enum';
import { SystemMessageService } from '../../../../core/services/system-message.service';
import { BaseInlineEditeTableCompoent } from '../../../../shared/component/base/base-inline-edit-table.component';

@Component({
  selector: 'app-ticket-creating',
  standalone: true,
  imports: [CommonModule, SharedModule, CoreModule],
  templateUrl: './ticket-creating.component.html',
  styleUrl: './ticket-creating.component.scss',
})
export class TicketCreatingComponent
  extends BaseInlineEditeTableCompoent
  implements OnInit
{
  trainNos: Option[] = [];
  stops: Option[] = [];
  constructor(
    private optionService: OptionService,
    private messageService: SystemMessageService
  ) {
    super();
  }
  ngOnInit(): void {
    // 初始化表單
    this.formGroup = new FormGroup({
      trainNo: new FormControl('', [Validators.required]), // 車次
      fromStop: new FormControl('', [Validators.required]), // 起站
      toStop: new FormControl('', [Validators.required]), // 迄站
      price: new FormControl('', [Validators.required]), //
    });

    this.optionService.getSettingTypes(DataType.STOP_KIND).subscribe({
      next: (res) => {
        this.stops = res;
      },
      error: (err) => {
        this.messageService.error(err);
      },
    });

    this.optionService.getTrainNoList().subscribe({
      next: (res) => {
        this.trainNos = res;
      },
      error: (err) => {
        this.messageService.error(err);
      },
    });
  }

  override submit() {}

  override clear() {
    this.formGroup.reset();
  }
}
