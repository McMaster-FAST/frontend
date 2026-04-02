interface UploadProgress {
  public_id: string;
  result: UploadCompletedStatus | UploadInProgressStatus;
  success_count: number;
  failure_count: number;
  progress: number;
}

enum UploadCompletedStatus {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

enum UploadInProgressStatus {
  RUNNING = "RUNNING",
}

