import { useState, useEffect } from "react";
import "./TeamDashboard.css";

interface TeamMember {
  name: string;
  agentId: string;
  agentType: string;
  status: "active" | "idle" | "working" | "blocked";
  currentTask?: string;
  lastHeartbeat?: string;
}

interface Task {
  id: string;
  title: string;
  status: "pending" | "in_progress" | "completed";
  owner?: string;
  dependencies?: string[];
  blockedBy?: string[];
  created: string;
  updated: string;
}

interface Message {
  timestamp: string;
  from: string;
  to: string;
  type: "message" | "broadcast" | "notification";
  summary: string;
}

interface TeamStatus {
  teamName: string;
  members: TeamMember[];
  tasks: Task[];
  messages: Message[];
  progress: {
    completed: number;
    total: number;
    percentage: number;
  };
  lastUpdated: string;
}

export default function TeamDashboard() {
  const [teamData, setTeamData] = useState<TeamStatus | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeamStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/agent-team/status`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: TeamStatus = await response.json();
      setTeamData(data);
      setLastRefresh(new Date());
    } catch (err) {
      console.error("Failed to fetch team status:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamStatus();
    const interval = setInterval(fetchTeamStatus, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="team-dashboard loading">
        <div className="spinner"></div>
        <p>Loading agent-team status...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="team-dashboard error">
        <div className="error-card">
          <h3>⚠️ Error Loading Team</h3>
          <p>{error}</p>
          <button onClick={fetchTeamStatus}>Retry</button>
        </div>
      </div>
    );
  }

  if (!teamData) {
    return (
      <div className="team-dashboard empty">
        <div className="empty-state">
          <h2>👥 No Active Agent Team</h2>
          <p>Create an agent-team to see coordination status</p>
          <code>Use /agents command to create a team</code>
        </div>
      </div>
    );
  }

  const { members, tasks, messages, progress } = teamData;

  return (
    <div className="team-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div>
          <h1>🎧 DropZone Agent Team Coordinator</h1>
          <p className="team-name">
            Team: <strong>{teamData.teamName}</strong>
          </p>
          <p className="last-update">
            Last update: {lastRefresh.toLocaleTimeString()}
          </p>
        </div>
        <div className="progress-section">
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
          <div className="progress-text">
            <span className="percentage">{progress.percentage}%</span>
            <span className="task-count">
              ({progress.completed}/{progress.total} tasks)
            </span>
          </div>
          <button onClick={fetchTeamStatus} disabled={isLoading} className="refresh-btn">
            {isLoading ? "⟳" : "↻"} Refresh
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        {/* Team Members */}
        <section className="members-section">
          <h2>👥 Team Members</h2>
          <div className="members-grid">
            {members.map((member) => (
              <div
                key={member.agentId}
                className={`member-card status-${member.status}`}
              >
                <div className="member-header">
                  <div>
                    <h3>{member.name}</h3>
                    <p className="agent-type">{member.agentType}</p>
                  </div>
                  <span className={`status-badge ${member.status}`}>
                    {member.status === "working" && "🔵"}
                    {member.status === "idle" && "⚪"}
                    {member.status === "active" && "🟢"}
                    {member.status === "blocked" && "🔴"}
                    {member.status}
                  </span>
                </div>
                {member.currentTask && (
                  <p className="current-task">
                    <strong>Current:</strong> {member.currentTask}
                  </p>
                )}
                {member.lastHeartbeat && (
                  <p className="heartbeat">
                    Last seen: {new Date(member.lastHeartbeat).toLocaleTimeString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Tasks */}
        <section className="tasks-section">
          <h2>📋 Task List</h2>
          <div className="tasks-list">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`task-card status-${task.status} ${
                  task.blockedBy && task.blockedBy.length > 0 ? "blocked" : ""
                }`}
              >
                <div className="task-header">
                  <div className="task-title">
                    {task.status === "completed" && "✅"}
                    {task.status === "in_progress" && "🔵"}
                    {task.status === "pending" && "⚪"}
                    <h3>{task.title}</h3>
                  </div>
                  <span className={`status-badge ${task.status}`}>
                    {task.status.replace("_", " ")}
                  </span>
                </div>
                {task.owner && (
                  <p className="task-owner">
                    <strong>Assigned to:</strong> {task.owner}
                  </p>
                )}
                {task.blockedBy && task.blockedBy.length > 0 && (
                  <p className="task-blocked">
                    ⚠️ Blocked by: {task.blockedBy.join(", ")}
                  </p>
                )}
                <div className="task-meta">
                  <span>Updated: {new Date(task.updated).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Messages */}
        <section className="messages-section">
          <h2>💬 Communication Log</h2>
          <div className="messages-list">
            {messages.length === 0 ? (
              <p className="no-messages">No messages yet</p>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`message-card type-${msg.type}`}>
                  <div className="message-header">
                    <span className="message-from">{msg.from}</span>
                    <span className="arrow">→</span>
                    <span className="message-to">{msg.to}</span>
                    <span className="message-time">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="message-summary">{msg.summary}</p>
                  <span className="message-type">[{msg.type}]</span>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
