import { CalendarDays, AlertCircle, CheckCircle2 } from "lucide-react";

export default function DeadlinesView({ assignments = [] }) {
  const today = new Date().toLocaleDateString("en-CA");

  const sorted = [...assignments].sort(
    (a, b) => a.deadline.localeCompare(b.deadline)
  );

  const overdue = sorted.filter(
    a => !a.completed && a.deadline < today
  );

  const upcoming = sorted.filter(
    a => !a.completed && a.deadline >= today
  );

  const completed = sorted.filter(a => a.completed);

  function renderItems(items) {
    if (!items.length) {
      return <p className="deadline-empty">No assignments in this category.</p>;
    }

    return items.map(a => (
      <div className="deadline-list-item" key={a.id}>
        <div>
          <strong>{a.title}</strong>
          <p>{a.subject}</p>
        </div>
        <span>{a.deadline}</span>
      </div>
    ));
  }

  return (
    <section className="deadlines-view" id="deadlines">
      <h2><CalendarDays size={21} /> Assignment Deadlines</h2>
      <p>View your academic deadlines and submission progress.</p>

      <div className="deadline-categories">
        <div className="deadline-category">
          <h3><AlertCircle size={18} /> Overdue ({overdue.length})</h3>
          {renderItems(overdue)}
        </div>

        <div className="deadline-category">
          <h3><CalendarDays size={18} /> Upcoming ({upcoming.length})</h3>
          {renderItems(upcoming)}
        </div>

        <div className="deadline-category">
          <h3><CheckCircle2 size={18} /> Completed ({completed.length})</h3>
          {renderItems(completed)}
        </div>
      </div>
    </section>
  );
}
