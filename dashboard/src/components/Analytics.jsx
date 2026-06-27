import React, { useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { BarChart2, TrendingUp, Info } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Analytics() {
  const [activeChartTab, setActiveChartTab] = useState('age'); // age, gender, race

  // Statistical calculations derived from 5001 raw records vs CTGAN output
  const ageDistributionReal = [15.2, 10.1, 49.8, 19.9, 5.0]; // 3, 4-18, 19-49, 50-69, 70-85
  const ageDistributionSynth = [14.8, 10.5, 48.9, 20.3, 5.5];

  const genderReal = [51.2, 48.8]; // Female, Male
  const genderSynth = [50.8, 49.2];

  const raceReal = [62.5, 12.3, 14.2, 8.5, 2.5]; // White, Black, Asian, Other, Native
  const raceSynth = [61.8, 12.9, 14.5, 8.1, 2.7];

  const chartThemeColors = {
    realBorder: '#2563EB',
    realBg: 'rgba(37, 99, 235, 0.65)',
    synthBorder: '#7C3AED',
    synthBg: 'rgba(124, 58, 237, 0.65)'
  };

  // 1. Age Histogram data
  const ageData = {
    labels: ['Pediatric (3)', 'Youth (4-18)', 'Adult (19-49)', 'Senior (50-69)', 'Geriatric (70-85)'],
    datasets: [
      {
        label: 'Real Data (%)',
        data: ageDistributionReal,
        backgroundColor: chartThemeColors.realBg,
        borderColor: chartThemeColors.realBorder,
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Synthetic Data (%)',
        data: ageDistributionSynth,
        backgroundColor: chartThemeColors.synthBg,
        borderColor: chartThemeColors.synthBorder,
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  };

  // 2. Gender Doughnut Data
  const genderDataReal = {
    labels: ['Female', 'Male'],
    datasets: [
      {
        data: genderReal,
        backgroundColor: ['rgba(124, 58, 237, 0.7)', 'rgba(37, 99, 235, 0.7)'],
        borderColor: ['#7C3AED', '#2563EB'],
        borderWidth: 1
      }
    ]
  };

  const genderDataSynth = {
    labels: ['Female', 'Male'],
    datasets: [
      {
        data: genderSynth,
        backgroundColor: ['rgba(124, 58, 237, 0.55)', 'rgba(37, 99, 235, 0.55)'],
        borderColor: ['#7C3AED', '#2563EB'],
        borderWidth: 1
      }
    ]
  };

  // 3. Race Distribution Bar Data
  const raceData = {
    labels: ['White', 'Black/AA', 'Asian', 'Other', 'Native Amer'],
    datasets: [
      {
        label: 'Real Data (%)',
        data: raceReal,
        backgroundColor: chartThemeColors.realBg,
        borderColor: chartThemeColors.realBorder,
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Synthetic Data (%)',
        data: raceSynth,
        backgroundColor: chartThemeColors.synthBg,
        borderColor: chartThemeColors.synthBorder,
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  };

  // Correlation heatmap matrices
  const features = ['Age', 'Gender', 'Marital Status', 'Encounters'];
  const realCorrelation = [
    [1.00, -0.02, 0.58, 0.72],
    [-0.02, 1.00, 0.05, -0.01],
    [0.58, 0.05, 1.00, 0.38],
    [0.72, -0.01, 0.38, 1.00]
  ];

  const synthCorrelation = [
    [1.00, -0.04, 0.55, 0.69],
    [-0.04, 1.00, 0.04, -0.03],
    [0.55, 0.04, 1.00, 0.35],
    [0.69, -0.03, 0.35, 1.00]
  ];

  const getCellColor = (val) => {
    const abs = Math.abs(val);
    if (val >= 0) {
      return {
        background: `rgba(124, 58, 237, ${abs * 0.85})`, // Purple
        color: abs > 0.4 ? '#ffffff' : 'var(--text-primary)'
      };
    } else {
      return {
        background: `rgba(37, 99, 235, ${abs * 0.85})`, // Blue
        color: abs > 0.4 ? '#ffffff' : 'var(--text-primary)'
      };
    }
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: 'var(--text-secondary)', font: { family: 'Inter', size: 11 } }
      }
    },
    scales: {
      x: {
        grid: { color: 'var(--border-color)', drawOnChartArea: true, drawTicks: false },
        ticks: { color: 'var(--text-muted)', font: { size: 10 } }
      },
      y: {
        grid: { color: 'var(--border-color)', drawOnChartArea: true, drawTicks: false },
        ticks: { color: 'var(--text-muted)', font: { size: 10 } },
        title: { display: true, text: 'Percentage (%)', color: 'var(--text-muted)', font: { size: 10 } }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: 'var(--text-secondary)', font: { family: 'Inter', size: 11 } }
      }
    }
  };

  return (
    <div style={{ animation: 'slide-in 0.4s ease-out', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Title */}
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
        <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>STATISTICAL TESTS // UTILITY METRICS</span>
        <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', marginTop: '4px' }}>Fidelity & Utility Analytics</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>Validate generative synthetic outputs against raw baselines to measure statistical divergence and accuracy retention.</p>
      </div>

      {/* Top row: gauge and stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        
        {/* Metric gauge card */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-around', gap: '20px', gridColumn: 'span 1' }}>
          <div style={{ position: 'relative', width: '130px', height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 100 100">
              <circle 
                cx="50" cy="50" r="40" 
                fill="transparent" 
                stroke="var(--border-color)" 
                strokeWidth="10"
              />
              <circle 
                cx="50" cy="50" r="40" 
                fill="transparent" 
                stroke="url(#gauge-grad)" 
                strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.942)}`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-primary)" />
                  <stop offset="100%" stopColor="var(--color-secondary)" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span className="gradient-text" style={{ fontSize: '26px', fontWeight: 800 }}>94.2%</span>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', tracking: '0.5px' }}>Fidelity</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '160px' }}>
            <div className="badge badge-green" style={{ alignSelf: 'flex-start' }}>
              <TrendingUp size={12} style={{ marginRight: '4px' }} /> +1.8% vs CTGAN
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: 700 }}>EHR Cohort Match</h4>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Preserved patient demographic attributes with negligible skew indices.
            </p>
          </div>
        </div>

        {/* Dynamic utility indicators */}
        <div className="glass-panel" style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '24px', gridColumn: 'span 2' }}>
          <div style={{ borderRight: '1px solid var(--border-color)', paddingRight: '16px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Wasserstein Distance</span>
            <p style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-secondary)', marginTop: '4px', fontFamily: 'monospace' }}>0.024</p>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Marginal distribution offset</p>
          </div>
          <div style={{ borderRight: '1px solid var(--border-color)', paddingRight: '16px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Correlation Similarity</span>
            <p style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-primary)', marginTop: '4px', fontFamily: 'monospace' }}>96.8%</p>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Feature-wise parity</p>
          </div>
          <div>
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Classifier Accuracy Retention</span>
            <p style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-success)', marginTop: '4px', fontFamily: 'monospace' }}>98.1%</p>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Downstream model training parity</p>
          </div>
        </div>

      </div>

      {/* Side-by-Side Distribution comparison charts */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart2 style={{ color: 'var(--color-primary)' }} size={18} />
              Variable Margin Comparison
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Validate marginal density equivalence (Real vs. Anonymized).</p>
          </div>
          {/* Chart selector tabs */}
          <div style={{ display: 'flex', backgroundColor: 'var(--bg-primary)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <button 
              className="btn-secondary"
              style={{ fontSize: '12px', padding: '6px 12px', border: 'none', background: activeChartTab === 'age' ? 'var(--gradient-primary)' : 'transparent', color: activeChartTab === 'age' ? '#fff' : 'var(--text-secondary)' }}
              onClick={() => setActiveChartTab('age')}
            >
              Age Histogram
            </button>
            <button 
              className="btn-secondary"
              style={{ fontSize: '12px', padding: '6px 12px', border: 'none', background: activeChartTab === 'gender' ? 'var(--gradient-primary)' : 'transparent', color: activeChartTab === 'gender' ? '#fff' : 'var(--text-secondary)' }}
              onClick={() => setActiveChartTab('gender')}
            >
              Gender Doughnut
            </button>
            <button 
              className="btn-secondary"
              style={{ fontSize: '12px', padding: '6px 12px', border: 'none', background: activeChartTab === 'race' ? 'var(--gradient-primary)' : 'transparent', color: activeChartTab === 'race' ? '#fff' : 'var(--text-secondary)' }}
              onClick={() => setActiveChartTab('race')}
            >
              Race Distribution
            </button>
          </div>
        </div>

        {/* Side-by-side charts container */}
        <div style={{ height: '300px', position: 'relative', width: '100%' }}>
          {activeChartTab === 'age' && (
            <Bar data={ageData} options={barOptions} />
          )}

          {activeChartTab === 'gender' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', height: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>Real Data Gender Distribution</span>
                <div style={{ height: '220px', width: '100%', position: 'relative' }}>
                  <Doughnut data={genderDataReal} options={doughnutOptions} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>Synthetic Data Gender Distribution</span>
                <div style={{ height: '220px', width: '100%', position: 'relative' }}>
                  <Doughnut data={genderDataSynth} options={doughnutOptions} />
                </div>
              </div>
            </div>
          )}

          {activeChartTab === 'race' && (
            <Bar data={raceData} options={barOptions} />
          )}
        </div>
      </div>

      {/* Heatmaps */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Real heatmap */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-primary)' }}>Real Matrix Correlation</h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Pairwise relationship weights inside the original EHR cohort.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', textAlign: 'center', fontSize: '12px', marginTop: '16px' }}>
            <div></div>
            {features.map((f, i) => (
              <div key={i} style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={f}>{f}</div>
            ))}

            {realCorrelation.map((row, rIdx) => (
              <React.Fragment key={rIdx}>
                <div style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={features[rIdx]}>
                  {features[rIdx]}
                </div>
                {row.map((val, cIdx) => (
                  <div 
                    key={cIdx} 
                    style={{ padding: '12px 0', borderRadius: '6px', fontWeight: 700, fontFamily: 'monospace', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.1s', cursor: 'help', ...getCellColor(val) }}
                    title={`Real correlation (${features[rIdx]}, ${features[cIdx]}): ${val.toFixed(2)}`}
                  >
                    {val.toFixed(2)}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Synthetic heatmap */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-secondary)' }}>Synthetic Matrix Correlation</h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Pairwise relationships reconstructed by the generative networks.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', textAlign: 'center', fontSize: '12px', marginTop: '16px' }}>
            <div></div>
            {features.map((f, i) => (
              <div key={i} style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={f}>{f}</div>
            ))}

            {synthCorrelation.map((row, rIdx) => (
              <React.Fragment key={rIdx}>
                <div style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={features[rIdx]}>
                  {features[rIdx]}
                </div>
                {row.map((val, cIdx) => (
                  <div 
                    key={cIdx} 
                    style={{ padding: '12px 0', borderRadius: '6px', fontWeight: 700, fontFamily: 'monospace', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.1s', cursor: 'help', ...getCellColor(val) }}
                    title={`Synthetic correlation (${features[rIdx]}, ${features[cIdx]}): ${val.toFixed(2)}`}
                  >
                    {val.toFixed(2)}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>

      </div>

      {/* Utility metrics table */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Analytical Downstream Parity</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Comparison of standard predictive model accuracy when trained on raw vs synthetic data.</p>
        </div>
        
        <div className="table-container">
          <table className="custom-table text-xs">
            <thead>
              <tr>
                <th>Healthcare ML Model Type</th>
                <th>Raw Training Score</th>
                <th>Synthetic Training Score</th>
                <th>Statistical Similarity</th>
                <th>Safety Label</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Logistic Regression (EHR F1 Score)</td>
                <td>0.824</td>
                <td>0.809</td>
                <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-secondary)' }}>98.1% Parity</td>
                <td><span className="badge badge-green">Passed</span></td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Random Forest Classifier (Accuracy)</td>
                <td>0.865</td>
                <td>0.849</td>
                <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-secondary)' }}>98.2% Parity</td>
                <td><span className="badge badge-green">Passed</span></td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>XGBoost Feature Importance Ranks</td>
                <td>Age, Encounters, Marital</td>
                <td>Age, Encounters, Marital</td>
                <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-secondary)' }}>100% Rank Match</td>
                <td><span className="badge badge-green">Passed</span></td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Mutual Information Coefficient</td>
                <td>0.742</td>
                <td>0.718</td>
                <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-secondary)' }}>96.8% Similarity</td>
                <td><span className="badge badge-green">Passed</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
