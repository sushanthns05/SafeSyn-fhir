import React, { useState, useEffect } from 'react';
import { 
  Database, Cpu, BarChart3, ShieldCheck, Download, 
  Settings, Sun, Moon, UploadCloud, Clock, 
  Menu, Bell, X, ShieldAlert, CheckCircle2, Home, Activity, Lock, ExternalLink,
  ChevronLeft, ChevronRight, Sparkles, ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Import views
import LandingPage from './components/LandingPage';
import SourceData from './components/SourceData';
import AISynthesis from './components/AISynthesis';
import Analytics from './components/Analytics';
import { ErrorBoundary } from './components/ErrorBoundary';
import Downloads from './components/Downloads';
import SafeSynChatbot from './components/SafeSynChatbot';
import DashboardOverview from './components/DashboardOverview';
import SystemSettings from './components/SystemSettings';
import { DebugBoundary } from './components/DebugBoundary';

// Import parser & data
import { parseFhirBundle, parseCsvText, parseComparisonCsv, parseEvaluationText } from './utils/fhirParser';

export default function App() {
  const [inConsole, setInConsole] = useState(false);
  const [triggeredMessage, setTriggeredMessage] = useState(null);

  const triggerChatbot = (text) => {
    setTriggeredMessage({ text, id: Date.now() });
  };
  const [theme, setTheme] = useState('light'); // default light as requested
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [monitorsOpen, setMonitorsOpen] = useState(true);
  const [auditOpen, setAuditOpen] = useState(true);
  const [actionsOpen, setActionsOpen] = useState(true);

  // Settings state
  const [userProfile, setUserProfile] = useState({
    name: 'Dr. Sarah Jenkins',
    role: 'Principal Researcher',
    avatar: 'SJ'
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Dataset states
  const [activeDataset, setActiveDataset] = useState({
    name: 'synthetic_patients(1)(1).csv',
    size: 'Loading...',
    isSecured: true
  });

  const [stats, setStats] = useState({
    totalRecords: 0,
    detectedFields: 0,
    missingValues: 0,
    riskLevel: 'Low'
  });

  const [patients, setPatients] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [piiLogs, setPiiLogs] = useState([]);
  const [evalStats, setEvalStats] = useState({
    columnShapes: 84.97,
    columnPairTrends: 59.56,
    overallScore: 72.26,
    qualityScore: 0.7177
  });

  // Recent activity logs state
  const [activityLogs, setActivityLogs] = useState([
    { id: 1, text: 'Statistical Synthetic Dataset Analysis Engine initialized', time: 'Just now' }
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

  useEffect(() => {
    // Dynamically fetch both CSVs on load
    const loadDatasets = async () => {
      try {
        const patientsRes = await fetch('/synthetic_patients(1)(1).csv');
        const patientsText = await patientsRes.text();
        const parsedPatients = parseCsvText(patientsText);

        const compRes = await fetch('/statistical_comparison.csv');
        const compText = await compRes.text();
        const parsedComp = parseComparisonCsv(compText);

        try {
          const evalRes = await fetch('/evaluation_results.txt');
          const evalText = await evalRes.text();
          const parsedEval = parseEvaluationText(evalText);
          if (parsedEval) {
            setEvalStats(parsedEval);
          }
        } catch (e) {
          console.warn('Could not load evaluation_results.txt, using defaults', e);
        }

        setPatients(parsedPatients.records);
        setComparisonData(parsedComp);
        
        setActiveDataset({
          name: 'synthetic_patients(1)(1).csv',
          size: `${Math.round(new Blob([patientsText]).size / 1024)} KB`,
          isSecured: true
        });

        setStats({
          totalRecords: parsedPatients.records.length,
          detectedFields: parsedPatients.headers.length,
          missingValues: parsedPatients.missingValues,
          riskLevel: 'Low'
        });

        addActivity(`Loaded ${parsedPatients.records.length} records dynamically.`);

      } catch (err) {
        console.error('Failed to load initial datasets', err);
        addToast('Failed to dynamically load initial datasets', 'error');
      }
    };
    
    loadDatasets();
  }, []);

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
      name: 'synthetic_patients(1)(1).csv',
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
            } else if (file.name.endsWith('.txt')) {
              const result = parseEvaluationText(content);
              if (result) {
                setEvalStats(result);
                addToast(`Evaluation Report parsed successfully.`, 'success');
                addActivity(`Uploaded Evaluation text report: ${file.name}`);
              } else {
                throw new Error('Invalid Evaluation text format.');
              }
            } else {
              throw new Error('Unsupported file extension. Please upload a .json, .csv, or .txt file.');
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
        return <AISynthesis onSynthesisComplete={handleSynthesisComplete} isSecured={activeDataset.isSecured} patients={patients} />;
      case 'analytics':
        return (
          <DebugBoundary>
            <Analytics onExplain={triggerChatbot} comparisonData={comparisonData} patients={patients} evalStats={evalStats} />
          </DebugBoundary>
        );
      case 'downloads':
        return <Downloads patients={patients} comparisonData={comparisonData} stats={stats} evalStats={evalStats} onAddActivity={addActivity} />;
      case 'settings':
        return renderSettingsPage();
      default:
        return renderDashboardOverview();
    }
  };

  // Render integrated Settings Page
  const renderSettingsPage = () => {
    return (
      <SystemSettings 
        userProfile={userProfile}
        setUserProfile={setUserProfile}
        activityLogs={activityLogs}
        addActivity={addActivity}
        theme={theme}
        toggleTheme={toggleTheme}
        addToast={addToast}
      />
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
        patients={patients}
        comparisonData={comparisonData}
        evalStats={evalStats}
        setActiveTab={setActiveTab}
        triggerChatbot={triggerChatbot}
      />
    );
  };

  // Accordion Header Helper
  const renderAccordionHeader = (title, icon, isOpen, toggleFunc) => {
    return (
      <div 
        onClick={toggleFunc}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          borderRadius: '8px',
          background: theme === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
          border: '1px solid var(--border-color)',
          cursor: 'pointer',
          userSelect: 'none',
          transition: 'all 0.2s',
          fontSize: '10px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          color: 'var(--text-primary)',
          marginTop: '4px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center' }}>{icon}</span>
          <span>{title}</span>
        </div>
        {isOpen ? <ChevronDown size={12} style={{ color: 'var(--text-muted)' }} /> : <ChevronRight size={12} style={{ color: 'var(--text-muted)' }} />}
      </div>
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
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`} style={{
        background: theme === 'dark' ? 'rgba(6, 11, 18, 0.75)' : 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxShadow: 'var(--sidebar-shadow)',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        flexShrink: 0
      }}>
        
        {/* Sidebar Logo Header */}
        <div 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          style={{ 
            padding: sidebarCollapsed ? '16px 0' : '16px 20px', 
            borderBottom: '1px solid var(--border-color)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: sidebarCollapsed ? 'center' : 'space-between',
            background: theme === 'dark' ? 'linear-gradient(180deg, rgba(30, 41, 59, 0.2) 0%, rgba(15, 23, 42, 0) 100%)' : 'linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)',
            cursor: 'pointer'
          }}
          title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '22px', filter: 'drop-shadow(0 0 8px var(--color-primary))', flexShrink: 0 }}>🛡️</span>
            {!sidebarCollapsed && (
              <div style={{ animation: 'fade-in 0.2s ease-out' }}>
                <h1 style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '-0.3px', color: 'var(--text-primary)' }}>SafeSyn AI</h1>
                <p style={{ fontSize: '8px', color: 'var(--color-primary)', fontWeight: 800, letterSpacing: '0.8px', textTransform: 'uppercase' }}>Control Center</p>
              </div>
            )}
          </div>
          {!sidebarCollapsed && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setSidebarCollapsed(true);
              }}
              style={{ 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid var(--border-color)', 
                borderRadius: '6px', 
                color: 'var(--text-secondary)', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: '24px', 
                height: '24px',
                transition: 'all 0.2s'
              }}
              title="Collapse Sidebar"
            >
              <ChevronLeft size={14} />
            </button>
          )}
        </div>

        {/* Scrollable Control Panel Body */}
        <div style={{ 
          flexGrow: 1, 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px', 
          padding: sidebarCollapsed ? '12px 8px' : '16px 12px',
          scrollbarWidth: 'none'
        }} className="custom-sidebar-scroll">

          {/* Navigation Menu */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {[
              { id: 'dashboard', label: 'Dashboard Overview', icon: <Home size={18} /> },
              { id: 'source', label: 'Source Patients', icon: <Database size={18} /> },
              { id: 'synthesis', label: 'AI Synthesis', icon: <Cpu size={18} /> },
              { id: 'analytics', label: 'Fidelity & Utility', icon: <BarChart3 size={18} /> },
              { id: 'downloads', label: 'Secure Downloads', icon: <Download size={18} /> },
              { id: 'settings', label: 'System Settings', icon: <Settings size={18} /> }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`sidebar-nav-btn ${activeTab === item.id ? 'active' : ''}`}
                style={{
                  color: activeTab === item.id ? '#FFF' : 'var(--text-secondary)'
                }}
              >
                <span style={{ display: 'flex', shrink: 0 }}>{item.icon}</span>
                {!sidebarCollapsed && <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{item.label}</span>}
              </button>
            ))}
          </nav>

          {/* Real-time control panels (Only visible when expanded) */}
          {!sidebarCollapsed ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', animation: 'fade-in 0.3s ease-out' }}>
              
              {/* Accordion 1: Privacy & Pipeline */}
              {renderAccordionHeader('Privacy & Audit', <ShieldCheck size={13} />, auditOpen, () => setAuditOpen(!auditOpen))}
              {auditOpen && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', animation: 'fade-in 0.2s', padding: '2px 4px 6px 4px' }}>
                  
                  {/* Privacy Risk & Compliance badges */}
                  <div className="glass-panel" style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Privacy Risk</span>
                      <span style={{ 
                        fontSize: '9px', 
                        fontWeight: 800, 
                        padding: '2px 8px', 
                        borderRadius: '4px',
                        backgroundColor: stats.riskLevel === 'Low' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: stats.riskLevel === 'Low' ? '#10B981' : '#EF4444',
                        border: stats.riskLevel === 'Low' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                        boxShadow: stats.riskLevel === 'Low' ? '0 0 8px rgba(16, 185, 129, 0.2)' : '0 0 8px rgba(239, 68, 68, 0.2)'
                      }}>
                        {stats.riskLevel === 'Low' ? 'SECURED DATA' : 'HIGH RISK'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {['HIPAA', 'GDPR', 'NIST-188'].map(badge => (
                        <span key={badge} style={{ fontSize: '8px', fontWeight: 700, backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', padding: '1.5px 5px', borderRadius: '3px' }}>
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Workflow Progress Tracker */}
                  <div className="glass-panel" style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Workflow Status</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative', paddingLeft: '14px' }}>
                      <div style={{ position: 'absolute', left: '4px', top: '4px', bottom: '4px', width: '1px', backgroundColor: 'var(--border-color)' }}></div>
                      {[
                        { label: 'Patient Ingestion', done: patients.length > 0 },
                        { label: 'PII Scan Audit', done: patients.length > 0 },
                        { label: 'AI Synthesis', done: activeDataset.isSecured },
                        { label: 'Secure Export', done: activeDataset.isSecured && stats.riskLevel === 'Low' }
                      ].map((step, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
                          <div style={{ 
                            position: 'absolute', 
                            left: '-14px', 
                            width: '9px', 
                            height: '9px', 
                            borderRadius: '50%', 
                            backgroundColor: step.done ? 'var(--color-primary)' : 'var(--border-color)',
                            border: step.done ? '2px solid #FFF' : '1px solid var(--text-muted)',
                            boxShadow: step.done ? '0 0 6px var(--color-primary)' : 'none'
                          }}></div>
                          <span style={{ 
                            fontSize: '11px', 
                            fontWeight: step.done ? 600 : 500, 
                            color: step.done ? 'var(--text-primary)' : 'var(--text-muted)' 
                          }}>
                            {step.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dataset Health Metrics */}
                  <div className="glass-panel" style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Dataset Health</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Records:</span>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{patients.length.toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>PII Alarms:</span>
                        <span style={{ fontWeight: 700, color: piiLogs.length > 0 ? '#EF4444' : '#10B981' }}>{piiLogs.length}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Quality Rate:</span>
                        <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{activeDataset.isSecured ? `${evalStats?.overallScore || 0}%` : 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* Accordion 2: Engine & Actions */}
              {renderAccordionHeader('Engine & Actions', <Cpu size={13} />, monitorsOpen, () => setMonitorsOpen(!monitorsOpen))}
              {monitorsOpen && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', animation: 'fade-in 0.2s', padding: '2px 4px 6px 4px' }}>
                  
                  {/* AI Copilot & System Health Status */}
                  <div className="glass-panel" style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ position: 'relative', display: 'flex' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 8px #10B981' }}></div>
                        <span style={{ position: 'absolute', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', animation: 'pulse-glow 1.5s infinite', opacity: 0.7 }}></span>
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>SafeSyn Bot Online</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '9px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '6px' }}>
                      <div>Health: <span style={{ color: '#10B981', fontWeight: 700 }}>98%</span></div>
                      <div>Ping: <span style={{ color: '#06B6D4', fontWeight: 700 }}>14ms</span></div>
                    </div>
                  </div>

                  {/* Quick Actions Panel */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      <button 
                        onClick={() => {
                          if (activeDataset.isSecured) {
                            addToast('Dataset is already synthesized!', 'info');
                          } else {
                            setActiveTab('synthesis');
                            addToast('Navigating to AI Synthesizer...', 'info');
                          }
                        }}
                        style={{
                          padding: '6px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(37, 99, 235, 0.1)',
                          border: '1px solid rgba(37, 99, 235, 0.2)',
                          color: 'var(--color-primary)',
                          fontSize: '10.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        <Cpu size={11} /> Synthesize
                      </button>

                      <button 
                        onClick={() => {
                          const chatbotToggler = document.querySelector('[title="Toggle Chatbot"]');
                          if (chatbotToggler) {
                            chatbotToggler.click();
                          } else {
                            addToast('Starting AI Copilot consultation...', 'info');
                          }
                        }}
                        style={{
                          padding: '6px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(124, 58, 237, 0.1)',
                          border: '1px solid rgba(124, 58, 237, 0.2)',
                          color: 'var(--color-secondary)',
                          fontSize: '10.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        <Sparkles size={11} /> Ask Copilot
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* Accordion 3: Alerts & Session */}
              {renderAccordionHeader('Alerts & Session', <Activity size={13} />, actionsOpen, () => setActionsOpen(!actionsOpen))}
              {actionsOpen && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', animation: 'fade-in 0.2s', padding: '2px 4px 6px 4px' }}>
                  
                  {/* Notification Center */}
                  <div className="glass-panel" style={{ padding: '10px 12px', border: '1px solid var(--border-color)', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Recent System Alerts</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '72px', overflowY: 'auto', fontSize: '9.5px', scrollbarWidth: 'none' }}>
                      {activityLogs.slice(0, 2).map((log, idx) => (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingBottom: '4px', borderBottom: idx === 0 ? '1px solid var(--border-color)' : 'none' }}>
                          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{log.text}</span>
                          <span style={{ color: 'var(--text-muted)' }}>{log.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Storage Allocation Indicator */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5px', fontWeight: 700 }}>
                      <span style={{ color: 'var(--text-muted)' }}>DATABASE CACHE</span>
                      <span style={{ color: 'var(--text-secondary)' }}>2.4 GB / 10 GB</span>
                    </div>
                    <div style={{ width: '100%', height: '5px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: '24%', height: '100%', backgroundColor: 'var(--color-primary)', borderRadius: '3px' }}></div>
                    </div>
                  </div>

                  {/* Research Session Details */}
                  <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.05)', border: '1px solid var(--border-color)', fontSize: '9.5px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div><span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>Session Code:</span> SS-9240-SEC</div>
                    <div><span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>Auth Role:</span> Investigator / PI</div>
                  </div>

                </div>
              )}

            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', marginTop: '10px' }}>
              <div 
                style={{ 
                  width: '10px', 
                  height: '10px', 
                  borderRadius: '50%', 
                  backgroundColor: stats.riskLevel === 'Low' ? '#10B981' : '#EF4444',
                  boxShadow: stats.riskLevel === 'Low' ? '0 0 8px #10B981' : '0 0 8px #EF4444'
                }}
                title={`Risk level: ${stats.riskLevel}`}
              ></div>

              <div 
                style={{ 
                  width: '10px', 
                  height: '10px', 
                  borderRadius: '50%', 
                  backgroundColor: '#10B981',
                  boxShadow: '0 0 8px #10B981'
                }}
                title="SafeSyn Copilot Online"
              ></div>
            </div>
          )}

        </div>

        {/* Sidebar Profile & Settings Footer */}
        <div style={{ 
          padding: sidebarCollapsed ? '12px 0' : '16px', 
          borderTop: '1px solid var(--border-color)', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.15)' 
        }}>
          {sidebarCollapsed ? (
            <button 
              onClick={() => setActiveTab('settings')}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Researcher Profile & Settings"
            >
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                backgroundColor: 'rgba(124, 58, 237, 0.2)', 
                border: '1px solid var(--color-secondary)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: 'var(--text-primary)', 
                fontWeight: 800, 
                fontSize: '12px'
              }}>
                {userProfile.avatar}
              </div>
            </button>
          ) : (
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  backgroundColor: 'rgba(124, 58, 237, 0.2)', 
                  border: '1px solid var(--color-secondary)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: 'var(--text-primary)', 
                  fontWeight: 800, 
                  fontSize: '12px', 
                  flexShrink: 0 
                }}>
                  {userProfile.avatar}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{userProfile.name}</p>
                  <p style={{ fontSize: '9px', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{userProfile.role}</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '4px' }}>
                <button 
                  onClick={toggleTheme}
                  style={{ padding: '6px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  title="Toggle Theme"
                >
                  {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                </button>
                <button 
                  onClick={() => setInConsole(false)}
                  style={{ padding: '6px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  title="Exit Console"
                >
                  <Home size={15} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* System Info Footer block */}
        {!sidebarCollapsed && (
          <div style={{ 
            padding: '8px 16px 12px 16px', 
            fontSize: '8px', 
            color: 'var(--text-muted)', 
            textAlign: 'center', 
            borderTop: '1px solid rgba(255,255,255,0.02)',
            background: 'rgba(0,0,0,0.2)'
          }}>
            <span>SafeSyn AI Enterprise Console v2.0.1</span>
            <div style={{ marginTop: '2px' }}>
              <a href="#" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Security Documentation</a>
            </div>
          </div>
        )}

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
        comparisonData={comparisonData} 
      />
    </div>
  );
}
