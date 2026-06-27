import React, { useState, useEffect } from 'react';
import { 
  Database, Cpu, BarChart3, ShieldCheck, Download, 
  Settings, Sun, Moon, UploadCloud, Clock, 
  Menu, Bell, X, ShieldAlert, CheckCircle2, Home, Activity, Lock, ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Import views
import LandingPage from './components/LandingPage';
import SourceData from './components/SourceData';
import AISynthesis from './components/AISynthesis';
import Analytics from './components/Analytics';
import PrivacyAudit from './components/PrivacyAudit';
import Downloads from './components/Downloads';
import SafeSynChatbot from './components/SafeSynChatbot';
import DashboardOverview from './components/DashboardOverview';

// Import parser & data
import { parseFhirBundle, parseCsvText } from './utils/fhirParser';
import { ENTIRE_RAW_POPULATION } from './data/samplePatients';

// Default initial PII audit log list representing raw records
const INITIAL_PII_LOGS = [
  { field: 'Social Security Number (SSN)', value: '999-53-9172', description: 'Direct government unique identifier, found in patient resource block.' },
  { field: 'Full Patient Name', value: 'Mr. Darryl392 Rolf983 Jerde200', description: 'Direct identity identifier, violating HIPAA Safe Harbor rules.' },
  { field: 'Contact Info (phone)', value: '555-500-4422', description: 'Direct communications address, high leakage risk.' },
  { field: 'Physical Address', value: '551 Cruickshank Lock Apt 83, Bellingham, MA 02019', description: 'Geographic location detail, violating HIPAA de-identification criteria.' },
  { field: "Mother's Maiden Name", value: 'Gale827 Rogahn59', description: 'High-security question answer, standard verification field.' },
  { field: "Driver's License", value: 'S99920616', description: 'Direct state identifier.' },
  { field: 'Passport Number', value: 'X17195018X', description: 'Federal travel identification key.' },
  { field: 'Practitioner ID (NPI)', value: '9999945899', description: 'Care provider directory identifier (Dr. Stephen891 Okuneva707).' }
];

export default function App() {
  const [inConsole, setInConsole] = useState(false);
  const [triggeredMessage, setTriggeredMessage] = useState(null);

  const triggerChatbot = (text) => {
    setTriggeredMessage({ text, id: Date.now() });
  };
  const [theme, setTheme] = useState('light'); // default light as requested
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Settings state
  const [userProfile, setUserProfile] = useState({
    name: 'Dr. Sarah Jenkins',
    role: 'Principal Researcher',
    avatar: 'SJ'
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Dataset states
  const [activeDataset, setActiveDataset] = useState({
    name: 'synthetic_patient_dataset.csv',
    size: '82 KB',
    isSecured: false
  });

  const [stats, setStats] = useState({
    totalRecords: 5001,
    detectedFields: 3,
    missingValues: 0,
    riskLevel: 'High'
  });

  const [patients, setPatients] = useState(ENTIRE_RAW_POPULATION);
  const [piiLogs, setPiiLogs] = useState(INITIAL_PII_LOGS);

  // Recent activity logs state
  const [activityLogs, setActivityLogs] = useState([
    { id: 1, text: 'Engine initialized with CTGANSynthesizer model checkpoint', time: '10 mins ago' },
    { id: 2, text: 'Raw patient dataset (5,001 records) loaded in memory', time: '8 mins ago' },
    { id: 3, text: 'PII Audit scanner completed audit check (8 violations)', time: '7 mins ago' }
  ]);

  // Toast notifications state
  const [toasts, setToasts] = useState([]);

  // Trigger toast alert
  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Add activity log helper
  const addActivity = (text) => {
    setActivityLogs(prev => [
      { id: Date.now(), text, time: 'Just now' },
      ...prev
    ]);
  };

  // Toggle dark/light theme
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    addToast(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} theme`, 'info');
  };

  // Synthesis completed callback
  const handleSynthesisComplete = (numRows) => {
    setActiveDataset({
      name: 'synthetic_patient_dataset.csv',
      size: `${Math.round(numRows * 0.0164)} KB`,
      isSecured: true
    });
    setStats(prev => ({
      ...prev,
      totalRecords: numRows,
      riskLevel: 'Low'
    }));
    // Remove PII logs since output is fully secure
    setPiiLogs([]);
    addToast(`Successfully synthesized ${numRows.toLocaleString()} secure profiles!`, 'success');
    addActivity(`Triggered AI synthesis generated ${numRows.toLocaleString()} rows`);
    
    // Confetti burst
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  // Dynamic Upload Widget handler
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    let progress = 0;
    addToast(`Uploading ${file.name}...`, 'info');
    
    const interval = setInterval(() => {
      progress += 20;
      if (progress >= 100) {
        clearInterval(interval);
        
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const content = event.target.result;
            
            if (file.name.endsWith('.json')) {
              const bundle = JSON.parse(content);
              const result = parseFhirBundle(bundle);
              
              setPatients([result]);
              setPiiLogs(result.piiAudited);
              setStats({
                totalRecords: 1,
                detectedFields: 7,
                missingValues: 0,
                riskLevel: result.riskLevel
              });
              setActiveDataset({
                name: file.name,
                size: `${Math.round(file.size / 1024)} KB`,
                isSecured: result.riskLevel === 'Low'
              });
              addToast('FHIR Patient Bundle parsed successfully!', 'success');
              addActivity(`Uploaded & scanned FHIR transaction Bundle: ${file.name}`);
            } else if (file.name.endsWith('.csv')) {
              const result = parseCsvText(content);
              setPatients(result.records);
              setPiiLogs(result.piiAudited);
              setStats({
                totalRecords: result.records.length,
                detectedFields: 3,
                missingValues: 0,
                riskLevel: result.riskLevel
              });
              setActiveDataset({
                name: file.name,
                size: `${Math.round(file.size / 1024)} KB`,
                isSecured: result.riskLevel === 'Low'
              });
              addToast(`CSV loaded. Parsed ${result.records.length} records.`, 'success');
              addActivity(`Uploaded clinical CSV records: ${file.name}`);
            } else {
              throw new Error('Unsupported file extension. Please upload a .json or .csv file.');
            }
          } catch (error) {
            addToast(`Parsing Error: ${error.message}`, 'error');
          }
        };
        reader.readAsText(file);
      }
    }, 150);
  };

  // Render the selected tab view
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboardOverview();
      case 'source':
        return <SourceData patients={patients} stats={stats} piiLogs={piiLogs} />;
      case 'synthesis':
        return <AISynthesis onSynthesisComplete={handleSynthesisComplete} isSecured={activeDataset.isSecured} />;
      case 'analytics':
        return <Analytics onExplain={triggerChatbot} />;
      case 'privacy':
        return <PrivacyAudit />;
      case 'downloads':
        return <Downloads patients={patients} stats={stats} onAddActivity={addActivity} />;
      case 'settings':
        return renderSettingsPage();
      default:
        return renderDashboardOverview();
    }
  };

  // Render integrated Settings Page
  const renderSettingsPage = () => {
    return (
      <div style={{ animation: 'slide-in 0.4s ease-out', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>SYSTEM OPTIONS // PROFILE SETTINGS</span>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', marginTop: '4px' }}>Console Settings</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>Manage active researcher credentials and system notification setups.</p>
        </div>

        <div className="glass-panel" style={{ padding: '32px', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Researcher Profile</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Full Name</label>
              <input 
                type="text" 
                className="form-input" 
                value={userProfile.name}
                onChange={(e) => {
                  const nextVal = e.target.value;
                  setUserProfile(prev => ({
                    ...prev,
                    name: nextVal,
                    avatar: nextVal.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                  }));
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Organizational Role</label>
              <input 
                type="text" 
                className="form-input" 
                value={userProfile.role}
                onChange={(e) => setUserProfile(prev => ({ ...prev, role: e.target.value }))}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', marginTop: '12px' }}>
              <div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>Compliance Logs Alerting</span>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Trigger automated browser warnings when Epsilon drops below 1.5.</p>
              </div>
              <input 
                type="checkbox" 
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>
          </div>

          <button className="btn-primary" style={{ alignSelf: 'flex-end' }} onClick={() => addToast('System configuration saved successfully', 'success')}>
            Save Settings Changes
          </button>
        </div>
      </div>
    );
  };

  // Render Dashboard Overview Page
  const renderDashboardOverview = () => {
    return (
      <DashboardOverview 
        userProfile={userProfile}
        stats={stats}
        activeDataset={activeDataset}
        activityLogs={activityLogs}
        setActiveTab={setActiveTab}
        triggerChatbot={triggerChatbot}
      />
    );
  };

  // Main UI router switch
  if (!inConsole) {
    return <LandingPage onLaunchConsole={() => {
      setInConsole(true);
      addToast('SafeSyn AI Console Started Successfully', 'success');
    }} />;
  }

  return (
    <div className="app-container" style={{ transition: 'all 0.3s' }}>
      
      {/* Sidebar Navigation */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        
        {/* Sidebar Logo */}
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px', filter: 'drop-shadow(0 0 8px rgba(37, 99, 235, 0.5))', flexShrink: 0 }}>🛡️</span>
          {!sidebarCollapsed && (
            <div style={{ animation: 'fade-in 0.2s ease-out' }}>
              <h1 style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '-0.3px', color: '#FFF' }}>SafeSyn AI</h1>
              <p style={{ fontSize: '9px', color: '#64748B', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase' }}>Privacy Platform</p>
            </div>
          )}
        </div>

        {/* Sidebar Nav Items */}
        <nav style={{ flexGrow: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
          {[
            { id: 'dashboard', label: 'Dashboard Overview', icon: <Home size={18} /> },
            { id: 'source', label: 'Source Patients', icon: <Database size={18} /> },
            { id: 'synthesis', label: 'AI Synthesis', icon: <Cpu size={18} /> },
            { id: 'analytics', label: 'Fidelity & Utility', icon: <BarChart3 size={18} /> },
            { id: 'privacy', label: 'Regulatory Audit', icon: <ShieldCheck size={18} /> },
            { id: 'downloads', label: 'Secure Downloads', icon: <Download size={18} /> },
            { id: 'settings', label: 'System Settings', icon: <Settings size={18} /> }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`sidebar-nav-btn ${activeTab === item.id ? 'active' : ''}`}
            >
              <span style={{ display: 'flex', shrink: 0 }}>{item.icon}</span>
              {!sidebarCollapsed && <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Sidebar Dataset upload & Status modules */}
        {!sidebarCollapsed && (
          <div style={{ padding: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'rgba(0, 0, 0, 0.15)' }}>
            
            {/* Upload Widget */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', tracking: '0.5px' }}>Ingest Patient Records</span>
              <label style={{ border: '1px dashed rgba(255, 255, 255, 0.15)', borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s' }}>
                <UploadCloud size={20} style={{ color: '#64748B' }} />
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', marginTop: '6px' }}>FHIR JSON / CSV</span>
                <input 
                  type="file" 
                  accept=".json,.csv" 
                  style={{ display: 'none' }}
                  onChange={handleFileUpload} 
                />
              </label>
            </div>

            {/* Dataset status badge */}
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Ingestion Status</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px', fontWeight: 600 }}>
                <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', color: '#E2E8F0' }} title={activeDataset.name}>📄 {activeDataset.name}</div>
                <div style={{ color: '#64748B' }}>Size: {activeDataset.size}</div>
                <div style={{ marginTop: '4px' }}>
                  {activeDataset.isSecured ? (
                    <span className="badge badge-green" style={{ fontSize: '9px', padding: '2px 8px' }}><CheckCircle2 size={10} style={{ marginRight: '4px' }} /> Synthesized</span>
                  ) : (
                    <span className="badge badge-red" style={{ fontSize: '9px', padding: '2px 8px', animation: 'pulse-glow 1.5s infinite' }}><ShieldAlert size={10} style={{ marginRight: '4px' }} /> Raw Records</span>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Sidebar Profile & settings */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(0, 0, 0, 0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(124, 58, 237, 0.2)', border: '1px solid var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontWeight: 800, fontSize: '12px', flexShrink: 0 }}>
              {userProfile.avatar}
            </div>
            {!sidebarCollapsed && (
              <div style={{ overflow: 'hidden' }}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#F8FAFC', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{userProfile.name}</p>
                <p style={{ fontSize: '9px', color: '#64748B', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{userProfile.role}</p>
              </div>
            )}
          </div>
          {!sidebarCollapsed && (
            <div style={{ display: 'flex', gap: '4px' }}>
              <button 
                onClick={toggleTheme}
                style={{ padding: '6px', background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                title="Toggle UI Theme Mode"
              >
                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              </button>
              <button 
                onClick={() => setInConsole(false)}
                style={{ padding: '6px', background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                title="Back to Landing Page"
              >
                <Home size={15} />
              </button>
            </div>
          )}
        </div>

      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        
        {/* Top Header */}
        <header className="navbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <Menu size={18} />
            </button>
            <h2 style={{ fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              🛡️ SafeSyn AI: Privacy-Preserving Healthcare Data Engine
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRight: '1px solid var(--border-color)', paddingRight: '16px', fontSize: '12px', fontWeight: 600 }}>
              <span style={{ color: 'var(--text-muted)' }}>Dataset:</span>
              <span style={{ color: 'var(--text-primary)' }}>{activeDataset.name}</span>
            </div>

            <button 
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', position: 'relative' }}
              onClick={() => addToast('System: No active warnings in execution queue', 'info')}
            >
              <Bell size={18} />
              <span style={{ position: 'absolute', top: '0', right: '0', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }}></span>
            </button>
          </div>
        </header>

        {/* Page Tab Router Mount */}
        <div className="page-container">
          {renderTabContent()}
        </div>

        {/* Footnote status banner */}
        <footer style={{ borderTop: '1px solid var(--border-color)', padding: '12px 32px', backgroundColor: 'var(--bg-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={12} style={{ color: 'var(--color-primary)' }} />
            <span style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '9px', tracking: '0.5px' }}>Event Log:</span>
            <span>{activityLogs[0]?.text || 'No logs yet'} ({activityLogs[0]?.time})</span>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Latency: <span style={{ fontFamily: 'monospace', color: 'var(--color-success)', fontWeight: 700 }}>14ms</span></span>
            <span>Version: <span style={{ fontFamily: 'monospace' }}>v2.0.1</span></span>
          </div>
        </footer>

      </main>

      {/* Floating Toast alerts */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '10px', pointerEvents: 'none' }}>
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className="glass-panel"
            style={{ 
              padding: '16px', 
              borderRadius: '12px', 
              border: '1px solid var(--glass-border)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              maxWidth: '360px', 
              pointerEvents: 'auto', 
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
              backgroundColor: toast.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : toast.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'var(--glass-bg)',
              color: toast.type === 'success' ? 'var(--color-success)' : toast.type === 'error' ? 'var(--color-danger)' : 'var(--text-primary)'
            }}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 size={16} style={{ color: 'var(--color-success)', shrink: 0 }} />
            ) : toast.type === 'error' ? (
              <ShieldAlert size={16} style={{ color: 'var(--color-danger)', shrink: 0 }} />
            ) : (
              <Database size={16} style={{ color: 'var(--color-primary)', shrink: 0 }} />
            )}
            <span style={{ fontSize: '12px', fontWeight: 600 }}>{toast.message}</span>
          </div>
        ))}
      </div>

      <SafeSynChatbot 
        stats={stats} 
        activeDataset={activeDataset} 
        patients={patients} 
        piiLogs={piiLogs} 
        triggeredMessage={triggeredMessage} 
      />
    </div>
  );
}
