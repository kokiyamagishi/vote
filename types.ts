export type TeamColor = 'red' | 'white' | 'blue';

export interface Vote {
  id: string;
  name: string;
  choice: TeamColor;
  timestamp: number;
}

export interface Comment {
  id: string;
  teamColor: TeamColor;
  userName: string;
  text: string;
  timestamp: number;
}

export interface TeamStats {
  color: TeamColor;
  label: string;
  count: number;
  theme: {
    bg: string;
    text: string;
    border: string;
    ball: string;
    shadow: string;
  };
}