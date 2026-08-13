import { lazy, type ComponentType, type LazyExoticComponent } from "react";

export interface RouteDefinition {
  path: string;
  Component: LazyExoticComponent<ComponentType>;
}

export const routeDefinitions: RouteDefinition[] = [
  {
    path: "/editor",
    Component: lazy(() =>
      import("./routes/Editor").then((m) => ({ default: m.Editor })),
    ),
  },
  {
    path: "/player/:videoId",
    Component: lazy(() =>
      import("./routes/Player").then((m) => ({ default: m.Player })),
    ),
  },
  {
    path: "/recordings",
    Component: lazy(() =>
      import("./routes/RecordingsDashboard").then((m) => ({
        default: m.RecordingsDashboard,
      })),
    ),
  },
];
