export interface UploadProgress {
  public_id: string;
  result: UploadCompletedStatus | UploadInProgressStatus;
  success_count: number;
  failure_count: number;
  progress: number;
}

export enum UploadCompletedStatus {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

export enum UploadInProgressStatus {
  RUNNING = "RUNNING",
}

