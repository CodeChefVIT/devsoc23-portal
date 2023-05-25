interface User {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  gender: string;
  phoneNumber: string;
  college: string;
  birthDate: string;
  mode: string;
  github: string;
  image: string;
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
interface Member {
  Id: string;
  firstName: string;
  lastName: string;
  isBoard: boolean;
  teamId: string;
}

interface ServerResponse {
  status: string;
  message: string;
  err: string;
  accessToken: string;
  token: string;
  inTeam: boolean;
  inviteCode: string;
  isTeamLeader: boolean;
  memberDetails: Member[];
  user: User;
  project: Project;
  teamName: string;
  teamId: string;
  teamLeader: string;
}

export type { ServerResponse };
