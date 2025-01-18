import { Routes } from '@angular/router';
import { TrainComponent } from './pages/train/train.component';
import { CreateTimetableComponent } from './pages/create-timetable/create-timetable.component';
import { TrainStopsComponent } from './pages/train/train-stops/train-stops.component';

/**
 * 定義 Users 子路由配置的檔案
 */
export const routes: Routes = [
  {
    path: '',
    component: TrainComponent,
  },
  {
    path: 'create',
    component: CreateTimetableComponent,
  },
  {
    path: 'stops',
    component: TrainStopsComponent,
  },
];
