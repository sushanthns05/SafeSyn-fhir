import React, { useState, useMemo } from 'react';
import { ShieldAlert, Database, HelpCircle, Search, Filter, AlertTriangle, UserCheck, EyeOff } from 'lucide-react';

export default function SourceData({ 
  patients, 
  stats, 
  piiLogs 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('All');
  const [maritalFilter, setMaritalFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  // Determine Risk Badge styling
  const getRiskBadge = (level) => {
    switch (level) {
      case 'High':
        return <span className="badge badge-red animate-pulse-glow" style={{ animation: 'pulse-glow 2s infinite' }}><ShieldAlert size={14} style={{ marginRight: '4px' }} /> High Risk: Raw PII</span>;
      case 'Moderate':
        return <span className="badge badge-amber"><AlertTriangle size={14} style={{ marginRight: '4px' }} /> Moderate Risk</span>;
      case 'Low':
      default:
        return <span className="badge badge-green"><UserCheck size={14} style={{ marginRight: '4px' }} /> Low Risk (Safe)</span>;
    }
  };

  return (
    <div style={{ animation: 'slide-in 0.4s ease-out', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Top Title Section */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary)', uppercase: 'true', letterSpacing: '1px' }}>WORKSPACE // DATA INGESTION</span>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', marginTop: '4px' }}>Source Patient Records</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>Analyze raw medical records and identify PII compliance leaks before training generative models.</p>
        </div>
        <div className="glass-panel" style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={16} style={{ color: 'var(--color-secondary)' }} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Status:</span>
          <span style={{ fontSize: '12px', fontWeight: 800, color: stats.riskLevel === 'High' ? 'var(--color-danger)' : 'var(--color-success)' }}>
            {stats.riskLevel === 'High' ? 'RAW UNPROTECTED RECORDS' : 'SYNTHETICALLY CLEAN'}
          </span>
        </div>
      </div>

      {/* 1. Data Health Snapshot */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        <div className="glass-panel metric-card">
          <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Records Ingested</p>
          <p className="metric-value" style={{ color: 'var(--color-primary)' }}>{stats.totalRecords.toLocaleString()}</p>
          <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--color-success)', fontWeight: 600 }}>
            ✓ 100% Parsing Integrity
          </div>
        </div>

        <div className="glass-panel metric-card">
          <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Schema Attributes</p>
          <p className="metric-value">{stats.detectedFields} Fields</p>
          <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            FHIR Resource Structure Identified
          </div>
        </div>

        <div className="glass-panel metric-card">
          <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Missing Values / Sparsity</p>
          <p className="metric-value">{stats.missingValues}%</p>
          <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
            High-integrity clinical density
          </div>
        </div>

        <div className="glass-panel metric-card">
          <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>PII Risk Rating</p>
          <div style={{ marginTop: '8px' }}>
            {getRiskBadge(stats.riskLevel)}
          </div>
          <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            Identified direct identifier values
          </div>
        </div>
      </div>

      {/* Main Content Split: Table vs Audit Log */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '24px' }}>
        
        {/* 2. Raw Data Explorer */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Raw Patient Database</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Granular view of the parsed profiles before model synthesis.</p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder="Filter patient rows..." 
                  className="form-input"
                  style={{ paddingLeft: '32px', fontSize: '12px', width: '160px' }}
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
              </div>
              <select 
                className="form-input"
                style={{ fontSize: '12px', width: '120px', padding: '8px' }}
                value={genderFilter}
                onChange={(e) => { setGenderFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="All">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <select 
                className="form-input"
                style={{ fontSize: '12px', width: '120px', padding: '8px' }}
                value={maritalFilter}
                onChange={(e) => { setMaritalFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="All">All Marital</option>
                <option value="Married">Married</option>
                <option value="Single">Single</option>
              </select>
            </div>
          </div>

          <div className="table-container">
            <table className="custom-table">
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
                      <td>
                        <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', marginRight: '8px', backgroundColor: p.gender === 'Female' ? 'var(--color-secondary)' : 'var(--color-primary)' }} />
                        {p.gender}
                      </td>
                      <td style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={p.race}>{p.race}</td>
                      <td>{p.maritalStatus}</td>
                      <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={p.conditions?.join(', ')}>
                        {p.conditions?.slice(0, 2).join(', ') || 'No diagnosis'}
                        {p.conditions?.length > 2 ? '...' : ''}
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{p.encounters || p.encounterCount || 0}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                      No patients matching the filter constraints found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '16px', fontSize: '12px' }}>
              <span style={{ color: 'var(--text-muted)' }}>
                Showing {Math.min(filteredPatients.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(filteredPatients.length, currentPage * itemsPerPage)} of {filteredPatients.length} profiles
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '11px' }}
                >
                  Previous
                </button>
                <span style={{ alignSelf: 'center', padding: '0 8px', color: 'var(--text-primary)', fontWeight: 600 }}>
                  Page {currentPage} of {totalPages}
                </span>
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '11px' }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. PII Audit Log */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <EyeOff style={{ color: 'var(--color-danger)' }} size={18} />
              Compliance Flag Scan
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Identified direct PII values targeting removal during synthesis.</p>
          </div>

          {piiLogs.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '500px', overflowY: 'auto', paddingRight: '4px' }}>
              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '12px', color: 'var(--color-danger)', display: 'flex', gap: '8px' }}>
                <AlertTriangle size={16} style={{ shrink: 0, marginTop: '2px' }} />
                <div>
                  <span style={{ fontWeight: 800 }}>PII Risk Flag:</span> Direct identifiers (Names, SSNs, Address records) detected.
                </div>
              </div>

              {piiLogs.map((log, index) => (
                <div key={index} style={{ borderLeft: '3px solid var(--color-danger)', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700 }}>{log.field}</span>
                    <span className="badge badge-red" style={{ fontSize: '10px' }}>Direct ID</span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--color-danger)', fontFamily: 'monospace', wordBreak: 'break-all', backgroundColor: 'rgba(239, 68, 68, 0.05)', padding: '8px', borderRadius: '4px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                    {log.value}
                  </p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{log.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', border: '1px dashed var(--border-color)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <ShieldAlert size={24} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 700 }}>No Direct PII Detected</span>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '220px' }}>
                No direct identification flags detected in the parsed dataset.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
