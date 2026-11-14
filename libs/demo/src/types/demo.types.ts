import { BaseColumnsInterface } from '@libs/global';
import { UUID } from 'crypto';

export interface DemoInterface extends BaseColumnsInterface {
  id: UUID;
  name: string;
}
