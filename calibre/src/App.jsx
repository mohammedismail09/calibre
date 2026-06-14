import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Calendar, AlertTriangle, RefreshCw, 
  ChevronRight, Layers, Sun, Moon, LogOut, Plus, Users, Briefcase, 
  Trash2, ChevronDown, User, Info, BarChart2, PieChart, ArrowRight
} from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [currentView, setCurrentView] = useState('landing');
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // --- TELEMETRY STATE PIPELINES ---
  const [meetings, setMeetings] = useState([]);
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [syncing, setSyncing] = useState(false);
  
  // UI Layout Open Hooks
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [formType, setFormType] = useState('meeting'); 

  // Input Form States
  const [newMeeting, setNewMeeting] = useState({ title: '', description: '', duration: 1.0, date: '2026-06-14', attendee_emails: [] });
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [newEmployee, setNewEmployee] = useState({ email: '', name: '', rate: 60 });

  const BACKEND_URL = "http://127.0.0.1:8000";

  const fetchBackendData = async () => {
    try {
      const [mRes, pRes, eRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/meetings`),
        fetch(`${BACKEND_URL}/api/projects`),
        fetch(`${BACKEND_URL}/api/employees`)
      ]);
      setMeetings(await mRes.json());
      setProjects(await pRes.json());
      setEmployees(await eRes.json());
    } catch (error) {
      console.error("Communication error with Calibre engine server:", error);
    }
  };

  useEffect(() => {
    if (currentView === 'workspace' || currentView === 'profile') {
      fetchBackendData();
    }
  }, [currentView]);

  const handleDemoWipe = async () => {
    if (window.confirm("Are you sure you want to clear all data for the presentation?")) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/system/reset`, {
          method: "POST"
        });
        if (response.ok) {
          // Re-fetch the empty arrays immediately to clear the UI counters
          await fetchBackendData();
        }
      } catch (error) {
        console.error("Failed to execute presentation wipe route:", error);
      }
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    await fetchBackendData();
    setSyncing(false);
  };

  const handleCreateMeeting = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BACKEND_URL}/api/meetings/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMeeting)
      });
      if (res.ok) {
        await fetchBackendData();
        setIsActionModalOpen(false);
        setNewMeeting({ title: '', description: '', duration: 1.0, date: '2026-06-14', attendee_emails: [] });
      }
    } catch (err) { console.error(err); }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BACKEND_URL}/api/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject)
      });
      if (res.ok) {
        await fetchBackendData();
        setIsActionModalOpen(false);
        setNewProject({ name: '', description: '' });
      }
    } catch (err) { console.error(err); }
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BACKEND_URL}/api/employees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmployee)
      });
      if (res.ok) {
        await fetchBackendData();
        setIsActionModalOpen(false);
        setNewEmployee({ email: '', name: '', rate: 60 });
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteEmployee = async (email) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/employees/delete?email=${encodeURIComponent(email)}`, {
        method: "DELETE"
      });
      if (res.ok) await fetchBackendData();
    } catch (err) { console.error(err); }
  };

  // --- ANALYTICAL CALCULATIONS & STRATEGIES ---
  const TOTAL_COMPANY_BUDGET = 350000;
  const totalSpend = meetings.reduce((sum, m) => sum + m.cost, 0);
  const totalHours = meetings.reduce((sum, m) => sum + m.duration, 0);
  const remainingBudget = TOTAL_COMPANY_BUDGET - totalSpend;
  const budgetBurnPercent = Math.min(100, Math.round((totalSpend / TOTAL_COMPANY_BUDGET) * 100));

  const getProjectCost = (projectId) => {
    return meetings.filter(m => m.aiProjectTag === projectId).reduce((sum, m) => sum + m.cost, 0);
  };

  const isDark = theme === 'dark';
  const styles = {
    bgMain: isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800',
    bgSidebar: isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200',
    bgHeader: isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-white border-slate-200',
    bgCard: isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-sm',
    bgSubCard: isDark ? 'bg-slate-900 border-slate-800/60' : 'bg-slate-100 border-slate-200',
    textMuted: isDark ? 'text-slate-400' : 'text-slate-500',
    textTitle: isDark ? 'text-white' : 'text-slate-900',
    border: isDark ? 'border-slate-800' : 'border-slate-200',
    tableHeader: isDark ? 'bg-slate-950 text-slate-400 border-slate-800' : 'bg-slate-100 text-slate-600 border-slate-200',
    tableRowHover: isDark ? 'hover:bg-slate-900/40' : 'hover:bg-slate-100/60',
    inputBg: isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900',
    navActive: isDark ? 'bg-blue-600/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-600 border-blue-100',
    navInactive: isDark ? 'text-slate-400 hover:bg-slate-900 hover:text-slate-200' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  };

  // ==========================================
  // VIEW RENDER A: LANDING PAGE
  // ==========================================
  if (currentView === 'landing') {
    return (
      <div className={`min-h-screen font-sans ${styles.bgMain}`}>
        <nav className={`h-20 border-b px-8 max-w-7xl mx-auto flex items-center justify-between ${styles.border}`}>
          <div className="flex items-center space-x-3">
            <span className={`font-bold text-xl tracking-tight ${styles.textTitle}`}><strong>C A L I B R E</strong></span>
          </div>
          <button onClick={() => setCurrentView('auth')} className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center space-x-2">
            <span>Get Started</span><ArrowRight size={14} />
          </button>
        </nav>
        <section className="py-36 px-8 max-w-3xl mx-auto text-center">
          <h1 className={`text-4xl md:text-6xl font-extrabold tracking-tight leading-tight ${styles.textTitle}`}>
            Calendar Intelligence <span className="text-blue-500">Exclusively for HR.</span>
          </h1>
          <p className={`mt-6 text-base md:text-lg max-w-2xl mx-auto ${styles.textMuted}`}>
            Monitor workspace alignment trends, audit focus capital variables, and optimize company budget parameters inside a unified control dashboard.
          </p>
          <button onClick={() => setCurrentView('auth')} className="mt-8 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg transition-all">
            Get Started
          </button>
        </section>
      </div>
    );
  }

  // ==========================================
  // VIEW RENDER B: GATEWAY
  // ==========================================
  if (currentView === 'auth') {
    return (
      <div className={`min-h-screen font-sans flex items-center justify-center px-6 ${styles.bgMain}`}>
        <div className={`w-full max-w-sm p-8 rounded-3xl border text-center ${styles.bgCard}`}>
          <div className="bg-blue-600 p-3 rounded-2xl text-white w-fit mx-auto mb-4"><Layers size={24} /></div>
          <h2 className={`text-xl font-bold tracking-tight mb-1 ${styles.textTitle}`}>HR Portal Login</h2>
          <p className={`text-xs mb-8 ${styles.textMuted}`}>Access your workforce expenditure tracking hub.</p>
          
          <button 
            onClick={() => setCurrentView('workspace')}
            className="w-full flex items-center justify-center space-x-3 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.258-3.133C18.423 2.152 15.608 1 12.24 1 5.48 1 0 6.48 0 13.2s5.48 12.2 12.24 12.2c7.055 0 11.75-4.91 11.75-11.9 0-.8-.085-1.415-.19-1.915H12.24z"/>
            </svg>
            <span>Sign In with Google</span>
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW RENDER D: DEDICATED HR PROFILE
  // ==========================================
  if (currentView === 'profile') {
    return (
      <div className={`min-h-screen font-sans flex ${styles.bgMain}`}>
        <aside className={`w-64 border-r flex flex-col justify-between ${styles.bgSidebar}`}>
          <div className="p-6 border-b flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentView('workspace')}>
            <h1 className={`font-bold text-lg ${styles.textTitle}`}>CALIBRE</h1>
          </div>
          <div className="p-4"><button onClick={() => setCurrentView('workspace')} className="w-full py-2.5 bg-slate-800 text-white font-bold text-xs rounded-xl hover:bg-slate-700">← Back to Workspace</button></div>
        </aside>
        <main className="flex-1 p-12 max-w-xl">
          <div className={`p-8 rounded-2xl border ${styles.bgCard} space-y-6`}>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-xl">HR</div>
              <div>
                <h2 className={`text-xl font-bold ${styles.textTitle}`}>Rehaan</h2>
                <p className={`text-xs ${styles.textMuted}`}>Human Resources Administrator</p>
              </div>
            </div>
            <div className={`p-4 rounded-xl border space-y-3 text-xs ${styles.bgSubCard}`}>
              <div className="flex justify-between"><span className={styles.textMuted}>Security Access:</span><span className="font-bold text-emerald-500">Human Resources</span></div>
              <div className="flex justify-between"><span className={styles.textMuted}>Gender:</span><span className="font-medium">Male</span></div>
              <div className="flex justify-between"><span className={styles.textMuted}>Contact:</span><span className="font-medium">+91 98271 22431</span></div>
              <div className="flex justify-between"><span className={styles.textMuted}>Corporate Email:</span><span className="font-medium">ismail02@company.com</span></div>
              <div className="flex justify-between"><span className={styles.textMuted}>Managed Parameters:</span><span className="font-medium">Projects, Calendars, Meetings, Budgets</span></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // VIEW RENDER C: EXECUTIVE DASHBOARD
  // ==========================================
  return (
    <div className={`flex h-screen font-sans overflow-hidden ${styles.bgMain}`}>
      
      {/* SIDEBAR VIEW */}
      <aside className={`w-64 border-r flex flex-col justify-between ${styles.bgSidebar}`}>
        <div>
          <div className={`p-6 border-b flex items-center space-x-3 ${styles.border}`}>
            <div>
              <h1 className={`font-bold text-lg ${styles.textTitle}`}>CALIBRE</h1>
              <p className={`text-xs ${styles.textMuted}`}>HR Intelligence Hub</p>
            </div>
          </div>
          
          <nav className="p-4 space-y-1.5">
            <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm border ${activeTab === 'dashboard' ? styles.navActive : `border-transparent ${styles.navInactive}`}`}>
              <LayoutDashboard size={18} /><span>Executive Dashboard</span>
            </button>
            <button onClick={() => setActiveTab('ledger')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm border ${activeTab === 'ledger' ? styles.navActive : `border-transparent ${styles.navInactive}`}`}>
              <Calendar size={18} /><span>Meeting Ledger</span>
            </button>
            <button onClick={() => setActiveTab('anomalies')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm border ${activeTab === 'anomalies' ? styles.navActive : `border-transparent ${styles.navInactive}`}`}>
              <AlertTriangle size={18} /><span>Anomaly Tracker</span>
            </button>
            <button onClick={() => setActiveTab('roster')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm border ${activeTab === 'roster' ? styles.navActive : `border-transparent ${styles.navInactive}`}`}>
              <Users size={18} /><span>Personnel Roster</span>
            </button>
          </nav>
        </div>

        {/* INTERACTIVE PROFILE LINK */}
        <div 
          onClick={() => setCurrentView('profile')}
          className={`p-4 border-t cursor-pointer hover:bg-slate-100/40 dark:hover:bg-slate-900/40 transition-all duration-200 ${styles.border}`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white"><User size={14} /></div>
            <div>
              <p className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Mohammed</p>
              <p className="text-[10px] text-blue-500 font-medium">HR Account Settings →</p>
            </div>
          </div>
        </div>
      </aside>

      {/* WORKSPACE SHELL */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className={`h-16 border-b px-8 flex items-center justify-between shrink-0 ${styles.bgHeader}`}>
          
          {/* ANIMATED ACTION DROPDOWN */}
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all duration-200 transform active:scale-95"
            >
              <Plus size={14} /><span>Action Control Center</span>
              <ChevronDown size={14} className={`transition-transform duration-300 ease-in-out ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className={`absolute left-0 mt-2 w-48 rounded-xl border shadow-xl z-50 overflow-hidden transition-all duration-200 origin-top ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="p-1 space-y-0.5">
                  <button onClick={() => { setFormType('meeting'); setIsActionModalOpen(true); setIsDropdownOpen(false); }} className={`w-full text-left px-3 py-2.5 text-xs font-semibold rounded-lg flex items-center space-x-2 ${isDark ? 'hover:bg-slate-900 text-slate-200' : 'hover:bg-slate-50 text-slate-700'}`}>
                    <Calendar size={13} /><span>Schedule Meeting</span>
                  </button>
                  <button onClick={() => { setFormType('project'); setIsActionModalOpen(true); setIsDropdownOpen(false); }} className={`w-full text-left px-3 py-2.5 text-xs font-semibold rounded-lg flex items-center space-x-2 ${isDark ? 'hover:bg-slate-900 text-slate-200' : 'hover:bg-slate-50 text-slate-700'}`}>
                    <Briefcase size={13} /><span>Add Project</span>
                  </button>
                  <button onClick={() => { setFormType('employee'); setIsActionModalOpen(true); setIsDropdownOpen(false); }} className={`w-full text-left px-3 py-2.5 text-xs font-semibold rounded-lg flex items-center space-x-2 ${isDark ? 'hover:bg-slate-900 text-slate-200' : 'hover:bg-slate-50 text-slate-700'}`}>
                    <Users size={13} /><span>Map Employee</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {/* TEMPORARY PRESENTATION DUSTBIN BUTTON */}
            <button 
              onClick={handleDemoWipe}
              className="p-2 rounded-lg border border-red-500/30 text-red-500 bg-red-500/5 hover:bg-red-500 hover:text-white transition-all duration-200"
              title="Wipe Entire Data Base for Demo"
            >
              <Trash2 size={16} />
            </button>

            {/* EXISTING THEME TOGGLE BUTTON */}
            <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className="p-2 rounded-lg border">
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            
            <button onClick={handleSync} className="flex items-center space-x-2 bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-semibold">
              <RefreshCw size={14} className={syncing ? "animate-spin" : ""} /><span>Sync Engine</span>
            </button>
            
          </div>
        </header>

        <div className="p-8 flex-1">
          
          {/* TAB 1: EXECUTIVE VISUALS */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className={`p-6 rounded-2xl border ${styles.bgCard}`}>
                  <p className={`text-xs font-semibold tracking-wider ${styles.textMuted} uppercase`}>Focus Capital Spent</p>
                  <p className={`text-3xl font-bold mt-2 ${styles.textTitle}`}>${totalSpend.toLocaleString()}</p>
                </div>
                <div className={`p-6 rounded-2xl border ${styles.bgCard}`}>
                  <p className={`text-xs font-semibold tracking-wider ${styles.textMuted} uppercase`}>Company Operating Budget</p>
                  <p className={`text-3xl font-bold mt-2 ${styles.textTitle}`}>${TOTAL_COMPANY_BUDGET.toLocaleString()}</p>
                </div>
                <div className={`p-6 rounded-2xl border ${styles.bgCard}`}>
                  <p className={`text-xs font-semibold tracking-wider ${styles.textMuted} uppercase`}>Total Focused Hours</p>
                  <p className={`text-3xl font-bold mt-2 ${styles.textTitle}`}>{totalHours} hrs</p>
                </div>
              </div>

              {/* DYNAMIC CHARTS GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 1. PROGRESS BAR TIMELINE (MONTHLY VISUAL) */}
                <div className={`p-6 rounded-2xl border ${styles.bgCard}`}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className={`font-bold text-xs uppercase tracking-wider ${styles.textTitle}`}>Monthly Progress Telemetry</h3>
                    <BarChart2 size={16} className="text-blue-500" />
                  </div>
                  <div className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px]"><span className={styles.textMuted}>April 2026</span><span className="font-semibold">$14,200</span></div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden"><div className="bg-purple-600 h-full w-[40%]"></div></div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px]"><span className={styles.textMuted}>May 2026</span><span className="font-semibold">$22,500</span></div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden"><div className="bg-purple-500 h-full w-[60%]"></div></div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px]"><span className={styles.textMuted}>June 2026 (Active Window)</span><span className="font-bold text-blue-500">${totalSpend.toLocaleString()}</span></div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden"><div className="bg-purple-600 h-full transition-all duration-500" style={{ width: `${Math.min(100, (totalSpend / 5000) * 100)}%` }}></div></div>
                    </div>
                  </div>
                </div>

                {/* 2. BUDGET ABSORPTION PIE RATIO */}
                <div className={`p-6 rounded-2xl border ${styles.bgCard}`}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className={`font-bold text-xs uppercase tracking-wider ${styles.textTitle}`}>Global Allocation Absorption</h3>
                    <PieChart size={16} className="text-purple-500" />
                  </div>
                  <div className="flex flex-col justify-between h-40">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>Total Burn Impact</span>
                        <span className="text-purple-400">{budgetBurnPercent}% Absorbed</span>
                      </div>
                      <div className={`w-full h-3 rounded-full overflow-hidden ${isDark ? 'bg-slate-900' : 'bg-slate-200'}`}>
                        <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-full transition-all duration-500" style={{ width: `${budgetBurnPercent}%` }}></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-4 text-xs">
                      <div><p className={styles.textMuted}>Utilized Company Budget</p><p className={`text-base font-bold ${styles.textTitle}`}>${totalSpend.toLocaleString()}</p></div>
                      <div><p className={styles.textMuted}>Remaining Allocation Space</p><p className="text-base font-bold text-emerald-500">${remainingBudget.toLocaleString()}</p></div>
                    </div>
                  </div>
                </div>

                {/* 3. ACTIVE PROJECT DIRECTORIES (CLICK STATE TRIGGERS LOG DRAWER)  */}
                <div className={`p-6 rounded-2xl border lg:col-span-2 ${styles.bgCard}`}>
                  <div className="flex items-center space-x-2 mb-4">
                    <Briefcase size={14} className="text-blue-500" />
                    <h3 className={`font-bold text-xs uppercase tracking-wider ${styles.textTitle}`}>Active Project Boundaries </h3>
                  </div>
                  <p className={`text-xs mb-4 ${styles.textMuted}`}>Click on any directory item to slide open detailed scope statements.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {projects.map(project => {
                      const cost = getProjectCost(project.id);
                      return (
                        <div 
                          key={project.id} 
                          onClick={() => setSelectedProject(project)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.01] ${styles.bgSubCard} hover:border-blue-500/40 flex justify-between items-center`}
                        >
                          <div>
                            <h4 className={`text-xs font-bold ${styles.textTitle}`}>{project.name}</h4>
                            <p className="text-[10px] text-blue-500 font-bold mt-1">${cost.toLocaleString()} burn</p>
                          </div>
                          <Info size={13} className="text-slate-500" />
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: LOGGING INTAKES */}
          {activeTab === 'ledger' && (
            <div className={`rounded-2xl border overflow-hidden ${styles.bgCard}`}>
              <div className="p-6 border-b border-slate-800"><h3 className={`font-bold text-xs uppercase tracking-wider ${styles.textTitle}`}>Ingested Ingest Log Base</h3></div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`border-b text-[11px] font-semibold uppercase tracking-wider ${styles.tableHeader}`}>
                      <th className="py-4 px-6">Meeting Profile</th>
                      <th className="py-4 px-6">Attendees</th>
                      <th className="py-4 px-6 text-right">Computed Burn</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y text-xs ${isDark ? 'divide-slate-800/60' : 'divide-slate-200'}`}>
                    {meetings.map((meeting) => (
                      <tr key={meeting.id} className={`transition-colors ${styles.tableRowHover}`}>
                        <td className="py-4 px-6">
                          <p className={`font-semibold ${styles.textTitle}`}>{meeting.title}</p>
                          <p className={`text-[10px] mt-0.5 ${styles.textMuted}`}>{meeting.date} • {meeting.duration} hrs</p>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {meeting.attendees.map((a, idx) => (<span key={idx} className={`px-2 py-0.5 rounded text-[10px] border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>{a.name}</span>))}
                          </div>
                        </td>
                        <td className={`py-4 px-6 text-right font-bold ${styles.textTitle}`}>${meeting.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ANOMALIES FEED */}
          {activeTab === 'anomalies' && (
            <div className="space-y-4">
              {meetings.filter(m => m.isAnomaly || m.isLowConfidence).map(meeting => (
                <div key={meeting.id} className={`p-5 rounded-xl border flex items-start space-x-4 ${styles.bgCard} border-red-500/20 bg-red-500/[0.01]`}>
                  <div className="p-2 rounded-lg bg-red-500/10 text-red-500"><AlertTriangle size={18} /></div>
                  <div className="flex-1">
                    <h4 className={`text-sm font-bold ${styles.textTitle}`}>{meeting.title}</h4>
                    <p className={`text-xs mt-2 ${styles.textMuted}`}>{meeting.anomalyReason || "Context metrics dropped below validation parameters."}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: PERSONNEL MANAGEMENT ROSTER */}
          {activeTab === 'roster' && (
            <div className={`p-6 rounded-2xl border ${styles.bgCard}`}>
              <div className="flex items-center space-x-2 mb-6"><Users size={16} className="text-blue-500" /><h3 className={`font-bold text-xs uppercase tracking-wider ${styles.textTitle}`}>Personnel Directory</h3></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {employees.map((emp, idx) => (
                  <div key={idx} className={`flex items-center justify-between p-4 rounded-xl border ${styles.bgSubCard}`}>
                    <div>
                      <p className={`text-xs font-bold ${styles.textTitle}`}>{emp.name}</p>
                      <p className={`text-[10px] ${styles.textMuted}`}>{emp.email}</p>
                      <p className="text-[10px] font-bold text-blue-500 mt-1">${emp.rate}/hr dynamic rate</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteEmployee(emp.email)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* --- DETAILS SIDE EXPANSION DRAWER (PROJECT BOUNDARIES VIEW)  --- */}
      {selectedProject && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex justify-end z-50">
          <div className={`w-md border-l h-full p-6 flex flex-col justify-between shadow-2xl ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="space-y-6">
              <div>
                <span className="text-[10px] bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Project Audit View </span>
                <h3 className={`font-extrabold text-xl mt-2 ${styles.textTitle}`}>{selectedProject.name}</h3>
                <p className={`text-xs font-mono mt-1 ${styles.textMuted}`}>Boundary Identification ID: {selectedProject.id}</p>
              </div>
              <div className={`p-5 rounded-xl border space-y-3 ${styles.bgSubCard}`}>
                <h4 className="text-xs font-bold uppercase tracking-wider">Detailed Scope Statement:</h4>
                <p className="text-xs leading-relaxed font-medium text-slate-300 dark:text-slate-200">{selectedProject.description}</p>
              </div>
            </div>
            <button onClick={() => setSelectedProject(null)} className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-3.5 rounded-xl transition-all">Dismiss Scope View</button>
          </div>
        </div>
      )}

{/* --- ENTRY MODAL DIALOGS --- */}
{/* --- ENTRY MODAL DIALOGS --- */}
      {isActionModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50">
          <div className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
            
            {/* CLEAN CONDITIONAL HEADER - ONLY DISPLAYS CURRENT SELECTION */}
            <div className="border-b border-slate-800 pb-3 mb-6 text-xs font-bold uppercase tracking-wider text-blue-500">
              {formType === 'meeting' && <span>Schedule Meeting</span>}
              {formType === 'project' && <span>Add New Project</span>}
              {formType === 'employee' && <span>Map New Employee</span>}
            </div>

            {formType === 'meeting' && (
              <form onSubmit={handleCreateMeeting} className="space-y-4">
                <div><label className="text-[10px] font-bold uppercase block mb-1">Title</label><input type="text" value={newMeeting.title} onChange={e => setNewMeeting({...newMeeting, title: e.target.value})} className={`w-full p-2 text-xs rounded-lg border ${styles.inputBg}`} placeholder="e.g. Amazon Sync" required /></div>
                <div><label className="text-[10px] font-bold uppercase block mb-1">Description Scope</label><textarea value={newMeeting.description} onChange={e => setNewMeeting({...newMeeting, description: e.target.value})} className={`w-full p-2 text-xs rounded-lg border ${styles.inputBg}`} placeholder="e.g. ecommerce website calibration" required /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-[10px] font-bold uppercase block mb-1">Duration (Hours)</label><input type="number" step="0.5" value={newMeeting.duration} onChange={e => setNewMeeting({...newMeeting, duration: parseFloat(e.target.value) || 1.0})} className={`w-full p-2 text-xs rounded-lg border ${styles.inputBg}`} required /></div>
                  <div><label className="text-[10px] font-bold uppercase block mb-1">Date</label><input type="date" value={newMeeting.date} onChange={e => setNewMeeting({...newMeeting, date: e.target.value})} className={`w-full p-2 text-xs rounded-lg border ${styles.inputBg}`} required /></div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase block mb-1">Select Active Attendees (Hold Ctrl to select multiple)</label>
                  {employees.length === 0 ? (
                    <div className="text-xs p-4 rounded-lg border border-dashed border-amber-500/30 text-amber-500 bg-amber-500/5 text-center">
                      ⚠️ No employees found in directory database. Please map an employee via the Action Control Center first.
                    </div>
                  ) : (
                    <select multiple value={newMeeting.attendee_emails} onChange={e => setNewMeeting({...newMeeting, attendee_emails: Array.from(e.target.selectedOptions, o => o.value)})} className={`w-full p-2 text-xs rounded-lg border h-24 ${styles.inputBg}`} required>
                      {employees.map(emp => (<option key={emp.email} value={emp.email}>{emp.name} ({emp.email})</option>))}
                    </select>
                  )}
                </div>
                <button type="submit" disabled={employees.length === 0} className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold text-xs py-3 rounded-xl transition-all">Commit Schedule Parameters</button>
              </form>
            )}

            {formType === 'project' && (
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div><label className="text-[10px] font-bold uppercase block mb-1">Project Name</label><input type="text" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} className={`w-full p-2 text-xs rounded-lg border ${styles.inputBg}`} required /></div>
                <div><label className="text-[10px] font-bold uppercase block mb-1">Description/Details Scope</label><textarea value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} className={`w-full p-2 text-xs rounded-lg border ${styles.inputBg}`} required /></div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3 rounded-xl">Seed Project Directory</button>
              </form>
            )}

            {formType === 'employee' && (
              <form onSubmit={handleCreateEmployee} className="space-y-4">
                <div><label className="text-[10px] font-bold uppercase block mb-1">Full Employee Name</label><input type="text" value={newEmployee.name} onChange={e => setNewEmployee({...newEmployee, name: e.target.value})} className={`w-full p-2 text-xs rounded-lg border ${styles.inputBg}`} required /></div>
                <div><label className="text-[10px] font-bold uppercase block mb-1">Email Address</label><input type="email" value={newEmployee.email} onChange={e => setNewEmployee({...newEmployee, email: e.target.value})} className={`w-full p-2 text-xs rounded-lg border ${styles.inputBg}`} required /></div>
                <div><label className="text-[10px] font-bold uppercase block mb-1">Custom Per-Hour Billing Charge ($)</label><input type="number" value={newEmployee.rate} onChange={e => setNewEmployee({...newEmployee, rate: parseInt(e.target.value) || 0})} className={`w-full p-2 text-xs rounded-lg border ${styles.inputBg}`} required /></div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3 rounded-xl">Save Employee Settings</button>
              </form>
            )}

            <button onClick={() => setIsActionModalOpen(false)} className="w-full mt-3 bg-transparent border border-slate-700 text-slate-400 text-xs font-bold py-2 rounded-xl hover:bg-slate-800">Cancel Entry</button>
          </div>
        </div>
      )}
    </div>
  );
}