import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CreateTrainResource } from '../models/create-train-resource.model';
import { BaseResponse } from '../../../shared/models/base-response.model';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TrainCreatedResource } from '../models/train-created-resource.model ';
import { TrainSummaryQueriedResource } from '../models/train-summary-queried-resource.model';
import { StopDetailQueriedResource } from '../models/stop-detail-queried-resource.model';
import { TrainQueriedResource } from '../models/train-queried-resource.model';
import { UpdateTrainResource } from '../models/update-train-resource.model';

@Injectable({
  providedIn: 'root',
})
export class TrainService {
  private readonly baseApiUrl = environment.apiEndpoint;

  constructor(private http: HttpClient) {}

  /**
   * 提交新增火車時刻資料
   * @param requestData
   */
  createTrain(requestData: CreateTrainResource): Observable<BaseResponse> {
    const url = this.baseApiUrl + '/train';
    return this.http.post<BaseResponse>(url, requestData);
  }

  /**
   * 提交更新火車時刻資料
   * @param requestData
   */
  updateTrain(requestData: UpdateTrainResource): Observable<BaseResponse> {
    const url = this.baseApiUrl + '/train';
    return this.http.put<BaseResponse>(url, requestData);
  }

  /**
   * 查詢符合條件的火車資訊
   *
   * @param trainNo  車次
   * @param trainKind 車種
   * @param fromStop 起站
   * @param toStop   迄站
   * @param takeDate 出發日期
   * @param time     出發時間
   * @return 該火車車次的停靠站資訊
   */
  query(
    trainNo?: number,
    trainKind?: string,
    fromStop?: string,
    toStop?: string,
    takeDate?: string,
    time?: string
  ): Observable<TrainSummaryQueriedResource[]> {
    const url = this.baseApiUrl + '/train/summary';

    let params = new HttpParams()
      .set('trainNo', trainNo ? trainNo : '')
      .set('trainKind', trainKind ? trainKind : '')
      .set('fromStop', fromStop ? fromStop : '')
      .set('toStop', toStop ? toStop : '')
      .set('takeDate', takeDate ? takeDate : '')
      .set('time', time ? time : '');

    return this.http.get<TrainSummaryQueriedResource[]>(url, { params });
  }

  /**
   * 查詢車站詳細資料
   * @param uuid
   * @param fromStop
   * @returns
   */
  queryStopDetails(
    uuid: string,
    fromStop: string
  ): Observable<StopDetailQueriedResource[]> {
    const url = this.baseApiUrl + '/train/stops/details';
    let params = new HttpParams().set('uuid', uuid).set('fromStop', fromStop);
    return this.http.get<StopDetailQueriedResource[]>(url, { params });
  }

  /**
   * 取得該火車車次的資訊
   * @param trainNo
   * @returns
   */
  queryTrain(trainNo: string): Observable<TrainQueriedResource> {
    const url = this.baseApiUrl + '/train/' + trainNo + '/stops';
    return this.http.get<TrainQueriedResource>(url);
  }
}
