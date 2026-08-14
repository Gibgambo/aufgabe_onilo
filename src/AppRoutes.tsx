import { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router";
import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import { Layout } from "./routes/Layout";

export interface RouteDefinition {
  path: string;
  Component: LazyExoticComponent<ComponentType>;
}

const routeDefinitions: RouteDefinition[] = [
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

export function AppRoutes() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={<Navigate to={routeDefinitions[0].path} replace />}
          />
          {routeDefinitions.map(({ path, Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
        </Route>
      </Routes>
    </Suspense>
  );
}
