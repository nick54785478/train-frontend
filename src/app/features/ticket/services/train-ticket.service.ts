import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { TrainInfoQueriedResource } from '../models/train-info-queried-resource.model';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { delay, Subject } from 'rxjs';
import { TicketBookedResource } from '../models/ticket-booked-resource.model';
import { BookTicketResource } from '../models/book-ticket-resource.model';

@Injectable({
  providedIn: 'root',
})
export class TrainTicketService {
  private readonly baseApiUrl = environment.apiEndpoint;

  constructor(private http: HttpClient) {}

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
    time?: string,
    ticketType?: string
  ): Observable<TrainInfoQueriedResource[]> {
    const url = this.baseApiUrl + '/train';
    let params = new HttpParams()
      .set('trainNo', trainNo ? trainNo : '')
      .set('trainKind', trainKind ? trainKind : '')
      .set('fromStop', fromStop ? fromStop : '')
      .set('toStop', toStop ? toStop : '')
      .set('takeDate', takeDate ? takeDate : '')
      .set('time', time ? time : '')
      .set('ticketType', ticketType ? ticketType : '');
    return this.http.get<TrainInfoQueriedResource[]>(url, { params });
  }

  /**
   * 預訂車票
   * @param request
   * @returns
   */
  bookTicket(request: BookTicketResource): Observable<TicketBookedResource> {
    const url = this.baseApiUrl + '/booking';
    return this.http.post<TicketBookedResource>(url, request);
  }
}
