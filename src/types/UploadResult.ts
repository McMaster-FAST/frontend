export interface UploadFailure {
  question_identifier: string;
  error_message: string;
}

export interface UploadProgress {
  public_id: string;
  result: UploadCompletedStatus | UploadInProgressStatus;
  success_count: number;
  failure_count: number;
  progress: number;
  failures?: UploadFailure[];
}

export enum UploadCompletedStatus {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

export enum UploadInProgressStatus {
  RUNNING = "RUNNING",
}

