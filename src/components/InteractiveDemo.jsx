import React, { useState } from 'react';

export default function InteractiveDemo() {
  // Counter State
  const [count, setCount] = useState(0);

  // Todo State
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Instal dependensi via npm install', completed: true },
    { id: 2, text: 'Jalankan server dev dengan npm run dev', completed: false },
    { id: 3, text: 'Mulai coding di folder src/', completed: false }
  ]);
  const [newTaskText, setNewTaskText] = useState('');

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setTasks([
      ...tasks,
      { id: Date.now(), text: newTaskText.trim(), completed: false }
    ]);
    setNewTaskText('');
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <section id="demo" className="demo-section">
      <div className="container">
        <div className="section-header">
          <div className="badge">Playground Interaktif</div>
          <h2 className="section-title">
            Uji Coba <span className="text-gradient">React State</span> Secara Langsung
          </h2>
          <p className="section-desc">
            Komponen di bawah ini berjalan menggunakan React State (<code>useState</code>) murni.
          </p>
        </div>

        <div className="demo-grid">
          {/* Card 1: Interactive Counter */}
          <div className="glass-card demo-card">
            <div className="demo-card-header">
              <div className="demo-icon counter-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
              </div>
              <div>
                <h3 className="demo-card-title">State Counter</h3>
                <p className="demo-card-subtitle">Pengujian reaktivitas hook state</p>
              </div>
            </div>

            <div className="counter-display">
              <div className="counter-value">{count}</div>
              <span className="counter-status">
                {count === 0 ? 'Nilai awal' : count > 0 ? `Bertambah ${count} kali` : `Negatif ${Math.abs(count)}`}
              </span>
            </div>

            <div className="counter-controls">
              <button onClick={() => setCount(c => c - 1)} className="btn btn-secondary btn-icon" title="Kurangi">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              <button onClick={() => setCount(0)} className="btn btn-secondary btn-reset">
                Reset
              </button>
              <button onClick={() => setCount(c => c + 1)} className="btn btn-primary btn-icon" title="Tambah">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
          </div>

          {/* Card 2: Interactive Task List */}
          <div className="glass-card demo-card">
            <div className="demo-card-header">
              <div className="demo-icon task-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 11l3 3L22 4"></path>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>
              </div>
              <div>
                <h3 className="demo-card-title">Checklist Projek</h3>
                <p className="demo-card-subtitle">
                  {tasks.filter(t => t.completed).length} dari {tasks.length} langkah selesai
                </p>
              </div>
            </div>

            <form onSubmit={addTask} className="task-form">
              <input
                type="text"
                placeholder="Tambah langkah baru..."
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                className="task-input"
              />
              <button type="submit" className="btn btn-primary btn-sm">
                Tambah
              </button>
            </form>

            <ul className="task-list">
              {tasks.map(task => (
                <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                  <label className="task-checkbox-label">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="task-checkbox"
                    />
                    <span className="task-text">{task.text}</span>
                  </label>
                  <button 
                    onClick={() => deleteTask(task.id)} 
                    className="task-delete-btn" 
                    title="Hapus"
                    aria-label="Delete task"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
