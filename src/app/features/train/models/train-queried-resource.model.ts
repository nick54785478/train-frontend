export class TrainQueriedResource {
  /**
   * 火車 uuid
   */
  uuid?: string;
  /**
   * 車次
   */
  number!: number;
  /**
   * 車種
   */
  kind!: string;

  fromStop!: string;

  toStop!: string;

  fromStopTime!: string;

  toStopTime!: string;

  /**
   * 停靠站
   */
  stops: StopQueriedResource[] = [];
}

export class StopQueriedResource {
  /**
   * 停靠順序
   */
  seq!: number;
  /**
   * 站名
   */
  stopName!: string;
  /**
   * 停靠時間
   */
  stopTime!: string;
}
