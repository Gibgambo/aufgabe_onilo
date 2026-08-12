import type { ReactElement } from "react";
import { Editor } from "./routes/Editor";
import { Player } from "./routes/Player";
import { RecordingsDashboard } from "./routes/RecordingsDashboard";

export interface RouteDefinition {
  path: string;
  element: ReactElement;
}

export const routeDefinitions: RouteDefinition[] = [
  { path: "/editor", element: <Editor /> },
  { path: "/player/:videoId", element: <Player /> },
  { path: "/recordings", element: <RecordingsDashboard /> },
];
