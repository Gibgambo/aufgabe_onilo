import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { routeDefinitions } from "./routeDefinitions";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/editor" replace />} />
        {routeDefinitions.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}
