import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SystemMessageService } from '../../../core/services/system-message.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

/**
 * 定義基礎的 Table 表格 Component
 */
@Component({
  selector: 'app-base-form-compoent',
  standalone: true,
  imports: [],
  providers: [],
  template: '',
})
export abstract class BaseTableCompoent {
  constructor() {}

  /**
   * 動態定義表格欄位參數
   */
  cols: any[] = [];

  /**
   * 表格資料
   */
  tableData: any;

  /**
   * 選擇的 row data
   */
  selectedData: any;

  /**
   * 是否開啟 Dialog
   */
  protected dialogOpened: boolean = false;

  /**
   * 紀錄該筆資料
   * @param rowData 點選的資料
   */
  clickRowActionMenu(rowData: any): void {
    this.selectedData = rowData;
  }
}
