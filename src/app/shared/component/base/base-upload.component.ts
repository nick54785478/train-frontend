import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import * as jspreadsheet from 'jspreadsheet-ce';
import { FileUpload } from 'primeng/fileupload';

/**
 * 定義基礎的 Form 表單 Component
 */
@Component({
  selector: 'app-base-form-compoent',
  standalone: true,
  imports: [],
  providers: [],
  template: '',
})
export abstract class BaseUploadCompoent {
  /**
   * 選取的檔案。
   */
  selectedFile: File | undefined;

  /**
   * 檔案大小上限: 多少 MB。
   * 預設是 30 MB，可以 override 這個自行定義大小。
   */
  maxFileSize: number = 30;

  /**
   * 預覽時呈現的欄位數上限。
   * 預設是 50，可以 override 這個自行定義大小。
   * 數字越大會影響到效能。
   */
  maxColumn: number = 50;

  /**
   * 檔案是否超過大小上限。
   */
  fileSizeInvalid: boolean = false;

  /**
   * 檔案解析出來的 WorkBook 內容。
   */
  workbook: XLSX.WorkBook | undefined;

  /**
   * 定義 Form Group
   * */
  protected formGroup!: FormGroup;

  /**
   * 是否顯示預覽 panel
   */
  showPreview: boolean = false;

  /**
   * 用於 Submit 用
   */
  protected submitted: boolean = false;

  /**
   * 表單動作
   */
  protected formAction!: string;

  /**
   * 預覽時呈現的列數上限。
   * 預設是 50，可以 override 這個自行定義大小。
   * 數字越大會影響到效能。
   */
  maxRow: number = 50;

  /**
   * 檔案預覽的物件。
   */
  jexcel: jspreadsheet.JspreadsheetInstance | undefined;

  /**
   * 檔案上傳的元件。
   * 會用 @ViewChild('fileUploadComponent') 去畫面取得上傳的元件。
   */
  @ViewChild('fileUploadComponent') fileUploadComponent!: FileUpload;

  /**
   * 檔案預覽的容器。
   * 會用 @ViewChild('spreadsheet') 去畫面取得上傳的元件。
   */
  @ViewChild('spreadsheet') spreadsheetContainer!: ElementRef;

  constructor() {}

  /**
   * Patch FormGroup 的值
   * @param data
   */
  patchFormGroupValue(data?: any) {}

  /**
   * 取得 FormControl。
   * @param formControlName formControlNameformControl 的名稱
   * @returns FormControl
   */
  formControl(formControlName: string): FormControl {
    return this.formGroup.get(formControlName) as FormControl;
  }

  /**
   * 判斷 formControl 欄位是否有錯誤。
   * @param formControlName formControl 的名稱
   * @returns boolean 欄位是否有錯誤
   */
  formControlInvalid(formControlName: string): boolean {
    const formControl = this.formGroup.get(formControlName);
    if (formControl) {
      return formControl.invalid && (formControl.dirty || this.submitted);
    } else {
      return false;
    }
  }
}
