export interface MediaUploadResponse {
  files: {
    name: string;
    size: number;
    mime: string;
  }[];
  jobId: string | number;
}
