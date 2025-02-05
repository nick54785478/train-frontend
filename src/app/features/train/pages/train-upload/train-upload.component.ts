import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as XLSX from 'xlsx';
import { SharedModule } from '../../../../shared/shared.module';
import { CoreModule } from '../../../../core/core.module';
import { BaseFormCompoent } from '../../../../shared/component/base/base-form.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseUploadCompoent } from '../../../../shared/component/base/base-upload.component';
import { ExcelData } from '../../../../shared/models/excel-data.model';
import { FileUpload } from 'primeng/fileupload';
import { Option } from '../../../../shared/models/option.model';
import { LoadingMaskService } from '../../../../core/services/loading-mask.service';
import { SystemMessageService } from '../../../../core/services/system-message.service';
import { ExcelFileReaderService } from '../../../../shared/services/excel-file-reader.service';
import { JspreadsheetWrapper } from '../../../../shared/wrapper/jspreadsheet-wrapper';
import jspreadsheet from 'jspreadsheet-ce';

@Component({
  selector: 'app-train-upload',
  standalone: true,
  imports: [CommonModule, SharedModule, CoreModule],
  providers: [],
  templateUrl: './train-upload.component.html',
  styleUrl: './train-upload.component.scss',
})
export class TrainUploadComponent
  extends BaseUploadCompoent
  implements OnInit, AfterViewInit
{
  sheetNameOptions: any[] = [];

  spreadsheet: any;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      fileName: new FormControl('', [Validators.required]),
      sheetName: new FormControl('', Validators.required),
    });
  }

  override ngAfterViewInit(): void {
    setTimeout(() => {
      console.log(this.spreadsheetContainer); // 確保 `ViewChild` 存在
    });
  }

  /**
   * Patch FormGroup 的值
   * @param data
   */
  override patchFormGroupValue(data?: any) {}

  /**
   * 取得 FormControl。
   * @param formControlName formControlNameformControl 的名稱
   * @returns FormControl
   */
  override formControl(formControlName: string): FormControl {
    return this.formGroup.get(formControlName) as FormControl;
  }

  /**
   * 判斷 formControl 欄位是否有錯誤。
   * @param formControlName formControl 的名稱
   * @returns boolean 欄位是否有錯誤
   */
  override formControlInvalid(formControlName: string): boolean {
    const formControl = this.formGroup.get(formControlName);
    if (formControl) {
      return formControl.invalid && (formControl.dirty || this.submitted);
    } else {
      return false;
    }
  }

  /**
   * 處理上傳檔案的解析
   * @param event
   * @param fileNameFormControlName
   * @returns
   */
  override fileUploadHandler(
    event: any,
    fileNameFormControlName: string,
    sheetNameOptions: Option[]
  ): void {
    console.log('fileUploadHandler');

    // 清除檔案預覽
    this.destroyJExcel();

    // 先清除畫面上的訊息，避免錯誤重複或被前一個訊息誤導
    this.messageService.clear();

    this.selectedFile = event.files[0] as File;
    // 檢查檔案大小是否超過上限
    this.fileSizeInvalid = this.excelFileReaderService.fileSizeInvalid(
      this.selectedFile,
      this.maxFileSize
    );
    if (this.fileSizeInvalid) {
      // 如果檔案太大，把檔案名稱寫回欄位，為了消掉必填的驗證
      this.formControl(fileNameFormControlName).patchValue(
        this.selectedFile.name
      );
      sheetNameOptions = [];
      this.formControl(fileNameFormControlName).markAsDirty();
      // 清除檔案選取元件內容，不然不能重選檔案
      this.fileUploadComponent.clear();
      return;
    }

    this.loadingMaskService.show();
    // 讀取檔案內容
    this.excelFileReaderService
      .parseFile(this.selectedFile)
      .then((result) => {
        this.afterFileParseSuccess(result);
        // 把解析後的 XLSX workBook 資料放到全域變數，預覽會用到
        this.workbook = result.workBook;
        this.loadingMaskService.hide();
      })
      .catch((error) => {
        // Handle the error
        this.afterFileParseFail();
        this.messageService.error(error);
      })
      .finally(() => {
        // 清除檔案選取元件內容，不然不能重選檔案
        this.fileUploadComponent.clear();
        this.loadingMaskService.hide();
      });
  }

  /**
   * 清除檔案預覽
   */
  override destroyJExcel(): void {
    this.showPreview = false;
    this.jexcel?.destroy();
  }

  afterFileParseSuccess(result: ExcelData): void {
    // 設定 sheetname 下拉選單
    this.sheetNameOptions = result.sheetNameOptions;

    this.formGroup.patchValue({
      fileName: result.fileName,
      sheetName: result.sheetNameOptions[0].value,
    });
  }

  afterFileParseFail(): void {
    this.sheetNameOptions = [];
    this.formControl('fileName').reset();
    this.formControl('sheetName').reset();
  }

  upload() {}

  /**
   * 預覽功能
   * @param sheetNameFormControlName
   * @returns
   */
  override preview(sheetNameFormControlName: string) {
    console.log('preview');

    // 清除檔案預覽
    this.destroyJExcel();

    if (!sheetNameFormControlName) {
      return;
    }

    this.showPreview = true;

    // 建立 jspreadsheet.JSpreadsheetOptions 物件
    const options: jspreadsheet.JSpreadsheetOptions = {};

    // 把 XLSX.WorkBook 轉成網頁表格 Jspreadsheet CE 的設定 Options
    const jspreadsheetOptions =
      JspreadsheetWrapper.convertWorkbookToJspreadsheetOptions(
        this.workbook!,
        this.formControl(sheetNameFormControlName).getRawValue(), // 要查詢哪一個頁籤的資料
        this.maxRow,
        this.maxColumn
      );

    // 使用 setTimeout 函式將 jexcel 的初始化延遲到下一個JavaScript事件迴圈。
    // 請注意，使用setTimeout的方式可能不是最佳解決方案，但在某些情況下可能能解決異步操作所導致的問題。
    setTimeout(() => {
      console.log(this.spreadsheetContainer);

      // 創建一個新的預覽表格
      this.jexcel = jspreadsheet(
        this.spreadsheetContainer.nativeElement,
        jspreadsheetOptions
      );

      if (this.jexcel) {
        // 把滑鼠右鍵的選單全移除
        this.jexcel.contextMenu.remove();
      }
    }, 100);
  }
}
