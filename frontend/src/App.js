import { Routes, Route } from "react-router-dom";
import {
  Signup,
  Dashboard,
  Profile,
  IdeaSubmission,
  ProjectSubmission,
} from "./pages/_index";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/project-submission" element={<ProjectSubmission />} />
        <Route path="/idea-submission" element={<IdeaSubmission />} />
      </Routes>
    </div>
  );
}

export default App;
