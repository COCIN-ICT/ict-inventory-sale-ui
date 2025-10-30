import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { SalesItemResponse, SalesItemService } from '../../../../services/sales-item.service';

@Component({
  selector: 'app-sales-items-list',
  templateUrl: './sales-items-list.component.html',
  styleUrls: ['./sales-items-list.component.css']
})
export class SalesItemsListComponent {
  items$: Observable<SalesItemResponse[]> = this.salesItemService.getCreatedItems();

  constructor(private salesItemService: SalesItemService) {}
}


