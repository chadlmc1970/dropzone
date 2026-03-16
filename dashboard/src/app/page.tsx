'use client'

import { useEffect, useState } from 'react'
import { Activity, CheckCircle, Clock, AlertCircle, Users, ListTodo, MessageSquare } from 'lucide-react'

// Types
interface TeamMember {
  name: string
  agentId: string
  agentType: string
  status: 'idle' | 'working' | 'blocked'
  currentTask?: string
}

interface Task {
  id: string
  title: string
  status: 'pending' | 'in_progress' | 'completed'
  owner?: string
  dependencies?: string[]
  blockedBy?: string[]
}

interface Message {
  timestamp: string
  from: string
  to: string
  type: 'message' | 'broadcast' | 'notification'
  summary: string
}

interface TeamStatus {
  teamName: string
  members: TeamMember[]
  tasks: Task[]
  messages: Message[]
  progress: {
    completed: number
    total: number
    percentage: number
  }
}

export default function CoordinatorDashboard() {
  const [teamStatus, setTeamStatus] = useState<TeamStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    fetchTeamStatus()
    const interval = setInterval(fetchTeamStatus, 5000) // Poll every 5 seconds
    return () => clearInterval(interval)
  }, [])

  async function fetchTeamStatus() {
    try {
      const response = await fetch('/api/team-status')
      if (!response.ok) throw new Error('Failed to fetch team status')
      const data = await response.json()
      setTeamStatus(data)
      setLastUpdate(new Date())
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading team status...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
          <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400 mb-3" />
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">Error Loading Team</h3>
          <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          <button
            onClick={fetchTeamStatus}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!teamStatus) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No Active Team</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Create an agent-team to see coordination status</p>
          <code className="text-xs bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
            Create a team to begin tracking
          </code>
        </div>
      </div>
    )
  }

  const { members, tasks, messages, progress } = teamStatus

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                🎧 DropZone Coordinator
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Team: <span className="font-mono font-semibold">{teamStatus.teamName}</span>
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Activity className="w-4 h-4 animate-pulse text-green-500" />
                <span>Last update: {lastUpdate.toLocaleTimeString()}</span>
              </div>
              <div className="mt-1">
                <span className="text-2xl font-bold text-primary">{progress.percentage}%</span>
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                  ({progress.completed}/{progress.total} tasks)
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Team Members */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Team Members
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {members.map((member) => (
                  <div
                    key={member.agentId}
                    className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{member.agentType}</p>
                      </div>
                      <span
                        className={`status-badge ${
                          member.status === 'working'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                            : member.status === 'idle'
                            ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        }`}
                      >
                        {member.status}
                      </span>
                    </div>
                    {member.currentTask && (
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {member.currentTask}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tasks */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <ListTodo className="w-5 h-5 text-primary" />
                  Task List
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-4 rounded-lg border transition-all ${
                        task.status === 'completed'
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                          : task.status === 'in_progress'
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                          : task.blockedBy && task.blockedBy.length > 0
                          ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                          : 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {task.status === 'completed' ? (
                              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                            ) : task.status === 'in_progress' ? (
                              <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-pulse" />
                            ) : (
                              <Clock className="w-4 h-4 text-gray-400" />
                            )}
                            <h3 className="font-medium text-gray-900 dark:text-white">{task.title}</h3>
                          </div>
                          {task.owner && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 ml-6">
                              Assigned to: <span className="font-semibold">{task.owner}</span>
                            </p>
                          )}
                          {task.blockedBy && task.blockedBy.length > 0 && (
                            <p className="text-xs text-red-600 dark:text-red-400 ml-6 mt-1">
                              ⚠️ Blocked by: {task.blockedBy.join(', ')}
                            </p>
                          )}
                        </div>
                        <span
                          className={`status-badge ml-4 ${
                            task.status === 'completed'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              : task.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                          }`}
                        >
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Communication Log
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {messages.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
                      No messages yet
                    </p>
                  ) : (
                    messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-gray-900 dark:text-white">
                              {msg.from}
                            </span>
                            <span className="text-gray-400 dark:text-gray-500">→</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">{msg.to}</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{msg.summary}</p>
                        <span
                          className={`text-xs ${
                            msg.type === 'broadcast'
                              ? 'text-purple-600 dark:text-purple-400'
                              : 'text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          [{msg.type}]
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
