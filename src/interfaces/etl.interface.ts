export interface ETLState {
  id?: number;
  batchId: string;
  status: ProcessStatus;
  etl: string;
}

export enum ProcessStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  SUCCESS = 'success',
  ERROR = 'error',
}
