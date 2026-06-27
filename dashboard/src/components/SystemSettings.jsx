import React, { useState, useEffect } from 'react';
import { 
  User, Shield, Cpu, Bell, Activity, HardDrive, 
  Key, RefreshCw, Download, Database, Check, 
  AlertTriangle, Settings2, Trash2, Power,
  Clock, ShieldAlert, CheckCircle2, Copy, Lock, Eye, EyeOff, Plus, HelpCircle
} from 'lucide-react';

export default function SystemSettings({ 
  userProfile, 
  setUserProfile, 
  activityLogs, 
  addActivity, 
  theme, 
  toggleTheme, 
  addToast 
}) {
  const [settingsTab, setSettingsTab] = useState('profile');

  // Profile state
  const [tempProfile, setTempProfile] = useState({
    name: userProfile.name || 'Dr. Sarah Jenkins',
    role: userProfile.role || 'Principal Researcher',
    org: 'Johns Hopkins Medical AI Center',
    email: 's.jenkins@jhu.edu',
    avatarBg: '#2563EB' // Default blue
  });

  // AI preferences state
  const [aiPrefs, setAiPrefs] = useState({
    epsilon: 4.5,
    noiseMech: 'Laplace Noise',
    modelType: 'CTGAN (Conditional GAN)',
    delta: '1e-5',
    maxEpochs: 150
  });

  // Privacy rules state
  const [privacyRules, setPrivacyRules] = useState({
    hipaaSafe: true,
    gdprPseudo: true,
    nistDeId: false,
    kAnonymity: 5,
    maskZip: true,
    bucketAge: true,
    jitterDates: false
  });

  // Security preferences state
  const [twoFactor, setTwoFactor] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30m');
  const [activeSessions, setActiveSessions] = useState([
    { id: 1, ip: '192.168.1.144', device: 'Chrome / Windows 11 (Current Session)', location: 'Baltimore, MD', active: true },
    { id: 2, ip: '192.168.1.99', device: 'Safari / iPad OS', location: 'Baltimore, MD', active: false },
    { id: 3, ip: '10.0.4.12', device: 'Python Client v2.0', location: 'AWS East (N. Virginia)', active: false }
  ]);

  // Notifications state
  const [notifPrefs, setNotifPrefs] = useState({
    onComplete: true,
    onLeakage: true,
    onAudit: false,
    onApiCall: true
  });

  // API Config state
  const [apiKey, setApiKey] = useState('sk_safesyn_49208acbd722e11894d0');
  const [showApiKey, setShowApiKey] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('https://hospital.jhu.edu/hooks/safesyn');

  // System stats state
  const [gpuLoad, setGpuLoad] = useState(87);
  const [cpuLoad, setCpuLoad] = useState(42);
  const [memoryUsed, setMemoryUsed] = useState(2.4);

  // Uptime state (simulates live counter)
  const [uptimeSeconds, setUptimeSeconds] = useState(1051920); // 12d 4h 12m
  useEffect(() => {
    const timer = setInterval(() => {
      setUptimeSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUptime = (sec) => {
    const d = Math.floor(sec / (3600 * 24));
    const h = Math.floor((sec % (3600 * 24)) / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${d}d ${h}h ${m}m ${s}s`;
  };

  // Handler for regenerating API Key
  const handleRegenerateKey = () => {
    const characters = 'abcdef0123456789';
    let newKey = 'sk_safesyn_';
    for (let i = 0; i < 20; i++) {
      newKey += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setApiKey(newKey);
    addToast('New API key generated successfully!', 'success');
    addActivity('Regenerated developer API secret key');
  };

  // Handler for revoking a session
  const handleRevokeSession = (id, ip) => {
    setActiveSessions(prev => prev.filter(s => s.id !== id));
    addToast(`Revoked active session for IP: ${ip}`, 'info');
    addActivity(`Revoked active login session (IP: ${ip})`);
  };

  // Save profile helper
  const handleSaveProfile = () => {
    setUserProfile({
      name: tempProfile.name,
      role: tempProfile.role,
      avatar: tempProfile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    });
    addToast('Researcher profile updated successfully!', 'success');
    addActivity('Updated system investigator profile settings');
  };

  // Export config helper
  const handleExportConfig = () => {
    const systemConfig = {
      profile: tempProfile,
      aiPreferences: aiPrefs,
      privacyRules,
      security: { twoFactor, sessionTimeout },
      notifications: notifPrefs,
      api: { webhookUrl }
    };
    const blob = new Blob([JSON.stringify(systemConfig, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `safesyn_config_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Configuration settings exported successfully!', 'success');
    addActivity('Exported platform JSON configuration backup');
  };

  // Reset database cache helper
  const handleResetCache = () => {
    if (window.confirm('Are you sure you want to clear the local clinical database synthesis cache? This will clear temporary model weights.')) {
      setMemoryUsed(0.2);
      addToast('Local synthesis cache successfully flushed!', 'success');
      addActivity('Flushed local database model weights cache');
    }
  };

  return (
    <div style={{ animation: 'slide-in 0.4s ease-out', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Header */}
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>ADMIN CONSOLE // CONFIGURATION</span>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', marginTop: '4px' }}>System Settings</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>Configure differential privacy algorithms, developer APIs, and security rules.</p>
        </div>

        {/* System Stats Pill */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '8px 16px', fontSize: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4ADE80', display: 'inline-block', boxShadow: '0 0 8px #4ADE80' }}></span>
            <span style={{ color: 'var(--text-secondary)' }}>Uptime:</span>
            <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>{formatUptime(uptimeSeconds)}</span>
          </div>
          <div style={{ width: '1px', height: '14px', backgroundColor: 'var(--border-color)' }}></div>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Ver:</span>
            <span style={{ fontWeight: 700, marginLeft: '4px', color: 'var(--color-primary)' }}>v2.0.1</span>
          </div>
        </div>
      </div>

      {/* Main Settings Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Left Side Tab Navigation */}
        <div className="glass-panel" style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {[
            { id: 'profile', label: 'Researcher Profile', icon: <User size={16} /> },
            { id: 'ai', label: 'AI & Privacy Config', icon: <Cpu size={16} /> },
            { id: 'health', label: 'Health & Storage', icon: <Activity size={16} /> },
            { id: 'api', label: 'API & Developers', icon: <Key size={16} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSettingsTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: settingsTab === tab.id ? 'rgba(37, 99, 235, 0.15)' : 'transparent',
                color: settingsTab === tab.id ? 'var(--color-primary)' : 'var(--text-secondary)',
                fontWeight: settingsTab === tab.id ? 700 : 500,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.icon}
              <span style={{ fontSize: '13px' }}>{tab.label}</span>
            </button>
          ))}

          <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '8px 0' }}></div>

          {/* Theme toggler inside side menu */}
          <button
            onClick={toggleTheme}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '12px 16px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
          >
            <Settings2 size={16} />
            <span style={{ fontSize: '13px' }}>Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
          </button>
        </div>

        {/* Right Side Content Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* TAB 1: RESEARCHER PROFILE & SECURITY */}
          {settingsTab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Profile Detail Card */}
              <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Investigator Profile</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>Update system investigator credentials and organizational authorization.</p>
                </div>

                <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {/* Custom initials avatar */}
                  <div style={{ position: 'relative' }}>
                    <div style={{ 
                      width: '72px', 
                      height: '72px', 
                      borderRadius: '16px', 
                      backgroundColor: tempProfile.avatarBg, 
                      color: '#FFF', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '24px', 
                      fontWeight: 800,
                      boxShadow: `0 8px 20px ${tempProfile.avatarBg}30`,
                      border: '2px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      {tempProfile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                  </div>

                  {/* Avatar Color Picker */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Avatar Accent Color</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {['#2563EB', '#8B5CF6', '#10B981', '#6366F1', '#EC4899'].map(c => (
                        <button
                          key={c}
                          onClick={() => setTempProfile(prev => ({ ...prev, avatarBg: c }))}
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '6px',
                            backgroundColor: c,
                            border: tempProfile.avatarBg === c ? '2px solid #FFF' : '1px solid rgba(255,255,255,0.1)',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            transform: tempProfile.avatarBg === c ? 'scale(1.15)' : 'none'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Investigator Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={tempProfile.name}
                      onChange={(e) => setTempProfile(prev => ({ ...prev, name: e.target.value }))}
                      style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.15)', color: 'var(--text-primary)', outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Research Role</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={tempProfile.role}
                      onChange={(e) => setTempProfile(prev => ({ ...prev, role: e.target.value }))}
                      style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.15)', color: 'var(--text-primary)', outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Affiliated Institution</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={tempProfile.org}
                      onChange={(e) => setTempProfile(prev => ({ ...prev, org: e.target.value }))}
                      style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.15)', color: 'var(--text-primary)', outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Contact Email</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      value={tempProfile.email}
                      onChange={(e) => setTempProfile(prev => ({ ...prev, email: e.target.value }))}
                      style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.15)', color: 'var(--text-primary)', outline: 'none' }}
                    />
                  </div>
                </div>

                {/* Login Info Block */}
                <div style={{ display: 'flex', gap: '20px', padding: '14px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)', fontSize: '11.5px', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                  <div>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Last Session:</span> 2026-06-27 22:45:11 UTC
                  </div>
                  <div style={{ width: '1px', height: '14px', backgroundColor: 'var(--border-color)' }}></div>
                  <div>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Login IP:</span> 192.168.1.144
                  </div>
                  <div style={{ width: '1px', height: '14px', backgroundColor: 'var(--border-color)' }}></div>
                  <div>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Method:</span> SSO/GitHub Auth
                  </div>
                </div>

                <button 
                  className="btn-primary" 
                  style={{ alignSelf: 'flex-end', minWidth: '140px' }} 
                  onClick={handleSaveProfile}
                >
                  Save Profile Changes
                </button>
              </div>

              {/* Security and Session Settings */}
              <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Security &amp; MFA Controls</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>Manage zero-trust verification criteria and browser sessions.</p>
                </div>

                {/* 2FA Toggle & Timeout */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
                  
                  {/* 2FA Control */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>Two-Factor Authentication (2FA)</span>
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Require SMS or Authenticator TOTP token verification on console login.</p>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={twoFactor}
                        onChange={(e) => {
                          setTwoFactor(e.target.checked);
                          addToast(`2FA verification ${e.target.checked ? 'activated' : 'deactivated'}`, 'info');
                          addActivity(`${e.target.checked ? 'Enabled' : 'Disabled'} Two-Factor Authentication`);
                        }}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span style={{
                        position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: twoFactor ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                        transition: '0.3s', borderRadius: '24px',
                        boxShadow: twoFactor ? '0 0 8px var(--color-primary)' : 'none'
                      }}></span>
                      <span style={{
                        position: 'absolute', content: '""', height: '16px', width: '16px', left: twoFactor ? '24px' : '4px', bottom: '4px',
                        backgroundColor: 'white', transition: '0.3s', borderRadius: '50%'
                      }}></span>
                    </label>
                  </div>

                  {/* Session Timeout */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>Idle Session Timeout</span>
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Automatically sign out after a period of investigator inactivity.</p>
                    </div>
                    <select
                      value={sessionTimeout}
                      onChange={(e) => {
                        setSessionTimeout(e.target.value);
                        addToast(`Session timeout set to ${e.target.value}`, 'success');
                      }}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(0,0,0,0.25)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)',
                        fontSize: '12px',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="15m">15 Minutes</option>
                      <option value="30m">30 Minutes</option>
                      <option value="1h">1 Hour</option>
                      <option value="never">Never (Not Recommended)</option>
                    </select>
                  </div>
                </div>

                {/* Active Sessions list */}
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '10px' }}>Active Connected Sessions</span>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {activeSessions.map(sess => (
                      <div key={sess.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--border-color)', fontSize: '12px' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <span style={{ fontSize: '16px' }}>{sess.active ? '💻' : '📱'}</span>
                          <div>
                            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{sess.ip}</span>
                            <span style={{ color: 'var(--text-secondary)', marginLeft: '8px' }}>{sess.device}</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '10px', display: 'block' }}>{sess.location}</span>
                          </div>
                        </div>
                        
                        {!sess.active ? (
                          <button 
                            onClick={() => handleRevokeSession(sess.id, sess.ip)}
                            style={{
                              backgroundColor: 'transparent',
                              border: '1px solid rgba(239, 68, 68, 0.4)',
                              borderRadius: '4px',
                              color: '#EF4444',
                              padding: '4px 8px',
                              fontSize: '11px',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                            onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
                          >
                            Revoke
                          </button>
                        ) : (
                          <span style={{ fontSize: '10px', color: '#4ADE80', backgroundColor: 'rgba(74, 222, 128, 0.1)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>Current</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI & PRIVACY CONFIGURATION */}
          {settingsTab === 'ai' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* AI Model Preferences */}
              <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800 }}>AI Model Preferences</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>Tweak tabular synthesizers default hyperparameters and noise mechanics.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  
                  {/* Select Synthesis Model */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Default Generative Model</label>
                    <select
                      value={aiPrefs.modelType}
                      onChange={(e) => {
                        setAiPrefs(prev => ({ ...prev, modelType: e.target.value }));
                        addToast(`Switched active AI model to ${e.target.value.split(' ')[0]}`, 'info');
                      }}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(0,0,0,0.15)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)',
                        fontSize: '13px',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="CTGAN (Conditional GAN)">CTGAN (Conditional GAN) - Tabular</option>
                      <option value="TVAE (Variational Autoencoder)">TVAE (Variational Autoencoder) - Speedy</option>
                      <option value="PrivaSynth-Transformer">PrivaSynth-Transformer - Multi-modal</option>
                    </select>
                  </div>

                  {/* Noise Mechanism */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Noise Addition Mechanism</label>
                    <select
                      value={aiPrefs.noiseMech}
                      onChange={(e) => setAiPrefs(prev => ({ ...prev, noiseMech: e.target.value }))}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(0,0,0,0.15)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)',
                        fontSize: '13px',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Laplace Noise">Laplace Noise (Standard)</option>
                      <option value="Gaussian Noise">Gaussian Noise (Strong Average)</option>
                      <option value="Exponential Noise">Exponential Noise (Structured)</option>
                    </select>
                  </div>

                  {/* Delta Parameter */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Differential Delta (δ)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={aiPrefs.delta}
                      onChange={(e) => setAiPrefs(prev => ({ ...prev, delta: e.target.value }))}
                      style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.15)', color: 'var(--text-primary)', outline: 'none' }}
                    />
                  </div>

                  {/* Max Training Epochs */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Maximum Epochs Limit</label>
                    <input
                      type="number"
                      className="form-input"
                      value={aiPrefs.maxEpochs}
                      onChange={(e) => setAiPrefs(prev => ({ ...prev, maxEpochs: parseInt(e.target.value) }))}
                      style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.15)', color: 'var(--text-primary)', outline: 'none' }}
                    />
                  </div>
                </div>

                {/* Epsilon Slider Gauge */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>Target Epsilon Limit (ε)</span>
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Lower Epsilon guarantees absolute privacy but reduces fidelity; higher Epsilon increases dataset realism.</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-primary)' }}>{aiPrefs.epsilon}</span>
                      <span style={{ 
                        fontSize: '9px', 
                        fontWeight: 700, 
                        textTransform: 'uppercase', 
                        padding: '2px 6px', 
                        borderRadius: '4px', 
                        marginTop: '2px',
                        backgroundColor: aiPrefs.epsilon < 2 ? 'rgba(16, 185, 129, 0.15)' : aiPrefs.epsilon <= 5 ? 'rgba(37, 99, 235, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: aiPrefs.epsilon < 2 ? '#10B981' : aiPrefs.epsilon <= 5 ? '#3B82F6' : '#EF4444'
                      }}>
                        {aiPrefs.epsilon < 2 ? 'High Privacy' : aiPrefs.epsilon <= 5 ? 'Balanced Utility' : 'High Utility Risk'}
                      </span>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="0.1"
                    max="10.0"
                    step="0.1"
                    value={aiPrefs.epsilon}
                    onChange={(e) => setAiPrefs(prev => ({ ...prev, epsilon: parseFloat(e.target.value) }))}
                    style={{ width: '100%', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                  />
                </div>
              </div>

              {/* Privacy Configuration Settings */}
              <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Privacy Rules &amp; Compliance Standards</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>Enable automatic de-identification logic matching global frameworks.</p>
                </div>

                {/* Compliance Frameworks Toggles */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { id: 'hipaaSafe', label: 'HIPAA Safe Harbor Compliance Check', desc: 'Enforce scanning and automatic zero-replication masking of all 18 standard PHI identifiers.', state: privacyRules.hipaaSafe },
                    { id: 'gdprPseudo', label: 'GDPR Pseudonymization Standards', desc: 'Truncate numeric keys, replace raw IDs with hash tokens, and sanitize nested JSON resources.', state: privacyRules.gdprPseudo },
                    { id: 'nistDeId', label: 'NIST De-identification Framework (SP 800-188)', desc: 'Impose cell frequency limits and structural quasi-identifier suppression.', state: privacyRules.nistDeId }
                  ].map(rule => (
                    <div key={rule.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)' }}>
                      <div style={{ flexGrow: 1, paddingRight: '16px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>{rule.label}</span>
                        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{rule.desc}</p>
                      </div>
                      <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px', cursor: 'pointer', flexShrink: 0 }}>
                        <input 
                          type="checkbox" 
                          checked={rule.state}
                          onChange={(e) => {
                            setPrivacyRules(prev => ({ ...prev, [rule.id]: e.target.checked }));
                            addToast(`${rule.label.split(' ')[0]} policy ${e.target.checked ? 'enforced' : 'released'}`, 'info');
                            addActivity(`Modified compliance policy: ${rule.label}`);
                          }}
                          style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span style={{
                          position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                          backgroundColor: rule.state ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                          transition: '0.3s', borderRadius: '24px',
                          boxShadow: rule.state ? '0 0 8px var(--color-primary)' : 'none'
                        }}></span>
                        <span style={{
                          position: 'absolute', content: '""', height: '16px', width: '16px', left: rule.state ? '24px' : '4px', bottom: '4px',
                          backgroundColor: 'white', transition: '0.3s', borderRadius: '50%'
                        }}></span>
                      </label>
                    </div>
                  ))}
                </div>

                {/* Quasi-Identifier parameters */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  
                  {/* k-Anonymity Slider */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>k-Anonymity Threshold</span>
                        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Ensures each unique cohort contains at least k identical records.</p>
                      </div>
                      <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-secondary)' }}>k = {privacyRules.kAnonymity}</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="20"
                      step="1"
                      value={privacyRules.kAnonymity}
                      onChange={(e) => setPrivacyRules(prev => ({ ...prev, kAnonymity: parseInt(e.target.value) }))}
                      style={{ width: '100%', accentColor: 'var(--color-secondary)', cursor: 'pointer' }}
                    />
                  </div>

                  {/* Masking configurations */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '8px' }}>
                    {[
                      { id: 'maskZip', label: 'Mask ZIP codes to 3-digit prefixes', state: privacyRules.maskZip },
                      { id: 'bucketAge', label: 'Bucket patient ages in 5-year brackets', state: privacyRules.bucketAge },
                      { id: 'jitterDates', label: 'Jitter clinical event timestamps (+/- 14d)', state: privacyRules.jitterDates }
                    ].map(mask => (
                      <div key={mask.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                          type="checkbox"
                          id={mask.id}
                          checked={mask.state}
                          onChange={(e) => setPrivacyRules(prev => ({ ...prev, [mask.id]: e.target.checked }))}
                          style={{ width: '15px', height: '15px', cursor: 'pointer' }}
                        />
                        <label htmlFor={mask.id} style={{ fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer' }}>{mask.label}</label>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SYSTEM HEALTH & STORAGE */}
          {settingsTab === 'health' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Health and Storage Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                
                {/* Health Monitoring Card */}
                <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800 }}>System Health &amp; Load</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>Real-time dashboard computing resources and latency benchmarks.</p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    
                    {/* GPU load bar */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>GPU Utilization (A100 Tensor Core)</span>
                        <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{gpuLoad}%</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${gpuLoad}%`, height: '100%', backgroundColor: 'var(--color-primary)', transition: 'width 0.5s ease-out' }}></div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        <span>Allocated VRAM: 32 GB / 40 GB</span>
                        <span>Temp: 64°C</span>
                      </div>
                    </div>

                    {/* CPU load bar */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>CPU Utilization (Intel Xeon)</span>
                        <span style={{ color: 'var(--color-secondary)', fontWeight: 700 }}>{cpuLoad}%</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${cpuLoad}%`, height: '100%', backgroundColor: 'var(--color-secondary)', transition: 'width 0.5s ease-out' }}></div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        <span>Threads: 16 Cores / 32 Threads</span>
                        <span>API Node Ping: 14ms</span>
                      </div>
                    </div>

                    {/* System state metrics */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '8px' }}>
                      <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>API Response Latency</span>
                        <span style={{ fontSize: '18px', fontWeight: 800, color: '#4ADE80' }}>14 ms</span>
                      </div>
                      <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Active Threads</span>
                        <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-secondary)' }}>284</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Storage indicators */}
                <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Storage Allocations</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>Database space tracking and local cached patient datasets index.</p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', justifyContent: 'space-between' }}>
                    
                    {/* Database usage bar */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>SafeSyn Local Database Cache</span>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{((memoryUsed / 10) * 100).toFixed(0)}%</span>
                      </div>
                      <div style={{ width: '100%', height: '12px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden', padding: '2px' }}>
                        <div style={{ width: `${(memoryUsed / 10) * 100}%`, height: '100%', backgroundColor: 'var(--gradient-primary)', borderRadius: '4px', transition: 'width 0.5s ease-out' }}></div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        <span>Used: {memoryUsed.toFixed(1)} GB</span>
                        <span>Total Available Limit: 10 GB</span>
                      </div>
                    </div>

                    {/* Clean cache control */}
                    <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#EF4444', display: 'block' }}>Flush Temporary Cache</span>
                        <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Clear locally stored synthetic model checkouts.</span>
                      </div>
                      <button 
                        onClick={handleResetCache}
                        style={{
                          backgroundColor: '#EF4444',
                          border: 'none',
                          borderRadius: '6px',
                          color: '#FFF',
                          padding: '6px 12px',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Trash2 size={12} /> Flush Cache
                      </button>
                    </div>

                  </div>
                </div>

              </div>

              {/* Backup & Export Panel */}
              <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Platform Backup &amp; Configurations Restore</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>Download current dashboard parameters or restore platform configs defaults.</p>
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button 
                    onClick={handleExportConfig}
                    className="btn-primary" 
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Download size={14} /> Export Platform Configuration (.json)
                  </button>

                  <button 
                    onClick={() => {
                      if (window.confirm('Restore system settings to default enterprise configuration? This cannot be undone.')) {
                        setAiPrefs({
                          epsilon: 4.5,
                          noiseMech: 'Laplace Noise',
                          modelType: 'CTGAN (Conditional GAN)',
                          delta: '1e-5',
                          maxEpochs: 150
                        });
                        setPrivacyRules({
                          hipaaSafe: true,
                          gdprPseudo: true,
                          nistDeId: false,
                          kAnonymity: 5,
                          maskZip: true,
                          bucketAge: true,
                          jitterDates: false
                        });
                        setTwoFactor(true);
                        setSessionTimeout('30m');
                        addToast('Platform configurations restored to factory defaults!', 'success');
                        addActivity('Restored platform settings to system defaults');
                      }
                    }}
                    style={{
                      backgroundColor: 'transparent',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      padding: '10px 18px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <RefreshCw size={14} /> Restore Default Settings
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: DEVELOPER & API CONFIGURATION */}
          {settingsTab === 'api' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* API and developer Credentials */}
              <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Developer API Keys</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>Manage secret authorization keys used to submit synthesis batches via the command line.</p>
                </div>

                {/* API Key box */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active API Secret Token</label>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ 
                      flexGrow: 1, 
                      padding: '12px 16px', 
                      borderRadius: '8px', 
                      backgroundColor: 'rgba(0,0,0,0.3)', 
                      border: '1px solid var(--border-color)', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      fontFamily: 'monospace',
                      fontSize: '13px',
                      color: '#FFF'
                    }}>
                      <span>
                        {showApiKey ? apiKey : 'sk_safesyn_••••••••••••••••••••'}
                      </span>
                      
                      <button 
                        onClick={() => setShowApiKey(!showApiKey)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', padding: '2px' }}
                      >
                        {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(apiKey);
                        addToast('API key copied to clipboard!', 'success');
                      }}
                      style={{
                        padding: '10px 16px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Copy Key"
                    >
                      <Copy size={16} />
                    </button>

                    <button 
                      onClick={handleRegenerateKey}
                      style={{
                        padding: '10px 16px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        color: 'var(--color-primary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontWeight: 700,
                        fontSize: '12.5px'
                      }}
                    >
                      <RefreshCw size={14} /> Regenerate Key
                    </button>
                  </div>
                </div>

                {/* API Endpoints */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>API Synthesis Endpoint URL</label>
                    <div style={{ 
                      padding: '10px 14px', 
                      borderRadius: '8px', 
                      backgroundColor: 'rgba(0,0,0,0.15)', 
                      border: '1px solid var(--border-color)', 
                      fontFamily: 'monospace', 
                      fontSize: '12px',
                      color: 'var(--color-primary)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span>https://api.safesyn.ai/v2/synthesize</span>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText('https://api.safesyn.ai/v2/synthesize');
                          addToast('Endpoint URL copied to clipboard!', 'success');
                        }}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}
                      >
                        <Copy size={12} />
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Webhook notification Target URL</label>
                    <input
                      type="text"
                      className="form-input"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.15)', color: 'var(--text-primary)', outline: 'none' }}
                    />
                  </div>
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Notification Dispatch Rules</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>Configure target events for dispatcher emails and browser notifications.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {[
                    { id: 'onComplete', label: 'AI Synthesis Completed', desc: 'Email alerts when a queued patient synthesizer wraps.' },
                    { id: 'onLeakage', label: 'High Leakage Risk Warning', desc: 'Send emergency alerts if statistical duplication exceeds 2%.' },
                    { id: 'onApiCall', label: 'Developer API Token Invocation', desc: 'Alert account of script authentication triggers.' },
                    { id: 'onAudit', label: 'System Compliance Scans Logs', desc: 'Receive daily digests of HIPAA Safe Harbor status logs.' }
                  ].map(rule => (
                    <div key={rule.id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <input
                        type="checkbox"
                        id={`notif-${rule.id}`}
                        checked={notifPrefs[rule.id]}
                        onChange={(e) => setNotifPrefs(prev => ({ ...prev, [rule.id]: e.target.checked }))}
                        style={{ width: '16px', height: '16px', marginTop: '3px', cursor: 'pointer' }}
                      />
                      <div>
                        <label htmlFor={`notif-${rule.id}`} style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', cursor: 'pointer' }}>{rule.label}</label>
                        <p style={{ fontSize: '10.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>{rule.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Settings Activity Logs */}
              <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Platform Audit Activity Trail</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>Immutable ledger logs of platform configuration adjustments.</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                  {activityLogs.filter(log => 
                    log.text.toLowerCase().includes('settings') || 
                    log.text.toLowerCase().includes('profile') || 
                    log.text.toLowerCase().includes('api') || 
                    log.text.toLowerCase().includes('2fa') || 
                    log.text.toLowerCase().includes('config')
                  ).length === 0 ? (
                    <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                      No settings configuration adjustments audited recently.
                    </div>
                  ) : (
                    activityLogs.filter(log => 
                      log.text.toLowerCase().includes('settings') || 
                      log.text.toLowerCase().includes('profile') || 
                      log.text.toLowerCase().includes('api') || 
                      log.text.toLowerCase().includes('2fa') || 
                      log.text.toLowerCase().includes('config')
                    ).map(log => (
                      <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '6px', backgroundColor: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--border-color)', fontSize: '11.5px' }}>
                        <span style={{ color: 'var(--text-primary)' }}>{log.text}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{log.time}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
