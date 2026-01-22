import { useEffect, useMemo, useState } from "react";
import { api } from "./api";
import type { User, UserCreate } from "./types";

const emptyForm: UserCreate = { name: "", email: "", age: null };

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<UserCreate>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(
    () => form.name.trim().length >= 2 && form.email.includes("@"),
    [form]
  );

  useEffect(() => {
    setLoading(true);
    api
      .listUsers()
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async () => {
    setError(null);
    try {
      if (editingId === null) {
        const created = await api.createUser(form);
        setUsers((prev) => [...prev, created]);
      } else {
        const updated = await api.updateUser(editingId, form);
        setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      }
      resetForm();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setForm({ name: user.name, email: user.email, age: user.age });
  };

  const handleDelete = async (id: number) => {
    setError(null);
    try {
      await api.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>User App</h1>
        <p>Basic CRUD operations</p>
      </header>

      <section className="card">
        <h2>{editingId === null ? "Create User" : "Edit User"}</h2>
        <div className="grid">
          <label>
            Name
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Jane Doe"
            />
          </label>
          <label>
            Email
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="jane@example.com"
              type="email"
            />
          </label>
          <label>
            Age
            <input
              value={form.age ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  age: e.target.value ? Number(e.target.value) : null
                })
              }
              placeholder="30"
              type="number"
              min={0}
            />
          </label>
        </div>
        <div className="actions">
          <button disabled={!canSubmit} onClick={handleSubmit}>
            {editingId === null ? "Create" : "Update"}
          </button>
          {editingId !== null && (
            <button className="secondary" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
        {error && <p className="error">{error}</p>}
      </section>

      <section className="card">
        <h2>Users</h2>
        {loading ? (
          <p>Loading...</p>
        ) : users.length === 0 ? (
          <p>No users yet</p>
        ) : (
          <ul className="list">
            {users.map((user) => (
              <li key={user.id}>
                <div>
                  <strong>{user.name}</strong>
                  <div className="muted">{user.email}</div>
                  <div className="muted">Age: {user.age ?? "-"}</div>
                </div>
                <div className="actions">
                  <button className="secondary" onClick={() => handleEdit(user)}>
                    Edit
                  </button>
                  <button className="danger" onClick={() => handleDelete(user.id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
