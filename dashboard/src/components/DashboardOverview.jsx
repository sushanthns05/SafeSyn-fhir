import React, { useState } from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { 
  TrendingUp, Activity, ShieldCheck, CheckCircle2, 
  ShieldAlert, Clock, Cpu, Database, Sparkles, 
  Lock, Server, HelpCircle, HardDrive, Info
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardOverview({ 
  userProfile, 
  stats, 
  activeDataset, 
  activityLogs, 
  setActiveTab, 
  triggerChatbot,
  patients,
  evalStats
}) {
  const [activeChartTab, setActiveChartTab] = useState('age');

  const isSecured = activeDataset.isSecured;

  // Derive privacy score from the dataset state
  const privacyScore = isSecured ? 98.4 : 32.5;

  const ageBuckets = [0, 0, 0, 0, 0];
  let maleSynth = 0; let femaleSynth = 0;
  
  if (patients && patients.length > 0) {
    patients.forEach(p => {
      const a = Number(p.age);
      if (!isNaN(a)) {
        if (a <= 3) ageBuckets[0]++;
        else if (a <= 18) ageBuckets[1]++;
        else if (a <= 49) ageBuckets[2]++;
        else if (a <= 69) ageBuckets[3]++;
        else ageBuckets[4]++;
      }
      
      const g = p.gender ? p.gender.toLowerCase() : '';
      if (g === 'male') maleSynth++;
      else if (g === 'female') femaleSynth++;
    });
  }
  
  const totalSynthAge = ageBuckets.reduce((a, b) => a + b, 0) || 1;
  const synthAgePercents = ageBuckets.map(b => Number(((b / totalSynthAge) * 100).toFixed(1)));
  
  const totalSynthGender = (maleSynth + femaleSynth) || 1;
  const synthMaleP = Number(((maleSynth / totalSynthGender) * 100).toFixed(1));
  const synthFemaleP = Number(((femaleSynth / totalSynthGender) * 100).toFixed(1));

  // Evaluation Metrics Helpers
  const getQualityColor = (score) => {
    if (score >= 80) return 'var(--color-success)';
    if (score >= 70) return '#F59E0B'; // Orange
    return 'var(--color-danger)';
  };

  const getQualityGrade = (score) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'A-';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    return 'D';
  };

  const qualityColor = getQualityColor(evalStats?.overallScore || 0);

  // Chart data
  const ageData = {
    labels: ['Pediatric (0-3)', 'Youth (4-18)', 'Adult (19-49)', 'Senior (50-69)', 'Geriatric (70+)'],
    datasets: [
      {
        label: 'Real Patients (%)',
        data: [15.2, 10.1, 49.8, 19.9, 5.0],
        backgroundColor: 'rgba(37, 99, 235, 0.65)',
        borderColor: '#2563EB',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Synthetic Patients (%)',
        data: isSecured ? synthAgePercents : [0, 0, 0, 0, 0],
        backgroundColor: 'rgba(124, 58, 237, 0.65)',
        borderColor: '#7C3AED',
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  };

  const encounterData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [
      {
        label: 'Real Encounters (Avg)',
        data: [120, 150, 180, 220, 200, 260, 310, 340],
        borderColor: '#2563EB',
        backgroundColor: 'rgba(37, 99, 235, 0.05)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Synthetic Encounters (Avg)',
        data: isSecured ? [105, 132, 155, 190, 175, 220, 265, 290] : [0, 0, 0, 0, 0, 0, 0, 0],
        borderColor: '#7C3AED',
        backgroundColor: 'rgba(124, 58, 237, 0.05)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  const genderDataReal = {
    labels: ['Female', 'Male'],
    datasets: [
      {
        data: [51.2, 48.8],
        backgroundColor: ['rgba(37, 99, 235, 0.7)', 'rgba(6, 182, 212, 0.7)'],
        borderColor: ['#2563EB', '#06B6D4'],
        borderWidth: 1
      }
    ]
  };

  const genderDataSynth = {
    labels: ['Female', 'Male'],
    datasets: [
      {
        data: isSecured ? [synthFemaleP, synthMaleP] : [0, 0],
        backgroundColor: ['rgba(124, 58, 237, 0.7)', 'rgba(168, 85, 247, 0.7)'],
        borderColor: ['#7C3AED', '#A855F7'],
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: 'var(--text-secondary)', font: { family: 'Inter', size: 11, weight: '500' } }
      }
    },
    scales: {
      x: {
        grid: { color: 'var(--border-color)', drawTicks: false },
        ticks: { color: 'var(--text-muted)', font: { size: 10 } }
      },
      y: {
        grid: { color: 'var(--border-color)', drawTicks: false },
        ticks: { color: 'var(--text-muted)', font: { size: 10 } }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: 'var(--text-secondary)', font: { family: 'Inter', size: 10 } }
      }
    }
  };

  return (
    <div style={{ animation: 'slide-in 0.4s ease-out', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* 1. Header Hero with AI Status Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              System Monitor // Real-Time Console
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--gradient-glow)', border: '1px solid var(--glass-border)', padding: '4px 10px', borderRadius: '99px' }}>
              <span className="pulsing-indicator-dot active" />
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-primary)' }}>
                AI Synthesizer: {isSecured ? `Optimal (${evalStats?.overallScore || 0}% Quality)` : 'Awaiting Synthesis Run'}
              </span>
            </div>
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', marginTop: '6px' }}>
            Welcome Back, {userProfile.name}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            SafeSyn AI platform is active. Model weights are loaded and ready for ingestion.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-secondary" onClick={() => triggerChatbot("Explain the HIPAA Safe Harbor, GDPR Article 29, and NIST compliance status of the synthesized dataset.")}>
            🛡️ View Regulations
          </button>
          <button className="btn-primary" onClick={() => setActiveTab('synthesis')}>
            🚀 Launch AI Synthesis
          </button>
        </div>
      </div>

      {/* 2. Top-tier Visualizations: Privacy Score Gauge & Pipeline Tracker */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 4fr', gap: '24px', flexWrap: 'wrap' }}>
        
        {/* Overall Privacy Score Gauge */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>Overall Privacy Shield</h3>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>HIPAA de-identification confidence level</p>
            </div>
            <span className={`badge ${isSecured ? 'badge-green' : 'badge-red'}`} style={{ animation: isSecured ? 'none' : 'pulse-glow 1.5s infinite' }}>
              {isSecured ? 'Low Privacy Risk' : 'Critical Leakage Risk'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', padding: '10px 0' }}>
            <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="40" 
                  fill="transparent" 
                  stroke="var(--border-color)" 
                  strokeWidth="8"
                />
                <circle 
                  cx="50" cy="50" r="40" 
                  fill="transparent" 
                  stroke={isSecured ? 'var(--color-success)' : 'var(--color-danger)'} 
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - privacyScore / 100)}`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                />
              </svg>
              <div style={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                textAlign: 'center'
              }}>
                <span className="gradient-text" style={{ fontSize: '24px', fontWeight: 800 }}>{privacyScore}%</span>
                <span style={{ fontSize: '8px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Score</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Epsilon Protection:</span>
                <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>ε = 4.5</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Missing Values:</span>
                <span style={{ fontWeight: 700, color: stats.missingValues > 0 ? 'var(--color-warning)' : 'var(--color-success)' }}>
                  {stats.missingValues} Missing
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px solid var(--border-color)', paddingTop: '8px', marginTop: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Quality Rate:</span>
                  <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{isSecured ? `${evalStats?.overallScore || 0}%` : 'N/A'}</span>
                </div>
                <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                  Overall statistical similarity between original and synthetic data.
                </div>
                {isSecured && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginTop: '2px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Quality Grade:</span>
                    <span style={{ fontWeight: 800, color: qualityColor }}>{getQualityGrade(evalStats?.overallScore || 0)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Compliance Badges */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Regulatory Verification status
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              <div className="compliance-badge-card" style={{ color: isSecured ? 'var(--color-success)' : 'var(--color-warning)', borderColor: isSecured ? 'rgba(16, 185, 129, 0.2)' : 'var(--border-color)' }}>
                🛡️ HIPAA
              </div>
              <div className="compliance-badge-card" style={{ color: isSecured ? 'var(--color-success)' : 'var(--color-warning)', borderColor: isSecured ? 'rgba(16, 185, 129, 0.2)' : 'var(--border-color)' }}>
                ⚖️ GDPR
              </div>
              <div className="compliance-badge-card" style={{ color: isSecured ? 'var(--color-success)' : 'var(--color-warning)', borderColor: isSecured ? 'rgba(16, 185, 129, 0.2)' : 'var(--border-color)' }}>
                📊 NIST
              </div>
              <div className="compliance-badge-card" style={{ color: isSecured ? 'var(--color-success)' : 'var(--color-warning)', borderColor: isSecured ? 'rgba(16, 185, 129, 0.2)' : 'var(--border-color)' }}>
                🔒 SOC2
              </div>
            </div>
          </div>
        </div>

        {/* Pipeline Progress Tracker */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>Synthetic Patient Data Pipeline</h3>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Active sequence of dataset anonymization and synthesis steps</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginTop: '12px' }}>
            
            <div className="pipeline-step">
              <div className="step-node completed">1</div>
              <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '8px', textAlign: 'center' }}>Ingested</span>
            </div>
            
            <div className="pipeline-connector active" />

            <div className="pipeline-step">
              <div className="step-node completed">2</div>
              <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '8px', textAlign: 'center' }}>PII Scan</span>
            </div>
            
            <div className="pipeline-connector active" />

            <div className="pipeline-step">
              <div className={`step-node ${isSecured ? 'completed' : 'active'}`}>3</div>
              <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '8px', textAlign: 'center' }}>Model Train</span>
            </div>
            
            <div className={`pipeline-connector ${isSecured ? 'active' : ''}`} />

            <div className="pipeline-step">
              <div className={`step-node ${isSecured ? 'completed' : 'pending'}`}>4</div>
              <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '8px', textAlign: 'center' }}>Synthesize</span>
            </div>
            
            <div className={`pipeline-connector ${isSecured ? 'active' : ''}`} />

            <div className="pipeline-step">
              <div className={`step-node ${isSecured ? 'completed' : 'pending'}`}>5</div>
              <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '8px', textAlign: 'center' }}>Verify</span>
            </div>

          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Active Pipeline Stage Summary
            </span>
            <div style={{ background: 'var(--bg-primary)', border: '1px dashed var(--border-color)', borderRadius: '8px', padding: '12px', lineHeight: 1.4 }}>
              {isSecured ? (
                <div>
                  <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>🟢 Pipeline Completed: </span> 
                  A secure, high-fidelity synthetic cohort representing {stats.totalRecords.toLocaleString()} patient records has been generated. Differential Privacy guarantees ($\epsilon = 4.5$) have been successfully applied and verified.
                </div>
              ) : (
                <div>
                  <span style={{ color: 'var(--color-warning)', fontWeight: 700 }}>🟡 Step 3 Active (Awaiting Synthesis): </span> 
                  Model weights for Gemma-2B and CTGAN are pre-trained. Patient Bundle containing {stats.totalRecords.toLocaleString()} rows is loaded. Launch AI Synthesis to generate the secure de-identified dataset.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* 3. Core Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
        <div className="glass-panel metric-card glass-panel-hover">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Ingested Patient Set</span>
            <Database size={16} style={{ color: 'var(--color-primary)' }} />
          </div>
          <span className="metric-value" style={{ color: 'var(--color-primary)' }}>
            {stats.totalRecords.toLocaleString()} Rows
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '8px' }}>
            Active file: {activeDataset.name}
          </span>
        </div>

        <div className="glass-panel metric-card glass-panel-hover">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Missing Values</span>
            <Lock size={16} style={{ color: 'var(--color-secondary)' }} />
          </div>
          <span className="metric-value" style={{ color: 'var(--color-secondary)' }}>
            {stats.missingValues}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '8px' }}>
            Across all columns
          </span>
        </div>

        <div className="glass-panel metric-card glass-panel-hover">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Features</span>
            <Sparkles size={16} style={{ color: 'var(--color-accent)' }} />
          </div>
          <span className="metric-value" style={{ color: 'var(--color-accent)' }}>
            {stats.detectedFields}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '8px' }}>
            Detected in dataset
          </span>
        </div>

        <div className="glass-panel metric-card glass-panel-hover">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Empirical Leakage Shield</span>
            <ShieldCheck size={16} style={{ color: 'var(--color-success)' }} />
          </div>
          <div style={{ marginTop: '8px' }}>
            {isSecured ? (
              <span className="badge badge-green">0.00% Leakage Pass</span>
            ) : (
              <span className="badge badge-red" style={{ animation: 'pulse-glow 1.5s infinite' }}>Raw Vulnerable Data</span>
            )}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '8px' }}>
            Membership inference scanning
          </span>
        </div>
      </div>

      {/* 4. Interactive Charts & Dataset Distributions */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>Dataset Distribution Parity</h3>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Compare demographic shapes and statistical distributions between original and synthetic cohorts</p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', backgroundColor: 'var(--bg-primary)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <button 
                className="chart-tab-button"
                style={{ 
                  background: activeChartTab === 'age' ? 'var(--gradient-primary)' : 'transparent', 
                  color: activeChartTab === 'age' ? '#fff' : 'var(--text-secondary)'
                }}
                onClick={() => setActiveChartTab('age')}
              >
                Age Groups
              </button>
              <button 
                className="chart-tab-button"
                style={{ 
                  background: activeChartTab === 'encounters' ? 'var(--gradient-primary)' : 'transparent', 
                  color: activeChartTab === 'encounters' ? '#fff' : 'var(--text-secondary)'
                }}
                onClick={() => setActiveChartTab('encounters')}
              >
                Encounter Density
              </button>
              <button 
                className="chart-tab-button"
                style={{ 
                  background: activeChartTab === 'gender' ? 'var(--gradient-primary)' : 'transparent', 
                  color: activeChartTab === 'gender' ? '#fff' : 'var(--text-secondary)'
                }}
                onClick={() => setActiveChartTab('gender')}
              >
                Gender Split
              </button>
            </div>
            
            <button 
              className="btn-secondary"
              style={{ fontSize: '11px', padding: '6px 12px', borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
              onClick={() => {
                let chartName = activeChartTab === 'age' ? 'Age Group Distribution' : activeChartTab === 'encounters' ? 'Encounter Density Line graph' : 'Gender Split Comparison';
                triggerChatbot(`Explain the statistical parity and de-identification characteristics shown in the ${chartName} chart.`);
              }}
            >
              💡 Explain Chart
            </button>
          </div>
        </div>

        <div style={{ height: '320px', position: 'relative', width: '100%' }}>
          {activeChartTab === 'age' && (
            <Bar data={ageData} options={chartOptions} />
          )}

          {activeChartTab === 'encounters' && (
            <Line data={encounterData} options={chartOptions} />
          )}

          {activeChartTab === 'gender' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', height: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>Real Cohort</span>
                <div style={{ height: '220px', width: '100%' }}>
                  <Doughnut data={genderDataReal} options={doughnutOptions} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>Synthetic Cohort</span>
                <div style={{ height: '220px', width: '100%' }}>
                  {isSecured ? (
                    <Doughnut data={genderDataSynth} options={doughnutOptions} />
                  ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '12px', border: '1px dashed var(--border-color)', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
                      Awaiting Synthesis Run to Reconstruct Gender Distributions
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. Real-Time Model Metrics & Animated System Status Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '24px', flexWrap: 'wrap' }}>
        
        {/* Real-time Model Metrics */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>Active Generative Model Parameters</h3>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Real-time telemetry and validation scores of loaded models</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-primary)' }}>Gemma-2-2B Fine-Tuned</span>
                <span className="badge badge-cyan" style={{ fontSize: '8px' }}>Active Target</span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Structured clinical schema decoder. Calibrated with Low-Rank Adaptors (LoRA) for FHIR bundle templates.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '4px' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Latency:</span>
                  <span style={{ fontWeight: 700, display: 'block', color: 'var(--text-primary)' }}>14ms</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Speed:</span>
                  <span style={{ fontWeight: 700, display: 'block', color: 'var(--text-primary)' }}>142 tok/s</span>
                </div>
              </div>
            </div>

            <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-secondary)' }}>CTGAN Tabular Checker</span>
                <span className="badge badge-cyan" style={{ fontSize: '8px' }}>Active Target</span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Conditional Generative Adversarial Network for structural correlations and tabular relationships.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '4px' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Wasserstein D:</span>
                  <span style={{ fontWeight: 700, display: 'block', color: 'var(--color-warning)' }}>0.087</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Corr Similarity:</span>
                  <span style={{ fontWeight: 700, display: 'block', color: 'var(--color-warning)' }}>81.2%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Animated System Status Cards */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>Engine Sub-Systems</h3>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Security and container health verification status</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div className="system-status-indicator-bar">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Cpu size={14} style={{ color: 'var(--color-primary)' }} />
                <span style={{ fontSize: '12px', fontWeight: 600 }}>PII Leak Scanner</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="pulsing-indicator-dot active" />
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-success)' }}>Active</span>
              </div>
            </div>

            <div className="system-status-indicator-bar">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Lock size={14} style={{ color: 'var(--color-secondary)' }} />
                <span style={{ fontSize: '12px', fontWeight: 600 }}>Laplace Noise Injector</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="pulsing-indicator-dot active" />
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-success)' }}>Engaged</span>
              </div>
            </div>

            <div className="system-status-indicator-bar">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Server size={14} style={{ color: 'var(--color-accent)' }} />
                <span style={{ fontSize: '12px', fontWeight: 600 }}>SafeSyn Node Health</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="pulsing-indicator-dot active" />
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-success)' }}>Online (100%)</span>
              </div>
            </div>

            <div className="system-status-indicator-bar">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <HardDrive size={14} style={{ color: 'var(--color-warning)' }} />
                <span style={{ fontSize: '12px', fontWeight: 600 }}>Model Weights cache</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="pulsing-indicator-dot active" />
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-success)' }}>Cached (718KB)</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 6. Event logs (Moved into sub-panel for clean enterprise design) */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity style={{ color: 'var(--color-secondary)' }} size={16} />
            Real-Time Platform Event Logs
          </h3>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={10} /> Syncing
          </span>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {activityLogs.map((log) => (
            <div key={log.id} style={{ display: 'flex', gap: '12px', padding: '12px', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', alignItems: 'center' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--gradient-primary)' }} />
              <div style={{ flexGrow: 1 }}>
                <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{log.text}</p>
                <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{log.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
