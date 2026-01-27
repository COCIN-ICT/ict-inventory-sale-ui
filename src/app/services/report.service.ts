import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface OrderReportRequest {
  status?: string;
  unitId?: number;
  action?: string;
  userId?: number;
  fromDate?: string;
  toDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private readonly base = environment.apiUrl || '';

  constructor(private readonly http: HttpClient) {}

  getSalesOrderReport(params: OrderReportRequest): Observable<any> {
    let httpParams = new HttpParams();
    
    if (params.userId !== undefined && params.userId !== null) {
      httpParams = httpParams.set('userId', params.userId.toString());
    }
    if (params.status) {
      httpParams = httpParams.set('status', params.status);
    }
    if (params.unitId !== undefined && params.unitId !== null) {
      httpParams = httpParams.set('unitId', params.unitId.toString());
    }
    if (params.action) {
      httpParams = httpParams.set('action', params.action);
    }
    if (params.fromDate) {
      httpParams = httpParams.set('fromDate', params.fromDate);
    }
    if (params.toDate) {
      httpParams = httpParams.set('toDate', params.toDate);
    }

    return this.http.get<any>(`${this.base}/report/sales/order`, { params: httpParams });
  }

  getPurchaseOrderReport(params: OrderReportRequest): Observable<any> {
    let httpParams = new HttpParams();
    
    if (params.userId !== undefined && params.userId !== null) {
      httpParams = httpParams.set('userId', params.userId.toString());
    }
    if (params.status) {
      httpParams = httpParams.set('status', params.status);
    }
    if (params.unitId !== undefined && params.unitId !== null) {
      httpParams = httpParams.set('unitId', params.unitId.toString());
    }
    if (params.action) {
      httpParams = httpParams.set('action', params.action);
    }
    if (params.fromDate) {
      httpParams = httpParams.set('fromDate', params.fromDate);
    }
    if (params.toDate) {
      httpParams = httpParams.set('toDate', params.toDate);
    }

    return this.http.get<any>(`${this.base}/report/purchase/order`, { params: httpParams });
  }

  getProductionOrderReport(params: OrderReportRequest): Observable<any> {
    let httpParams = new HttpParams();
    
    if (params.userId !== undefined && params.userId !== null) {
      httpParams = httpParams.set('userId', params.userId.toString());
    }
    if (params.status) {
      httpParams = httpParams.set('status', params.status);
    }
    if (params.unitId !== undefined && params.unitId !== null) {
      httpParams = httpParams.set('unitId', params.unitId.toString());
    }
    if (params.action) {
      httpParams = httpParams.set('action', params.action);
    }
    if (params.fromDate) {
      httpParams = httpParams.set('fromDate', params.fromDate);
    }
    if (params.toDate) {
      httpParams = httpParams.set('toDate', params.toDate);
    }

    return this.http.get<any>(`${this.base}/report/production/order`, { params: httpParams });
  }
}
