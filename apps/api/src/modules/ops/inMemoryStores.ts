export type Checklist = {
  id: string;
  name: string;
  items: Array<{ id: string; label: string; done: boolean }>;
};

export type LogbookEntry = {
  id: string;
  dateUtc: string;
  aircraftReg: string;
  departure: string;
  destination: string;
  durationMin: number;
  remarks?: string;
};

export type CommunityPost = {
  id: string;
  author: string;
  aerodrome?: string;
  content: string;
  createdAtUtc: string;
};

export const checklistsStore = new Map<string, Checklist>();
export const logbookStore = new Map<string, LogbookEntry>();
export const communityStore = new Map<string, CommunityPost>();
