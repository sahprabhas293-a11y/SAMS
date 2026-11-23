import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  X,
  BookOpen
} from "lucide-react";

import {
  createAssignment,
  updateAssignment,
  setAssignmentCompletion,
  deleteAssignment
} from "../services/assignmentService";

const emptyForm = {
  title: "",
  subject: "",
  description: "",
  deadline: "",
  priority: "Medium"
};

export default function AssignmentManager({
  assignments,
  refreshAssignments
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  function startEdit(assignment) {
    setEditingId(assignment.id);
    setForm({
      title: assignment.title,
      subject: assignment.subject,
      description: assignment.description || "",
      deadline: assignment.deadline,
      priority: assignment.priority
    });
    setShowForm(true);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      if (editingId) {
        await updateAssignment(editingId, form);
      } else {
        await createAssignment(form);
      }

      await refreshAssignments();
      closeForm();
    } catch (err) {
      setError(
        err.response?.data?.detail
          ? JSON.stringify(err.response.data.detail)
          : "Unable to save assignment."
      );
    } finally {
      setBusy(false);
    }
  }

  async function toggleCompletion(assignment) {
    setError("");

    try {
      await setAssignmentCompletion(
        assignment.id,
        !assignment.completed
      );
      await refreshAssignments();
    } catch {
      setError("Unable to update assignment status.");
    }
  }

  async function removeAssignment(assignment) {
    if (!window.confirm(`Delete "${assignment.title}"?`)) {
      return;
    }

    setError("");

    try {
      await deleteAssignment(assignment.id);
      await refreshAssignments();
    } catch {
      setError("Unable to delete assignment.");
    }
  }

  return (
    <section className="assignment-manager" id="assignments">
      <div className="assignment-heading">
        <div>
          <h2>Assignment Management</h2>
          <p>Manage your coursework and academic tasks.</p>
        </div>

        <button
          className="primary-button"
          onClick={() => {
            closeForm();
            setShowForm(true);
          }}
        >
          <Plus size={18} /> Add Assignment
        </button>
      </div>

      {error && <p className="assignment-error" role="alert">{error}</p>}

      {showForm && (
        <form className="assignment-form" onSubmit={handleSubmit}>
          <div className="form-header">
            <h3>{editingId ? "Edit Assignment" : "New Assignment"}</h3>
            <button type="button" onClick={closeForm} aria-label="Close form">
              <X size={20} />
            </button>
          </div>

          <div className="form-grid">
            <label>
              Assignment Title
              <input
                required
                maxLength={150}
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                placeholder="Enter assignment title"
              />
            </label>

            <label>
              Subject
              <input
                required
                maxLength={100}
                value={form.subject}
                onChange={(e) =>
                  setForm({ ...form, subject: e.target.value })
                }
                placeholder="Enter subject"
              />
            </label>

            <label>
              Deadline
              <input
                required
                type="date"
                value={form.deadline}
                onChange={(e) =>
                  setForm({ ...form, deadline: e.target.value })
                }
              />
            </label>

            <label>
              Priority
              <select
                value={form.priority}
                onChange={(e) =>
                  setForm({ ...form, priority: e.target.value })
                }
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </label>
          </div>

          <label>
            Description
            <textarea
              rows={3}
              maxLength={2000}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Additional details"
            />
          </label>

          <button className="primary-button" type="submit" disabled={busy}>
            {busy ? "Saving..." : editingId ? "Save Changes" : "Create Assignment"}
          </button>
        </form>
      )}

      <div className="assignment-list">
        {assignments.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={38} />
            <h4>No assignments yet</h4>
            <p>Click Add Assignment to create your first task.</p>
          </div>
        ) : (
          assignments.map((assignment) => (
            <article className="assignment-item" key={assignment.id}>
              <div className="assignment-details">
                <div className="assignment-title-row">
                  <h3 className={assignment.completed ? "completed-title" : ""}>
                    {assignment.title}
                  </h3>
                  <span className={`priority-badge priority-${assignment.priority.toLowerCase()}`}>
                    {assignment.priority}
                  </span>
                </div>

                <p>{assignment.subject}</p>

                {assignment.description && (
                  <p>{assignment.description}</p>
                )}

                <small>Deadline: {assignment.deadline}</small>

                <span className={`status-label ${assignment.completed ? "status-complete" : ""}`}>
                  {assignment.completed ? "Completed" : "Pending"}
                </span>
              </div>

              <div className="assignment-actions">
                <button
                  onClick={() => toggleCompletion(assignment)}
                  title={assignment.completed ? "Mark pending" : "Mark complete"}
                  aria-label={assignment.completed ? "Mark pending" : "Mark complete"}
                >
                  <CheckCircle2 size={19} />
                </button>

                <button
                  onClick={() => startEdit(assignment)}
                  title="Edit"
                  aria-label={`Edit ${assignment.title}`}
                >
                  <Pencil size={19} />
                </button>

                <button
                  onClick={() => removeAssignment(assignment)}
                  title="Delete"
                  aria-label={`Delete ${assignment.title}`}
                >
                  <Trash2 size={19} />
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
