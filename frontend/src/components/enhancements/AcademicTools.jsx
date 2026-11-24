import { useState, useMemo, useEffect } from "react";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Search,
  BarChart3,
  Bell,
  UserCircle,
  CheckCircle2,
  Clock,
  AlertCircle,
  Mail,
  ShieldCheck
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from "recharts";

import { getAssignments } from "../../services/assignmentService";
import "./AcademicTools.css";

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function deadlineKey(assignment) {
  return String(assignment.deadline || "").slice(0, 10);
}

function assignmentStatus(assignment) {
  if (assignment.completed) return "Completed";

  if (deadlineKey(assignment) < dateKey(new Date())) {
    return "Overdue";
  }

  return "Pending";
}

function SectionHeading({ icon: Icon, title, description }) {
  return (
    <div className="sams-tool-heading">
      <div className="sams-tool-icon">
        <Icon size={24} />
      </div>
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}


/* FEATURE 1: ACADEMIC CALENDAR */

export function AcademicCalendar({ assignments = [] }) {
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const year = month.getFullYear();
  const monthIndex = month.getMonth();

  const firstDay = new Date(year, monthIndex, 1).getDay();
  const totalDays = new Date(year, monthIndex + 1, 0).getDate();

  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1)
  ];

  while (cells.length % 7 !== 0) cells.push(null);

  const today = dateKey(new Date());

  function changeMonth(offset) {
    setMonth(new Date(year, monthIndex + offset, 1));
  }

  return (
    <section className="sams-tool-panel" id="calendar">

      <SectionHeading
        icon={CalendarDays}
        title="Academic Calendar"
        description="Visualise your assignment submission dates."
      />

      <div className="sams-calendar-toolbar">

        <button onClick={() => changeMonth(-1)}
          aria-label="Previous month">
          <ChevronLeft size={20} />
        </button>

        <h3>
          {month.toLocaleDateString("en-GB", {
            month: "long",
            year: "numeric"
          })}
        </h3>

        <button onClick={() => changeMonth(1)}
          aria-label="Next month">
          <ChevronRight size={20} />
        </button>

        <button onClick={() => {
          const now = new Date();
          setMonth(new Date(
            now.getFullYear(), now.getMonth(), 1
          ));
        }}>
          Today
        </button>

      </div>

      <div className="sams-calendar-grid">

        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
          .map(day => (
            <div key={day} className="sams-calendar-weekday">
              {day}
            </div>
          ))}

        {cells.map((day, index) => {
          const key = day
            ? dateKey(new Date(year, monthIndex, day))
            : "";

          const events = assignments.filter(
            a => deadlineKey(a) === key
          );

          return (
            <div
              key={index}
              className={`sams-calendar-cell
                ${!day ? "empty" : ""}
                ${key === today ? "today" : ""}`}
            >

              {day && <strong>{day}</strong>}

              {events.map(a => (
                <div
                  key={a.id}
                  className={`sams-calendar-event
                    ${assignmentStatus(a).toLowerCase()}`}
                  title={`${a.title} — ${a.subject}`}
                >
                  {a.title}
                </div>
              ))}

            </div>
          );
        })}

      </div>

      <div className="sams-legend">
        <span><i className="pending-dot" /> Pending</span>
        <span><i className="completed-dot" /> Completed</span>
        <span><i className="overdue-dot" /> Overdue</span>
      </div>

    </section>
  );
}


/* FEATURE 2: ASSIGNMENT SEARCH AND FILTERS */

