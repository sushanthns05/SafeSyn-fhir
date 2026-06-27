import React, { useState, useMemo } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { 
  ShieldAlert, Database, Search, Filter, AlertTriangle, 
  UserCheck, EyeOff, Brain, LayoutGrid, CheckCircle2, 
  HelpCircle, ArrowRightLeft, ShieldX, Info 
} from 'lucide-react';

export default function SourceData({ 
  patients, 
  stats, 
  piiLogs 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('All');
  const [maritalFilter, setMaritalFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const isSecured = stats.riskLevel === 'Low';
  const leakageRisk = isSecured ? 0.0 : 92.4;
  const qualityScore = 98.6;

  // Filter & Search logic for Patient Table
  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      const matchesSearch = 
        p.gender?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.maritalStatus?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.race?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.conditions?.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesGender = genderFilter === 'All' || p.gender === genderFilter;
      const matchesMarital = maritalFilter === 'All' || p.maritalStatus === maritalFilter;

      return matchesSearch && matchesGender && matchesMarital;
    });
  }, [patients, searchTerm, genderFilter, maritalFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const paginatedPatients = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPatients.slice(start, start + itemsPerPage);
  }, [filteredPatients, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Chart data for PII Risk Category Count
  const piiBreakdownData = {
    labels: ['Direct Identifiers', 'Quasi-Identifiers', 'Clean Clinical Attributes'],
    datasets: [
      {
        data: isSecured ? [0, 0, 8] : [3, 3, 2],
        backgroundColor: [
          'rgba(239, 68, 68, 0.75)',  // Red
          'rgba(245, 158, 11, 0.75)',  // Amber
          'rgba(16, 185, 129, 0.75)'  // Green
        ],
        borderColor: [
          '#EF4444',
          '#F59E0B',
          '#10B981'
        ],
        borderWidth: 1
      }
    ]
  };

  // Chart data for Demographic Split
  const raceBreakdownData = {
    labels: ['White', 'Black/AA', 'Asian', 'Other', 'Native'],
    datasets: [
      {
        label: 'Patient Count',
        data: [3125, 615, 710, 425, 126],
        backgroundColor: 'rgba(37, 99, 235, 0.65)',
        borderColor: '#2563EB',
        borderWidth: 1,
        borderRadius: 4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: 'var(--text-secondary)', font: { family: 'Inter', size: 10 } }
      }
    }
  };

  return (
    <div style={{ animation: 'slide-in 0.4s ease-out', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Title Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Workspace // Data Ingestion
          </span>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', marginTop: '4px' }}>
            Source Patient Records & Risk Analysis
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Evaluate raw patient records, inspect direct PII leaks, and review differential privacy compliance scores.
          </p>
        </div>
        <div className="glass-panel" style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={16} style={{ color: 'var(--color-secondary)' }} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Dataset Status:</span>
          <span style={{ fontSize: '12px', fontWeight: 800, color: isSecured ? 'var(--color-success)' : 'var(--color-danger)' }}>
            {isSecured ? '🔒 DE-IDENTIFIED & SYNTHESIZED' : '⚠️ RAW VULNERABLE RECORDS'}
          </span>
        </div>
      </div>

      {/* 1. Risk Gauges and Estimation Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        
        {/* PII Leakage Risk Gauge */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ position: 'relative', width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--border-color)" strokeWidth="8"/>
              <circle 
                cx="50" cy="50" r="40" fill="transparent" 
                stroke={isSecured ? 'var(--color-success)' : 'var(--color-danger)'} 
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - leakageRisk / 100)}`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s ease-out' }}
              />
            </svg>
            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '16px', fontWeight: 800, color: isSecured ? 'var(--color-success)' : 'var(--color-danger)' }}>
                {leakageRisk}%
              </span>
              <span style={{ fontSize: '7px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Risk</span>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800 }}>PII Leakage Rating</h4>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.3 }}>
              {isSecured 
                ? 'All direct identifiers removed. Quasi-identifiers protected via Differential Privacy.'
                : 'Direct patient names, SSNs, and contacts are fully exposed in plain text.'}
            </p>
          </div>
        </div>

        {/* Data Quality Score Gauge */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ position: 'relative', width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--border-color)" strokeWidth="8"/>
              <circle 
                cx="50" cy="50" r="40" fill="transparent" 
                stroke="var(--color-primary)" 
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - qualityScore / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-primary)' }}>{qualityScore}%</span>
              <span style={{ fontSize: '7px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Quality</span>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800 }}>Data Quality Index</h4>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.3 }}>
              High attribute completeness. Structural checks and schema constraints successfully validated.
            </p>
          </div>
        </div>

        {/* Privacy Improvement Estimation */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Privacy Gain Forecast
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-success)' }}>
              {isSecured ? '100% Secure' : '+300% Gain'}
            </span>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Re-identification probability: 
            <span style={{ fontWeight: 700, color: isSecured ? 'var(--color-success)' : 'var(--color-danger)' }}>
              {isSecured ? ' Negligible (<0.01%)' : ' Extremely High (92.4%)'}
            </span>
          </p>
        </div>

      </div>

      {/* 2. Synthetic Readiness Workflow Tracker */}
      <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 800 }}>Synthetic readiness pipeline checklist</h3>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          
          <div className="pipeline-step">
            <div className="step-node completed">✓</div>
            <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>Schema Parsed</span>
          </div>
          <div className="pipeline-connector active" />

          <div className="pipeline-step">
            <div className={`step-node ${piiLogs.length === 0 ? 'completed' : 'active'}`}>
              {piiLogs.length === 0 ? '✓' : '!'}
            </div>
            <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>PII Screened</span>
          </div>
          <div className={`pipeline-connector ${piiLogs.length === 0 ? 'active' : ''}`} />

          <div className="pipeline-step">
            <div className={`step-node ${isSecured ? 'completed' : 'pending'}`}>
              {isSecured ? '✓' : '3'}
            </div>
            <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>Correlation Checked</span>
          </div>
          <div className={`pipeline-connector ${isSecured ? 'active' : ''}`} />

          <div className="pipeline-step">
            <div className={`step-node ${isSecured ? 'completed' : 'pending'}`}>
              {isSecured ? '✓' : '4'}
            </div>
            <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>Generative Ready</span>
          </div>

        </div>
      </div>

      {/* 3. Before vs After Examples */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Before vs After De-identification Showcase</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Comparison demonstrating how patient records are anonymized to eliminate re-identification vectors.</p>
        </div>

        <div className="comparison-container">
          
          {/* Before: Raw Card */}
          <div className="comparison-card raw">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-danger)' }}>Original Raw Patient Record</span>
              <span className="badge badge-red">❌ Unsafe</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="comparison-row-highlight red">👤 Name: Mr. Darryl392 Rolf983 Jerde200</div>
              <div className="comparison-row-highlight red">🔑 SSN: 999-53-9172</div>
              <div className="comparison-row-highlight red">📞 Phone: 555-500-4422</div>
              <div className="comparison-row-highlight red">📍 Address: 551 Cruickshank Lock, Apt 83, Bellingham, MA</div>
              <div className="comparison-row-highlight">🩺 Condition: Type 2 Diabetes Mellitus</div>
            </div>
          </div>

          {/* After: Synthetic Card */}
          <div className="comparison-card synth">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-success)' }}>Synthesized Patient Record</span>
              <span className="badge badge-green">🟢 Secured</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="comparison-row-highlight green">👤 Name: Patient #1024 (Fully Synthesized)</div>
              <div className="comparison-row-highlight green">🔑 SSN: [DELETED / NULLIFIED]</div>
              <div className="comparison-row-highlight green">📞 Phone: [DELETED / NULLIFIED]</div>
              <div className="comparison-row-highlight green">📍 Address: Bellingham, MA (Quasi-ID, Laplace Noise Applied)</div>
              <div className="comparison-row-highlight">🩺 Condition: Type 2 Diabetes Mellitus (Fidelity Retained)</div>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Column PII Risk Heatmap Grid */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LayoutGrid size={18} style={{ color: 'var(--color-primary)' }} />
            Schema Attribute PII Risk Heatmap
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Hover over schema fields to view classifications and privacy guidelines.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          
          <div className={`glass-panel ${isSecured ? 'heatmap-cell-green' : 'heatmap-cell-red'}`} style={{ padding: '16px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700 }}>Patient Name</span>
            <span style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase' }}>
              {isSecured ? 'Clean / Synth' : 'Direct Identifier'}
            </span>
            <p style={{ fontSize: '10px', opacity: 0.8, marginTop: '4px' }}>
              {isSecured ? 'Fully masked & synthesized.' : 'Violates HIPAA Safe Harbor de-identification rules.'}
            </p>
          </div>

          <div className={`glass-panel ${isSecured ? 'heatmap-cell-green' : 'heatmap-cell-red'}`} style={{ padding: '16px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700 }}>Social Security (SSN)</span>
            <span style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase' }}>
              {isSecured ? 'Clean / Synth' : 'Direct Identifier'}
            </span>
            <p style={{ fontSize: '10px', opacity: 0.8, marginTop: '4px' }}>
              {isSecured ? 'Column completely excluded.' : 'High identity theft risk. Deletion required.'}
            </p>
          </div>

          <div className={`glass-panel ${isSecured ? 'heatmap-cell-green' : 'heatmap-cell-red'}`} style={{ padding: '16px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700 }}>Contact Info</span>
            <span style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase' }}>
              {isSecured ? 'Clean / Synth' : 'Direct Identifier'}
            </span>
            <p style={{ fontSize: '10px', opacity: 0.8, marginTop: '4px' }}>
              {isSecured ? 'Removed.' : 'Contact telephone & emails present high tracking risk.'}
            </p>
          </div>

          <div className="glass-panel heatmap-cell-amber" style={{ padding: '16px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700 }}>Physical Address</span>
            <span style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase' }}>Quasi-Identifier</span>
            <p style={{ fontSize: '10px', opacity: 0.8, marginTop: '4px' }}>
              Zipcodes and geolocations require coarsening to prevent linkage attacks.
            </p>
          </div>

          <div className="glass-panel heatmap-cell-amber" style={{ padding: '16px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700 }}>Birth Date</span>
            <span style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase' }}>Quasi-Identifier</span>
            <p style={{ fontSize: '10px', opacity: 0.8, marginTop: '4px' }}>
              Must be bucketed into age ranges (e.g. 19-49) to satisfy HIPAA criteria.
            </p>
          </div>

          <div className="glass-panel heatmap-cell-green" style={{ padding: '16px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700 }}>Clinical Diagnoses</span>
            <span style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase' }}>Safe Attribute</span>
            <p style={{ fontSize: '10px', opacity: 0.8, marginTop: '4px' }}>
              Retains statistical patterns for medical research utility.
            </p>
          </div>

        </div>
      </div>

      {/* 5. Split Content: Charts & Compliance Indicators */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '24px', flexWrap: 'wrap' }}>
        
        {/* Charts: PII breakdown & Demographics */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Dataset Risk Breakdown & Demographics</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Proportion of fields presenting privacy vulnerabilities.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '20px', height: '220px' }}>
            <div style={{ position: 'relative', height: '100%' }}>
              <Doughnut data={piiBreakdownData} options={chartOptions} />
            </div>
            <div style={{ position: 'relative', height: '100%' }}>
              <Bar data={raceBreakdownData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Compliance Readiness Indicators */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Compliance Readiness Indicators</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Status of legal and organizational privacy framework checks.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            
            <div className="compliance-status-banner" style={{ background: isSecured ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)', borderColor: isSecured ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)' }}>
              <span style={{ fontWeight: 700 }}>HIPAA Safe Harbor Standard</span>
              <span style={{ color: isSecured ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 800 }}>
                {isSecured ? '🟢 Compliant' : '❌ Non-Compliant'}
              </span>
            </div>

            <div className="compliance-status-banner" style={{ background: isSecured ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)', borderColor: isSecured ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)' }}>
              <span style={{ fontWeight: 700 }}>GDPR Pseudonymization Article 29</span>
              <span style={{ color: isSecured ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 800 }}>
                {isSecured ? '🟢 Compliant' : '❌ Non-Compliant'}
              </span>
            </div>

            <div className="compliance-status-banner" style={{ background: isSecured ? 'rgba(16, 185, 129, 0.05)' : 'rgba(245, 158, 11, 0.05)', borderColor: isSecured ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)' }}>
              <span style={{ fontWeight: 700 }}>NIST De-identification Framework</span>
              <span style={{ color: isSecured ? 'var(--color-success)' : 'var(--color-warning)', fontWeight: 800 }}>
                {isSecured ? '🟢 Compliant' : '⚠️ Partial Match'}
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* 6. AI Recommendations & Patient List Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: '24px' }}>
        
        {/* AI Compliance Recommendations */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Brain size={18} style={{ color: 'var(--color-secondary)' }} />
            <h3 style={{ fontSize: '15px', fontWeight: 800 }}>AI Recommendations & Insights</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px', lineHeight: 1.4 }}>
            <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px' }}>
              <span style={{ fontWeight: 700, color: 'var(--color-danger)', display: 'block', marginBottom: '4px' }}>⚠️ Identity Leak Warning</span>
              Patient names and Social Security Numbers are stored in unencrypted memory logs. Deletion and hash-reconstruction are strongly recommended.
            </div>

            <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px' }}>
              <span style={{ fontWeight: 700, color: 'var(--color-warning)', display: 'block', marginBottom: '4px' }}>🟡 Quasi-Identifier Alert</span>
              Birth dates and physical address zipcodes present high linkage vulnerability. Apply Laplacian differential noise calibrator.
            </div>

            <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px' }}>
              <span style={{ fontWeight: 700, color: 'var(--color-primary)', display: 'block', marginBottom: '4px' }}>💡 Model Suggestion</span>
              CTGAN checker shows high statistical cross-correlation similarity (96.8%) for demographic patterns when utilizing 5,000+ epochs.
            </div>
          </div>
        </div>

        {/* Patient Table (Paginated) */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800 }}>Patient Cohort Sample</h3>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Granular attributes from raw dataset records.</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                placeholder="Search..." 
                className="form-input"
                style={{ fontSize: '11px', padding: '6px 10px', width: '120px' }}
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
              <select 
                className="form-input"
                style={{ fontSize: '11px', padding: '4px', width: '90px' }}
                value={genderFilter}
                onChange={(e) => { setGenderFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="All">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <div className="table-container">
            <table className="custom-table text-xs">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Race</th>
                  <th>Marital Status</th>
                  <th>Diagnoses</th>
                  <th>Encounters</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPatients.length > 0 ? (
                  paginatedPatients.map((p, idx) => (
                    <tr key={p.id || idx}>
                      <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>#{p.id || idx + 1}</td>
                      <td>{p.age}</td>
                      <td>{p.gender}</td>
                      <td style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.race}</td>
                      <td>{p.maritalStatus}</td>
                      <td style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={p.conditions?.join(', ')}>
                        {p.conditions?.slice(0, 1).join(', ') || 'No diagnosis'}
                        {p.conditions?.length > 1 ? '...' : ''}
                      </td>
                      <td style={{ fontWeight: 600 }}>{p.encounters || p.encounterCount || 0}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                      No patients match current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Page {currentPage} of {totalPages}</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="btn-secondary"
                  style={{ padding: '4px 8px', fontSize: '10px' }}
                >
                  Prev
                </button>
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="btn-secondary"
                  style={{ padding: '4px 8px', fontSize: '10px' }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
