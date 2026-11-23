import { useEffect, useState } from "react";
import axios from "axios";
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  Server
} from "lucide-react";
import "./App.css";
import AssignmentManager from "./components/AssignmentManager";
import { getAssignments } from "./services/assignmentService";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [databaseStatus, setDatabaseStatus] = useState("Checking...");
  const [assignments, setAssignments] = useState([]);
  const [assignmentError, setAssignmentError] = useState("");

  async function refreshAssignments() {
    try {
      const data = await getAssignments();
      setAssignments(data);
      setAssignmentError("");
    } catch {
      setAssignmentError("Unable to load assignments. Check the backend.");
    }
  }

  const completedCount = assignments.filter(a => a.completed).length;
  const today = new Date().toLocaleDateString("en-CA");

  const upcoming = assignments
    .filter(a => !a.completed && a.deadline >= today)
    .sort((a, b) => a.deadline.localeCompare(b.deadline));

  const stats = [
    { title: "Total Assignments", value: assignments.length, icon: BookOpen },
    { title: "Upcoming Deadlines", value: upcoming.length, icon: CalendarDays },
    { title: "Completed Tasks", value: completedCount, icon: CheckCircle2 }
  ];

  useEffect(() => {
    refreshAssignments();
    axios.get(`${API_URL}/health`)
      .then(() => setBackendStatus("Connected"))
      .catch(() => setBackendStatus("Disconnected"));

    axios.get(`${API_URL}/db-health`)
      .then(() => setDatabaseStatus("Connected"))
      .catch(() => setDatabaseStatus("Disconnected"));
  }, []);



  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <GraduationCap size={30} />
          <h2>SAMS</h2>
        </div>

        <p className="sidebar-label">ACADEMIC MANAGEMENT</p>

        <nav>
          <a href="#dashboard" className="active">
            <LayoutDashboard size={19} /> Dashboard
          </a>
          <a href="#assignments">
            <BookOpen size={19} /> Assignments
          </a>
          <a href="#deadlines">
            <CalendarDays size={19} /> Deadlines
          </a>
        </nav>

        <div className="sidebar-footer">
          Smart Academic Management System
        </div>
      </aside>

      <main className="main" id="dashboard">
        <header className="header">
          <div>
            <p className="eyebrow">STUDENT WORKSPACE</p>
            <h1>Academic Dashboard</h1>
            <p className="subtitle">
              Organise your assignments, deadlines and progress.
            </p>
          </div>
          <div className="avatar">S</div>
        </header>

        <section className="welcome">
          <div>
            <p>WELCOME TO SAMS</p>
            <h2>Stay organised. Stay ahead.</h2>
            <span>
              Your academic activities, all in one place.
            </span>
          </div>
          <GraduationCap size={80} />
        </section>

        <section className="stats">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div className="stat-card" key={item.title}>
                <div className="stat-icon">
                  <Icon size={23} />
                </div>
                <p>{item.title}</p>
                <h2>{item.value}</h2>
              </div>
            );
          })}
        </section>

        <AssignmentManager
          assignments={assignments}
          refreshAssignments={refreshAssignments}
        />

        {assignmentError && (
          <p className="assignment-error" role="alert">{assignmentError}</p>
        )}

        <section className="content-grid">
          <div className="panel" id="assignments">
            <h3>Recent Assignments</h3>
            <div className="empty-state">
              <BookOpen size={38} />
              <h4>{assignments.length} assignments recorded</h4>
              <p>Manage your assignments in the section above.</p>
            </div>
          </div>

          <div className="panel" id="deadlines">
            <h3>Upcoming Deadlines</h3>
            <div className="empty-state">
              <CalendarDays size={38} />
              <h4>{upcoming.length} upcoming deadlines</h4>
              <p>
                {upcoming.slice(0, 3).map(a => (
                  <span key={a.id} className="deadline-entry">
                    {a.title} — {a.deadline}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </section>

        <section className="panel system-panel">
          <h3><Server size={20} /> System Connection</h3>

          <div className="connections">
            <div>
              <span>FastAPI Backend</span>
              <strong>{backendStatus}</strong>
            </div>

            <div>
              <span>MongoDB Database</span>
              <strong>{databaseStatus}</strong>
            </div>
          </div>
        </section>

        <footer>
          SAMS | Software Engineering Project | CMS22202
        </footer>
      </main>
    </div>
  );
}

export default App;
