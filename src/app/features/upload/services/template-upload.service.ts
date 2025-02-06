import { Injectable } from '@angular/core';
import { TemplateQueriedResource } from '../models/template-queried-resource.model';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TemplateUploadService {
  private readonly baseApiUrl = environment.apiEndpoint;

  constructor(private http: HttpClient) {}

  /**
   * 取得該範本的資訊
   * @param type
   * @returns
   */
  queryTemplate(type: string): Observable<TemplateQueriedResource> {
    const url = this.baseApiUrl + '/template';
    let params = new HttpParams().set('type', type);
    return this.http.get<TemplateQueriedResource>(url, { params });
  }
}
