import { Option } from '../../../shared/models/option.model';

export class UpdateCustomizedValueResource {
  username?: string;
  dataType!: string;
  type!: string;
  valueList!: string[]; // 值
}
