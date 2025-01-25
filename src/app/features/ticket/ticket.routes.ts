import { Routes } from '@angular/router';
import { TicketComponent } from './pages/ticket/ticket.component';
import { TrainInfoFormComponent } from './pages/ticket/train-info-form/train-info-form.component';
import { TrainSelectingComponent } from './pages/ticket/train-selecting/train-selectng.component';
import { TicketDetailComponent } from './pages/ticket/ticket-detail/ticket-detail.component';

/**
 * 定義 Users 子路由配置的檔案
 */
export const routes: Routes = [
  // 預設路徑顯示 TicketComponent
  {
    path: '',
    component: TicketComponent,
    children: [
      { path: 'train-info', component: TrainInfoFormComponent },
      {
        path: 'train-selecting',
        component: TrainSelectingComponent,
      },
      {
        path: 'ticket-detail',
        component: TicketDetailComponent,
      },
      { path: '', redirectTo: 'train-info', pathMatch: 'full' },
    ],
  },
];
