import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  TrendingUp
} from "lucide-react";

export default function DashboardOverview({ assignments = [] }) {
  const today = new Date().toLocaleDateString("en-CA");

  const recent = [...assignments]
    .sort((a, b) =>
      (b.created_at || "").localeCompare(a.created_at || "")
    )
    .slice(0, 5);

  const upcoming = assignments
    .filter((a) => !a.completed && a.deadline >= today)
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
    .slice(0, 5);

  const completed = assignments.filter((a) => a.completed).length;

  const progress = assignments.length
    ? Math.round((completed / assignments.length) * 100)
    : 0;

  return (
    <div className="dashboard-overview">
      <div className="dashboard-overview-grid">
        <section className="overview-panel">
          <h3><BookOpen size={19} /> Recent Assignments</h3>

          {recent.length === 0 ? (
            <p className="overview-empty">No assignments created yet.</p>
          ) : (
            recent.map((assignment) => (
              <div className="overview-entry" key={assignment.id}>
                <div>
                  <strong>{assignment.title}</strong>
                  <small>{assignment.subject}</small>
                </div>
                <span className={
                  assignment.completed
                    ? "overview-completed"
                    : "overview-pending"
                }>
                  {assignment.completed ? "Completed" : "Pending"}
                </span>
              </div>
            ))
          )}
        </section>

        <section className="overview-panel">
          <h3><CalendarDays size={19} /> Upcoming Deadlines</h3>

          {upcoming.length === 0 ? (
            <p className="overview-empty">No upcoming deadlines.</p>
          ) : (
            upcoming.map((assignment) => (
              <div className="overview-entry" key={assignment.id}>
                <div>
                  <strong>{assignment.title}</strong>
                  <small>{assignment.subject}</small>
                </div>
                <span className="overview-date">
                  <Clock size={13} />
                  {assignment.deadline}
                </span>
              </div>
            ))
          )}
        </section>
      </div>

      <section className="progress-panel">
        <div className="progress-panel-header">
          <div>
            <h3><TrendingUp size={20} /> Academic Progress</h3>
            <p>Track your completed assignments.</p>
          </div>
          <strong>{progress}%</strong>
        </div>

        <div
          className="progress-track"
          role="progressbar"
          aria-label="Assignment completion"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="progress-footer">
          <span><CheckCircle2 size={15} /> {completed} completed</span>
          <span>{assignments.length - completed} pending</span>
        </div>
      </section>
    </div>
  );
}
