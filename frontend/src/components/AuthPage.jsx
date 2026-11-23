import { useState } from "react";
import { GraduationCap, LogIn, UserPlus } from "lucide-react";
import { loginStudent, registerStudent } from "../services/authService";

export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        await registerStudent(form);
      }

      const result = await loginStudent({
        email: form.email,
        password: form.password
      });

      onLogin(result);
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(
        typeof detail === "string"
          ? detail
          : "Authentication failed. Please check your details."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <GraduationCap size={40} />
          <h1>SAMS</h1>
          <p>Smart Academic Management System</p>
        </div>

        <h2>{mode === "login" ? "Student Login" : "Create Student Account"}</h2>

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <label>
              Full Name
              <input
                required
                minLength={2}
                maxLength={100}
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="Enter your full name"
              />
            </label>
          )}

          <label>
            Email Address
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              placeholder="student@example.com"
            />
          </label>

          <label>
            Password
            <input
              required
              type="password"
              minLength={mode === "register" ? 8 : undefined}
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              placeholder="Enter password"
            />
          </label>

          {error && <p className="auth-error" role="alert">{error}</p>}

          <button type="submit" disabled={loading}>
            {mode === "login" ? <LogIn size={18} /> : <UserPlus size={18} />}
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Login"
                : "Register"}
          </button>
        </form>

        <p className="auth-switch">
          {mode === "login" ? "Don't have an account?" : "Already registered?"}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError("");
            }}
          >
            {mode === "login" ? "Register here" : "Login here"}
          </button>
        </p>
      </div>
    </main>
  );
}
