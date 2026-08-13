import { Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { routeDefinitions } from "./routeDefinitions";

export function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Navigate to="/editor" replace />} />
          {routeDefinitions.map(({ path, Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
