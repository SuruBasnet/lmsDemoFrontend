export type StudentInfo = {
  id: number
  name: string
  plan: string
  status: "pending" | "processing" | "success" | "failed"
  session: string
}

export interface GoogleMeetSpace {
  name: string;
  meetingUri: string;
  meetingCode: string;
  config: {
    accessType: 'OPEN' | 'TRUSTED' | 'RESTRICTED';
    entryPointAccess: 'ALL' | 'CREATOR';
  };
}

export interface GoogleMeetError {
  error: string;
  message: string;
  details?: any;
}