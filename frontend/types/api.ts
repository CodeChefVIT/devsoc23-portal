import type { AxiosResponse } from "axios";

interface ApiResponse extends AxiosResponse {
  data: {
    status: string;
    message: string;
    err: string;
    accessToken: string;
    token: string;

    user: {
      firstName: string;
      lastName: string;
      email: string;
      bio: string;
      gender: string;
      phoneNumber: string;
      college: string;
      birthData: string;
    };

    project: {
      projectName: string;
      projectTrack: string;
      projectDescription: string;
      projectFigmaLink: string;
      projectDriveLink: string;
      projectTagLine: string;
      projectStack: string;
      projectGithubLink: string;
      projectVideoLink: string;
    };
  };
}

export type { ApiResponse };
