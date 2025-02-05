import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { BaseFormCompoent } from '../../../shared/component/base/base-form.component';
import { CoreModule } from '../../../core/core.module';
import { SystemMessageService } from '../../../core/services/system-message.service';
import { environment } from '../../../../environments/environment';
import { CreateMoneyAccountResource } from '../models/create-money-account-resource.model';
import { finalize } from 'rxjs';
import { LoadingMaskService } from '../../../core/services/loading-mask.service';
import { RegisterService } from '../services/register.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [SharedModule, CoreModule],
  providers: [LoadingMaskService, SystemMessageService],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent extends BaseFormCompoent implements OnInit {
  constructor(
    private systemMessageService: SystemMessageService,
    private loadMaskService: LoadingMaskService,
    private registerService: RegisterService
  ) {
    super();
  }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.email]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      birthday: new FormControl('', [Validators.required]),
      nationalId: new FormControl('', [Validators.required]),
      address: new FormControl(''),
      money: new FormControl('', [Validators.required]),
    });
  }

  /**
   * 提交表單資料
   */
  onSubmit() {
    this.submitted = true;
    if (environment.apiMock) {
      this.systemMessageService.success('新增資料成功');
    } else {
      this.submitted = true;
      if (this.formGroup.valid) {
        this.loadMaskService.show();
        // 將表單資料設置進 CreateSetting
        const request: CreateMoneyAccountResource = { ...this.formGroup.value };
        this.registerService
          .create(request)
          .pipe(
            finalize(() => {
              this.loadMaskService.hide();
              this.submitted = false;
            })
          )
          .subscribe({
            next: (res) => {
              if (res.code === 'VALIDATE_FAILED' && res.message) {
                this.systemMessageService.error(res.message);
              } else {
                this.systemMessageService.success(
                  '成功新增一筆帳戶資料 ' +
                    res.username +
                    ' ，餘額:' +
                    res.balance
                );
              }
            },
            error: (error) => {
              this.systemMessageService.error(error.message);
            },
          });
      }
    }
  }

  /**
   * 清空 Form 表單
   */
  clear() {
    this.formGroup.reset();
  }
}