export function AssignmentSearch({ assignments = [] }) {

  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("earliest");

  const filtered = useMemo(() => {

    const term = query.trim().toLowerCase();

    return assignments.filter(a => {

      const matchesQuery = [
        a.title,
        a.subject,
        a.description
      ].some(value =>
        String(value || "").toLowerCase().includes(term)
      );

      const matchesPriority =
        priority === "All" ||
        String(a.priority).toLowerCase() === priority.toLowerCase();

      const matchesStatus =
        status === "All" ||
        assignmentStatus(a) === status;

      return matchesQuery && matchesPriority && matchesStatus;

    }).sort((a, b) => {

      if (sort === "title") {
        return String(a.title).localeCompare(String(b.title));
      }

      if (sort === "latest") {
        return deadlineKey(b).localeCompare(deadlineKey(a));
      }

      return deadlineKey(a).localeCompare(deadlineKey(b));

    });

  }, [assignments, query, priority, status, sort]);

  return (
    <section className="sams-tool-panel" id="search">

      <SectionHeading
        icon={Search}
        title="Search and Filter Assignments"
        description="Find assignments by subject, priority or status."
      />

      <div className="sams-filter-grid">

        <label>
          Search
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search assignments..."
          />
        </label>

        <label>
          Priority
          <select value={priority}
            onChange={e => setPriority(e.target.value)}>
            {["All", "High", "Medium", "Low"].map(value => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>

        <label>
          Status
          <select value={status}
            onChange={e => setStatus(e.target.value)}>
            {["All", "Pending", "Completed", "Overdue"]
              .map(value => (
                <option key={value}>{value}</option>
              ))}
          </select>
        </label>

        <label>
          Sort by
          <select value={sort}
            onChange={e => setSort(e.target.value)}>
            <option value="earliest">Earliest deadline</option>
            <option value="latest">Latest deadline</option>
            <option value="title">Assignment name</option>
          </select>
        </label>

      </div>

      <div className="sams-search-summary">

        <span>
          Showing {filtered.length} of {assignments.length} assignments
        </span>

        <button onClick={() => {
          setQuery("");
          setPriority("All");
          setStatus("All");
          setSort("earliest");
        }}>
          Clear filters
        </button>

      </div>

      <div className="sams-table-wrapper">

        <table className="sams-data-table">

          <thead>
            <tr>
              <th>Assignment</th>
              <th>Subject</th>
              <th>Deadline</th>
              <th>Priority</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {filtered.map(a => (
              <tr key={a.id}>
                <td>{a.title}</td>
                <td>{a.subject}</td>
                <td>{deadlineKey(a)}</td>
                <td>{a.priority}</td>
                <td>
                  <span className={`sams-status
                    ${assignmentStatus(a).toLowerCase()}`}>
                    {assignmentStatus(a)}
                  </span>
                </td>
              </tr>
            ))}

            {!filtered.length && (
              <tr>
                <td colSpan={5}>
                  No matching assignments found.
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

    </section>
  );
}


/* FEATURE 3: ACADEMIC ANALYTICS */

export function AcademicAnalytics({ assignments = [] }) {

  const completed = assignments.filter(
    a => assignmentStatus(a) === "Completed"
  ).length;

  const overdue = assignments.filter(
    a => assignmentStatus(a) === "Overdue"
  ).length;

  const pending = assignments.length - completed - overdue;

  const progress = assignments.length
    ? Math.round(completed / assignments.length * 100)
    : 0;

  const pieData = [
    { name: "Completed", value: completed, color: "#16a34a" },
    { name: "Pending", value: pending, color: "#4169c1" },
    { name: "Overdue", value: overdue, color: "#dc2626" }
  ].filter(item => item.value > 0);

  const subjects = {};

  assignments.forEach(a => {

    const name = a.subject || "Other";

    if (!subjects[name]) {
      subjects[name] = {
        subject: name,
        Completed: 0,
        Pending: 0,
        Overdue: 0
      };
    }

    subjects[name][assignmentStatus(a)] += 1;

  });

  const barData = Object.values(subjects);

  return (
    <section className="sams-tool-panel" id="analytics">

      <SectionHeading
        icon={BarChart3}
        title="Academic Analytics"
        description="Understand your workload and completion progress."
      />

      <div className="sams-analytics-stats">

        {[
          ["Total assignments", assignments.length],
          ["Completed", completed],
          ["Pending", pending],
          ["Overdue", overdue],
          ["Completion rate", `${progress}%`]
        ].map(([label, value]) => (
          <div className="sams-analytics-stat" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}

      </div>

      {assignments.length ? (

        <div className="sams-chart-grid">

          <div className="sams-chart-card">

            <h3>Assignment Status</h3>

            <ResponsiveContainer width="100%" height={280}>
              <PieChart>

                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                >
                  {pieData.map(item => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />

              </PieChart>
            </ResponsiveContainer>

          </div>

          <div className="sams-chart-card">

            <h3>Subject-wise Progress</h3>

            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Completed" fill="#16a34a" />
                <Bar dataKey="Pending" fill="#4169c1" />
                <Bar dataKey="Overdue" fill="#dc2626" />
              </BarChart>
            </ResponsiveContainer>

          </div>

        </div>

      ) : (
        <p className="sams-empty-message">
          Add assignments to generate your academic analytics.
        </p>
      )}

    </section>
  );
}


/* FEATURE 4: DEADLINE NOTIFICATIONS */

export function AcademicNotifications({ assignments = [] }) {

  const today = new Date();
  const todayUTC = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const notifications = assignments
    .filter(a => !a.completed)
    .map(a => {

      const [year, month, day] =
        deadlineKey(a).split("-").map(Number);

      const deadlineUTC = Date.UTC(year, month - 1, day);

      const days = Math.round(
        (deadlineUTC - todayUTC) / 86400000
      );

      return { ...a, days };

    })
    .filter(a => Number.isFinite(a.days) && a.days <= 7)
    .sort((a, b) => a.days - b.days);

  return (
    <section className="sams-tool-panel" id="notifications">

      <SectionHeading
        icon={Bell}
        title="Notifications"
        description="Stay informed about approaching and overdue deadlines."
      />

      <div className="sams-notification-count">
        {notifications.length} active reminders
      </div>

      {!notifications.length && (
        <div className="sams-empty-message">
          <CheckCircle2 size={30} />
          <p>You're all caught up!</p>
          <span>No overdue assignments or deadlines within seven days.</span>
        </div>
      )}

      {notifications.map(a => {

        const urgent = a.days <= 1;

        const message =
          a.days < 0
            ? `Overdue by ${Math.abs(a.days)} day(s)`
            : a.days === 0
              ? "Due today"
              : a.days === 1
                ? "Due tomorrow"
                : `Due in ${a.days} days`;

        return (
          <article
            key={a.id}
            className={`sams-notification
              ${urgent ? "urgent" : ""}`}
          >

            {urgent
              ? <AlertCircle size={24} />
              : <Clock size={24} />}

            <div>
              <h3>{a.title}</h3>
              <p>{a.subject} — {message}</p>
              <small>Deadline: {deadlineKey(a)}</small>
            </div>

            <span className="sams-notification-priority">
              {a.priority}
            </span>

          </article>
        );
      })}

    </section>
  );
}


/* FEATURE 5: STUDENT PROFILE */

export function StudentProfile({ student, assignments = [] }) {

  const completed = assignments.filter(a => a.completed).length;

  const initials = String(student?.name || "Student")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0].toUpperCase())
    .join("");

  return (
    <section className="sams-tool-panel" id="profile">

      <SectionHeading
        icon={UserCircle}
        title="My Profile"
        description="View your student account information."
      />

      <div className="sams-profile-banner">

        <div className="sams-profile-avatar">
          {initials}
        </div>

        <div>
          <h2>{student?.name || "Student"}</h2>
          <p>Student Account</p>
        </div>

      </div>

      <div className="sams-profile-details">

        <div>
          <UserCircle size={20} />
          <span>Full name</span>
          <strong>{student?.name || "Unavailable"}</strong>
        </div>

        <div>
          <Mail size={20} />
          <span>Email address</span>
          <strong>{student?.email || "Unavailable"}</strong>
        </div>

        <div>
          <ShieldCheck size={20} />
          <span>Account type</span>
          <strong>Student</strong>
        </div>

        <div>
          <CheckCircle2 size={20} />
          <span>Account session</span>
          <strong>Authenticated</strong>
        </div>

      </div>

      <div className="sams-analytics-stats">

        <div className="sams-analytics-stat">
          <span>Total assignments</span>
          <strong>{assignments.length}</strong>
        </div>

        <div className="sams-analytics-stat">
          <span>Completed assignments</span>
          <strong>{completed}</strong>
        </div>

        <div className="sams-analytics-stat">
          <span>Remaining assignments</span>
          <strong>{assignments.length - completed}</strong>
        </div>

      </div>

    </section>
  );
}


/* SHARED ACADEMIC WORKSPACE */

export default function AcademicTools({
  student,
  assignments,
  activeSection
}) {

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {

    if (Array.isArray(assignments)) return;

    let active = true;

    setLoading(true);

    getAssignments()
      .then(data => {
        if (active) setRecords(data);
      })
      .catch(() => {
        if (active) setError("Unable to load assignments.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };

  }, [assignments, activeSection]);

  const data = Array.isArray(assignments)
    ? assignments
    : records;

  if (loading) return <p>Loading academic information...</p>;

  if (error && !Array.isArray(assignments)) {
    return <p role="alert">{error}</p>;
  }

  const sections = {
    calendar: <AcademicCalendar assignments={data} />,
    search: <AssignmentSearch assignments={data} />,
    analytics: <AcademicAnalytics assignments={data} />,
    notifications: <AcademicNotifications assignments={data} />,
    profile: <StudentProfile student={student} assignments={data} />
  };

  return (
    <div className="sams-academic-tools">
      {activeSection
        ? sections[activeSection]
        : Object.entries(sections).map(([key, component]) => (
            <div key={key}>{component}</div>
          ))}
    </div>
  );
}
