import { Injectable } from '@angular/core';
import { RestService } from '@aitheon/core-client';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor(private restService: RestService) { }

  updateDealStatus(id: string, data: any): Observable<any> {
    return this.restService.put(`${environment.salesURI}/api/deals/byfield/${id}`, data, true);
  }
}
