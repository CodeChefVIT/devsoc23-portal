interface User {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  gender: string;
  phoneNumber: string;
  college: string;
  birthData: string;
}

interface Project {
  projectName: string;
  projectTrack: string;
  projectDescription: string;
  projectFigmaLink: string;
  projectDriveLink: string;
  projectTagLine: string;
  projectStack: string;
  projectGithubLink: string;
  projectVideoLink: string;
}

interface ServerResponse {
  status: string;
  message: string;
  err: string;
  accessToken: string;
  token: string;
  inTeam: boolean;
  memberDetails: [];
  user: User;
  project: Project;
}

export type { ServerResponse };
