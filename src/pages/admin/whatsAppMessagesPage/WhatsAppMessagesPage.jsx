import { useEffect, useState } from 'react';
import API from '../adminApi';
import "./whatsAppMessagesPage.scss"

export default function WhatsAppMessagesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: '',
    message: '',
  });

  const [editingId, setEditingId] = useState(null);

  /* ---------- LOAD TEMPLATES ---------- */
  const loadTemplates = () => {
    API.get('/api/whatsapp-templates')
      .then((res) => setTemplates(res.data))
      .catch(() => alert('Failed to load templates'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  /* ---------- CREATE / UPDATE ---------- */
  const submitForm = () => {
    if (!form.title.trim() || !form.message.trim()) {
      alert('Title and message are required');
      return;
    }

    const req = editingId
      ? API.put(`/api/whatsapp-templates/${editingId}`, form)
      : API.post('/api/whatsapp-templates', form);

    req
      .then(() => {
        setForm({ title: '', message: '' });
        setEditingId(null);
        loadTemplates();
      })
      .catch(() => alert('Failed to save template'));
  };

  /* ---------- EDIT ---------- */
  const startEdit = (tpl) => {
    setEditingId(tpl._id);
    setForm({
      title: tpl.title,
      message: tpl.message,
    });
  };

  /* ---------- DELETE ---------- */
  const deleteTemplate = (id) => {
    if (!window.confirm('Delete this WhatsApp message?')) return;

    API.delete(`/api/whatsapp-templates/${id}`)
      .then(() => loadTemplates())
      .catch(() => alert('Failed to delete template'));
  };

  if (loading) {
    return <div className="wm-container">Loading…</div>;
  }

  return (
    <div className="wm-container">
      {/* ================= FORM ================= */}
      <div className="wm-form">
        <h3>{editingId ? 'Edit Message' : 'Add WhatsApp Message'}</h3>

        <input
          type="text"
          placeholder="Template title (e.g. 3 Month Reminder)"
          value={form.title}
          onChange={(e) =>
            setForm((p) => ({ ...p, title: e.target.value }))
          }
        />

        <textarea
          placeholder="Message content (use {{name}}, {{bikeNumber}} etc.)"
          value={form.message}
          onChange={(e) =>
            setForm((p) => ({ ...p, message: e.target.value }))
          }
          rows={6}
        />

        <div className="wm-form-actions">
          <button className="save-btn" onClick={submitForm}>
            {editingId ? 'Update' : 'Add'}
          </button>

          {editingId && (
            <button
              className="cancel-btn"
              onClick={() => {
                setEditingId(null);
                setForm({ title: '', message: '' });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* ================= TABLE ================= */}
      {templates.length === 0 ? (
        <p className="wm-empty">No WhatsApp messages added yet</p>
      ) : (
        <table className="wm-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Message Preview</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((tpl) => (
              <tr key={tpl._id}>
                <td className="title">{tpl.title}</td>
                <td className="preview">
                  {tpl.message.slice(0, 120)}
                  {tpl.message.length > 120 ? '…' : ''}
                </td>
                <td className="actions">
                  <button
                    className="edit-btn"
                    onClick={() => startEdit(tpl)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteTemplate(tpl._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
