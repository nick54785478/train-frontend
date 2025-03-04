import { Option } from '../../../shared/models/option.model';

export class CustomisationQueriedResource {
  username?: string; // 名稱
  value!: Option[]; // 值
}
