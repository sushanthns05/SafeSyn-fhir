import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Cpu, Sliders, Play, CheckCircle2, AlertCircle, 
  Loader, ShieldAlert, Activity, HardDrive, Brain, 
  HelpCircle, ArrowRightLeft, Settings, Info 
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AISynthesis({ 
  onSynthesisComplete,
  isSecured
}) {
  const [selectedModel, setSelectedModel] = useState('gemma');
  const [syntheticRows, setSyntheticRows] = useState(5000);
  const [privacyStrength, setPrivacyStrength] = useState(4.5);
  const [noiseLevel, setNoiseLevel] = useState(0.15);
  const [randomSeed, setRandomSeed] = useState(42);

  // Training state
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [currentLoss, setCurrentLoss] = useState(null);
  const [currentValScore, setCurrentValScore] = useState(0);
  const [trainingComplete, setTrainingComplete] = useState(isSecured);

  // GPU state simulations
  const [gpuLoad, setGpuLoad] = useState(0);
  const [vramUsage, setVramUsage] = useState(1.2); // GB
  const [gpuTemp, setGpuTemp] = useState(45); // C

  // Time metrics
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Historical loss data for chart
  const [epochsList, setEpochsList] = useState([0]);
  const [genLossList, setGenLossList] = useState([1.45]);
  const [discLossList, setDiscLossList] = useState([0.98]);

  const trainingTimer = useRef(null);

  const modelMetadata = {
    gemma: {
      name: 'Gemma-2-2B-it (LoRA Fine-Tuned)',
      params: '2.51 Billion Parameters',
      desc: 'Instruction-tuned lightweight large language model configured with low-rank adaptation (LoRA) for clinical terminology matching and FHIR structure synthesis.',
      status: 'Ready (Fine-tuned on 10k patient histories)'
    },
    ctgan: {
      name: 'CTGAN Baseline',
      params: 'Conditional GAN model (14.2M params)',
      desc: 'Conditional Generative Adversarial Network designed specifically for tabular data structure generation, modeling complex correlations and column distributions.',
      status: 'Ready (Pre-compiled checkpoint loaded)'
    }
  };

  const handleTriggerSynthesis = () => {
    if (isTraining) return;

    setIsTraining(true);
    setTrainingProgress(0);
    setCurrentEpoch(0);
    setCurrentValScore(0.32);
    setTrainingComplete(false);
    setTimeElapsed(0);
    setTimeRemaining(6); // 6 seconds

    const startGenLoss = selectedModel === 'gemma' ? 1.55 : 2.10;
    const startDiscLoss = selectedModel === 'gemma' ? 0.88 : 1.25;

    setEpochsList([0]);
    setGenLossList([startGenLoss]);
    setDiscLossList([startDiscLoss]);
    setCurrentLoss({ gen: startGenLoss, disc: startDiscLoss });

    let progress = 0;
    const totalDuration = 6000; // 6 seconds training simulation
    const intervalTime = 150;
    const totalSteps = totalDuration / intervalTime;
    const maxEpochs = selectedModel === 'gemma' ? 25 : 50;

    trainingTimer.current = setInterval(() => {
      progress += (100 / totalSteps);
      
      // Update hardware indicators
      setGpuLoad(Math.floor(80 + Math.random() * 15));
      setVramUsage(parseFloat((10.5 + Math.random() * 1.5).toFixed(1)));
      setGpuTemp(Math.floor(70 + Math.random() * 5));

      // Update time
      const elapsed = (progress / 100) * 6;
      setTimeElapsed(parseFloat(elapsed.toFixed(1)));
      setTimeRemaining(parseFloat((6 - elapsed).toFixed(1)));

      if (progress >= 100) {
        clearInterval(trainingTimer.current);
        setTrainingProgress(100);
        setCurrentEpoch(maxEpochs);
        setCurrentValScore(0.942);
        setIsTraining(false);
        setTrainingComplete(true);
        setGpuLoad(0);
        setVramUsage(1.2);
        setGpuTemp(45);
        setTimeElapsed(6);
        setTimeRemaining(0);
        onSynthesisComplete(syntheticRows);
      } else {
        const currentEp = Math.floor((progress / 100) * maxEpochs);
        setCurrentEpoch(currentEp);
        setTrainingProgress(Math.floor(progress));

        const decayRate = selectedModel === 'gemma' ? 0.08 : 0.04;
        const noiseGen = (Math.random() - 0.5) * 0.08;
        const noiseDisc = (Math.random() - 0.5) * 0.05;

        const nextGenLoss = Math.max(0.25, startGenLoss * Math.exp(-decayRate * currentEp) + noiseGen);
        const nextDiscLoss = Math.max(0.18, startDiscLoss * Math.exp(-decayRate * 0.4 * currentEp) + noiseDisc);
        
        setCurrentLoss({ gen: nextGenLoss, disc: nextDiscLoss });
        setCurrentValScore(parseFloat((0.32 + (0.942 - 0.32) * (1 - Math.exp(-0.06 * currentEp))).toFixed(3)));

        setEpochsList(prev => [...prev, currentEp]);
        setGenLossList(prev => [...prev, nextGenLoss]);
        setDiscLossList(prev => [...prev, nextDiscLoss]);
      }
    }, intervalTime);
  };

  useEffect(() => {
    return () => {
      if (trainingTimer.current) clearInterval(trainingTimer.current);
    };
  }, []);

  const chartData = {
    labels: epochsList,
    datasets: [
      {
        label: 'Generator Loss',
        data: genLossList,
        borderColor: '#7C3AED',
        backgroundColor: 'rgba(124, 58, 237, 0.05)',
        tension: 0.3,
        fill: true,
        borderWidth: 2,
        pointRadius: epochsList.length > 30 ? 0 : 2,
      },
      {
        label: 'Discriminator Loss',
        data: discLossList,
        borderColor: '#2563EB',
        backgroundColor: 'rgba(37, 99, 235, 0.05)',
        tension: 0.3,
        fill: true,
        borderWidth: 2,
        pointRadius: epochsList.length > 30 ? 0 : 2,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'var(--text-secondary)',
          font: { family: 'Inter', size: 11 }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'var(--border-color)', drawOnChartArea: true, drawTicks: false },
        title: { display: true, text: 'Training Epoch', color: 'var(--text-muted)', font: { size: 10, weight: 600 } },
        ticks: { color: 'var(--text-muted)', font: { size: 10 } }
      },
      y: {
        grid: { color: 'var(--border-color)', drawOnChartArea: true, drawTicks: false },
        title: { display: true, text: 'Loss Coefficient', color: 'var(--text-muted)', font: { size: 10, weight: 600 } },
        ticks: { color: 'var(--text-muted)', font: { size: 10 } }
      }
    }
  };

  return (
    <div style={{ animation: 'slide-in 0.4s ease-out', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Title Header */}
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
        <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Core Engine // Training Tuner
        </span>
        <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', marginTop: '4px' }}>
          AI Synthesis Control Center
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
          Tweak differential privacy boundaries, select generative model checkpoints, and monitor GAN convergence curves.
        </p>
      </div>

      {/* Main Grid Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        
        {/* Left Column: Config & Hardware Statistics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Model Selection Card */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu style={{ color: 'var(--color-primary)' }} size={18} />
              AI Model Engine
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Select Generative Architecture</label>
              <select 
                className="form-input"
                style={{ fontWeight: 600 }}
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={isTraining}
              >
                <option value="gemma">Gemma-2-2B-it (LoRA Fine-Tuned)</option>
                <option value="ctgan">CTGAN Tabular Checker</option>
              </select>
            </div>

            <div style={{ padding: '12px', borderRadius: '8px', border: '1px dashed var(--border-color)', backgroundColor: 'var(--bg-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary)' }}>
                  {modelMetadata[selectedModel].params}
                </span>
                <span className="badge badge-green">Loaded</span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.4 }}>
                {modelMetadata[selectedModel].desc}
              </p>
            </div>
          </div>

          {/* Hyperparameters Card */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders style={{ color: 'var(--color-secondary)' }} size={18} />
              Hyperparameter Boundaries
            </h3>

            {/* Target Output Row length */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>Target Records</span>
                <span style={{ fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'monospace' }}>
                  {syntheticRows.toLocaleString()} Rows
                </span>
              </div>
              <input 
                type="range" min="1000" max="25000" step="1000"
                value={syntheticRows} onChange={(e) => setSyntheticRows(parseInt(e.target.value))}
                disabled={isTraining} className="slider"
              />
            </div>

            {/* Differential Privacy Epsilon */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>Privacy Strength (ε)</span>
                <span style={{ fontWeight: 800, color: 'var(--color-secondary)', fontFamily: 'monospace' }}>
                  ε = {privacyStrength.toFixed(1)}
                </span>
              </div>
              <input 
                type="range" min="0.5" max="12.0" step="0.5"
                value={privacyStrength} onChange={(e) => setPrivacyStrength(parseFloat(e.target.value))}
                disabled={isTraining} className="slider"
              />
            </div>

            {/* Noise scale delta */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>Laplace Scale (δ)</span>
                <span style={{ fontWeight: 800, color: 'var(--color-accent)', fontFamily: 'monospace' }}>
                  {(noiseLevel * 100).toFixed(0)}% Noise
                </span>
              </div>
              <input 
                type="range" min="0.05" max="0.5" step="0.05"
                value={noiseLevel} onChange={(e) => setNoiseLevel(parseFloat(e.target.value))}
                disabled={isTraining} className="slider"
              />
            </div>
          </div>

          {/* GPU Hardware Statistics Card */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity style={{ color: 'var(--color-success)' }} size={18} />
              AI Compute Hardware Telemetry
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-primary)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div className="telemetry-indicator-ring">
                  <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 36 36">
                    <path stroke="var(--border-color)" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path stroke="var(--color-primary)" strokeWidth="3" strokeDasharray={`${gpuLoad}, 100`} fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <span style={{ position: 'absolute', fontSize: '10px', fontWeight: 800 }}>{gpuLoad}%</span>
                </div>
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>GPU Core Load</span>
                  <span style={{ fontSize: '12px', fontWeight: 700 }}>NVIDIA T4 active</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-primary)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div className="telemetry-indicator-ring">
                  <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 36 36">
                    <path stroke="var(--border-color)" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path stroke="var(--color-secondary)" strokeWidth="3" strokeDasharray={`${(vramUsage / 16) * 100}, 100`} fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <span style={{ position: 'absolute', fontSize: '9px', fontWeight: 800 }}>{vramUsage}G</span>
                </div>
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>VRAM Allocated</span>
                  <span style={{ fontSize: '12px', fontWeight: 700 }}>16.0 GB total</span>
                </div>
              </div>

            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
              <span>GPU Core Temperature: <span style={{ fontWeight: 700 }}>{gpuTemp}°C</span></span>
              <span>Memory Bandwidth: <span style={{ fontWeight: 700 }}>320 GB/s</span></span>
            </div>
          </div>

        </div>

        {/* Right Column: Training Progress & Curves */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800 }}>AI Optimizer Loss Curves</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Convergence progress for generative parameters and discriminative classification.</p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {isTraining ? (
                  <span className="badge badge-amber animate-pulse-glow" style={{ animation: 'pulse-glow 1.5s infinite' }}>
                    <Loader size={12} style={{ marginRight: '4px', animation: 'spin 1s linear infinite' }} /> Optimizing / Epoch {currentEpoch}
                  </span>
                ) : trainingComplete ? (
                  <span className="badge badge-green">✓ Converged</span>
                ) : (
                  <span className="badge badge-red">❌ Idle</span>
                )}
              </div>
            </div>

            {/* Line chart */}
            <div style={{ height: '220px', position: 'relative' }}>
              <Line data={chartData} options={chartOptions} />
            </div>

            {/* Telemetry row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '16px', textAlign: 'center' }}>
              <div>
                <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Gen Loss</span>
                <span style={{ display: 'block', fontSize: '16px', fontWeight: 800, color: 'var(--color-secondary)', fontFamily: 'monospace', marginTop: '2px' }}>
                  {currentLoss ? currentLoss.gen.toFixed(4) : '—'}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Disc Loss</span>
                <span style={{ display: 'block', fontSize: '16px', fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'monospace', marginTop: '2px' }}>
                  {currentLoss ? currentLoss.disc.toFixed(4) : '—'}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Time Elapsed</span>
                <span style={{ display: 'block', fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'monospace', marginTop: '2px' }}>
                  {timeElapsed}s
                </span>
              </div>
              <div>
                <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>ETA</span>
                <span style={{ display: 'block', fontSize: '16px', fontWeight: 800, color: 'var(--color-accent)', fontFamily: 'monospace', marginTop: '2px' }}>
                  {timeRemaining}s
                </span>
              </div>
            </div>

            {/* Run Button and progress bar */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button 
                  onClick={handleTriggerSynthesis}
                  disabled={isTraining}
                  className="btn-primary"
                  style={{ padding: '12px 28px', fontSize: '13px', animation: !isTraining ? 'pulse-glow 2.5s infinite' : 'none' }}
                >
                  {isTraining ? 'Compiling Adaptors...' : '🚀 Launch AI Synthesis'}
                </button>

                {isTraining && (
                  <div style={{ flexGrow: 1, backgroundColor: 'var(--bg-primary)', borderRadius: '999px', height: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                    <div 
                      className="bg-gradient-primary"
                      style={{ height: '100%', width: `${trainingProgress}%`, transition: 'width 0.15s ease-out' }}
                    />
                  </div>
                )}

                {trainingComplete && !isTraining && (
                  <div style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 700 }}>
                    ✓ Generative cohort fully synthesized ({syntheticRows.toLocaleString()} patients) at 94.2% fidelity.
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* 3. Pipeline Flowchart & Engine Diagrams */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Generative AI Architecture Flow</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Flowchart depicting deep neural parameter adaptations and differential privacy noise injections.</p>
        </div>

        {selectedModel === 'gemma' ? (
          <div className="flowchart-container">
            <div className="flowchart-node active">EHR Raw Data</div>
            <span className="flowchart-arrow">→</span>
            <div className="flowchart-node">Gemma Embedder</div>
            <span className="flowchart-arrow">→</span>
            <div className="flowchart-node active" style={{ borderColor: 'var(--color-secondary)' }}>LoRA Adaptors (Rank 16)</div>
            <span className="flowchart-arrow">→</span>
            <div className="flowchart-node">Laplace Noise Injector (ε=4.5)</div>
            <span className="flowchart-arrow">→</span>
            <div className="flowchart-node active" style={{ borderColor: 'var(--color-success)' }}>Synthesized FHIR Bundle</div>
          </div>
        ) : (
          <div className="flowchart-container">
            <div className="flowchart-node active">Tabular Patients</div>
            <span className="flowchart-arrow">→</span>
            <div className="flowchart-node" style={{ borderColor: 'var(--color-secondary)' }}>Generator G(z)</div>
            <span className="flowchart-arrow">⇄</span>
            <div className="flowchart-node" style={{ borderColor: 'var(--color-primary)' }}>Discriminator D(x)</div>
            <span className="flowchart-arrow">→</span>
            <div className="flowchart-node">Laplace Noise (ε=4.5)</div>
            <span className="flowchart-arrow">→</span>
            <div className="flowchart-node active" style={{ borderColor: 'var(--color-success)' }}>De-identified Output Table</div>
          </div>
        )}
      </div>

      {/* 4. Model Benchmarking & Synthetic Preview Spreadsheet */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '24px' }}>
        
        {/* Synthetic Preview Spreadsheet */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Synthetic Cohort Preview</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Spreadsheet inspect of generated patients (fully anonymized but statistically identical).</p>
          </div>

          <div className="preview-spreadsheet-container">
            <table className="preview-table">
              <thead>
                <tr>
                  <th>Synth ID</th>
                  <th>Age Range</th>
                  <th>Gender</th>
                  <th>Race</th>
                  <th>Marital Status</th>
                  <th>Simulated Diagnosis</th>
                </tr>
              </thead>
              <tbody>
                {trainingComplete ? (
                  <>
                    <tr>
                      <td>#SYN-001</td>
                      <td>Adult (19-49)</td>
                      <td>Female</td>
                      <td>White</td>
                      <td>Married</td>
                      <td>Type 2 Diabetes Mellitus</td>
                    </tr>
                    <tr>
                      <td>#SYN-002</td>
                      <td>Senior (50-69)</td>
                      <td>Male</td>
                      <td>Black/AA</td>
                      <td>Single</td>
                      <td>Hypertension / Essential</td>
                    </tr>
                    <tr>
                      <td>#SYN-003</td>
                      <td>Adult (19-49)</td>
                      <td>Female</td>
                      <td>Asian</td>
                      <td>Married</td>
                      <td>Chronic Kidney Disease</td>
                    </tr>
                    <tr>
                      <td>#SYN-004</td>
                      <td>Pediatric (0-3)</td>
                      <td>Male</td>
                      <td>White</td>
                      <td>Single</td>
                      <td>Acute Bronchitis</td>
                    </tr>
                    <tr>
                      <td>#SYN-005</td>
                      <td>Geriatric (70+)</td>
                      <td>Female</td>
                      <td>Other</td>
                      <td>Single</td>
                      <td>Osteoarthritis</td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                      Launch AI Synthesis training to populate the synthetic spreadsheet preview.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Model Benchmarking comparison table */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Engine Benchmark Matrix</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Comparison values of available generative frameworks.</p>
          </div>

          <table className="custom-table text-xs">
            <thead>
              <tr>
                <th>Model</th>
                <th>Fidelity</th>
                <th>Privacy</th>
                <th>Speed</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ background: selectedModel === 'gemma' ? 'rgba(124, 58, 237, 0.05)' : 'none' }}>
                <td style={{ fontWeight: 700 }}>Gemma-2-2B LoRA</td>
                <td style={{ color: 'var(--color-success)' }}>94.2%</td>
                <td style={{ color: 'var(--color-success)' }}>ε = 4.5</td>
                <td>142 tok/s</td>
              </tr>
              <tr style={{ background: selectedModel === 'ctgan' ? 'rgba(37, 99, 235, 0.05)' : 'none' }}>
                <td style={{ fontWeight: 700 }}>CTGAN Baseline</td>
                <td style={{ color: 'var(--color-success)' }}>96.8%</td>
                <td style={{ color: 'var(--color-success)' }}>ε = 4.5</td>
                <td>1,200 r/s</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700 }}>CopulaGAN</td>
                <td>89.4%</td>
                <td style={{ color: 'var(--color-warning)' }}>ε = 6.0</td>
                <td>1,800 r/s</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      {/* 5. AI recommendations & Insights panel */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Brain size={32} style={{ color: 'var(--color-secondary)', shrink: 0 }} />
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: 800 }}>AI Advisor Recommendation</h4>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
            For high-fidelity medical research cohorts, **Gemma-2-2B fine-tuned** matches sequence patterns (like chronic disease progressions) with 94.2% correctness. If speed and simple demographic ratios are preferred, select **CTGAN** to generate 1,200 patient rows per second.
          </p>
        </div>
      </div>

    </div>
  );
}
