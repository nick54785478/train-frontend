import { NgModule } from '@angular/core';
import { routes } from './ticket.routes';
import { RouterModule } from '@angular/router';

@NgModule({
  // 此處使用 RouterModule.forChild 進行懶加載模組
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketRoutingModule {}
