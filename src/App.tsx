import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { Editor } from "./routes/Editor";
import { Player } from "./routes/Player";
import { RecordingsDashboard } from "./routes/RecordingsDashboard";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/editor" replace />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/player/:videoId" element={<Player />} />
        <Route path="/recordings" element={<RecordingsDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
