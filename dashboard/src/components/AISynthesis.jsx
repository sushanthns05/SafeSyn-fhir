import React, { useState, useEffect, useRef } from 'react';
import { Cpu, Sliders, Play, CheckCircle2, AlertCircle, Loader } from 'lucide-react';
import { Line } from 'react-chartjs-2';
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
      
      if (progress >= 100) {
        clearInterval(trainingTimer.current);
        setTrainingProgress(100);
        setCurrentEpoch(maxEpochs);
        setCurrentValScore(0.942);
        setIsTraining(false);
        setTrainingComplete(true);
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
      },
      tooltip: {
        backgroundColor: 'var(--bg-secondary)',
        titleColor: 'var(--text-primary)',
        bodyColor: 'var(--text-secondary)',
        borderColor: 'var(--border-color)',
        borderWidth: 1,
        titleFont: { family: 'Inter', weight: 'bold' }
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
      {/* Page Title */}
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
        <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>CORE ENGINE // TRAINING TUNER</span>
        <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', marginTop: '4px' }}>AI Synthesis Control Center</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>Configure differential privacy boundaries, select generative model checkpoints, and monitor GAN convergence curves.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        
        {/* Left Side: Model Select & Parameters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Model Selection Card */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                <option value="ctgan">CTGAN Baseline</option>
              </select>
            </div>

            <div style={{ padding: '16px', borderRadius: '12px', border: '1px dashed var(--border-color)', backgroundColor: 'rgba(37, 99, 235, 0.02)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)' }}>{modelMetadata[selectedModel].params}</span>
                <span className="badge badge-green" style={{ fontSize: '10px' }}>Loaded</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {modelMetadata[selectedModel].desc}
              </p>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '8px', marginTop: '4px' }}>
                State: {modelMetadata[selectedModel].status}
              </div>
            </div>
          </div>

          {/* Parameters Sliders */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders style={{ color: 'var(--color-secondary)' }} size={18} />
              Hyperparameter Settings
            </h3>

            {/* Synthetic Rows Slider */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>Synthetic Output Size</span>
                <span style={{ fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'monospace' }}>{syntheticRows.toLocaleString()} Records</span>
              </div>
              <input 
                type="range" 
                min="1000" 
                max="50000" 
                step="1000"
                className="slider"
                value={syntheticRows}
                onChange={(e) => setSyntheticRows(parseInt(e.target.value))}
                disabled={isTraining}
              />
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Target row length for the synthetic output table.</p>
            </div>

            {/* Privacy Strength (Epsilon) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>Differential Privacy Strength (ε)</span>
                <span style={{ fontWeight: 800, color: 'var(--color-secondary)', fontFamily: 'monospace' }}>ε = {privacyStrength.toFixed(1)}</span>
              </div>
              <input 
                type="range" 
                min="0.1" 
                max="15.0" 
                step="0.1"
                className="slider"
                value={privacyStrength}
                onChange={(e) => setPrivacyStrength(parseFloat(e.target.value))}
                disabled={isTraining}
              />
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Privacy budget constraint. Lower ε means tighter protection but slower pattern discovery.</p>
            </div>

            {/* Noise Level */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>Calibrated Noise Scale (δ)</span>
                <span style={{ fontWeight: 800, color: 'var(--color-accent)', fontFamily: 'monospace' }}>{(noiseLevel * 100).toFixed(0)}% Noise</span>
              </div>
              <input 
                type="range" 
                min="0.01" 
                max="1.0" 
                step="0.01"
                className="slider"
                value={noiseLevel}
                onChange={(e) => setNoiseLevel(parseFloat(e.target.value))}
                disabled={isTraining}
              />
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Laplacian perturbation magnitude added to continuous variables.</p>
            </div>

            {/* Random Seed */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>Entropy Seed</span>
                <span style={{ fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'monospace' }}># {randomSeed}</span>
              </div>
              <input 
                type="number" 
                className="form-input"
                style={{ padding: '6px 12px', fontSize: '12px' }}
                value={randomSeed}
                onChange={(e) => setRandomSeed(parseInt(e.target.value) || 1)}
                disabled={isTraining}
              />
            </div>
          </div>

        </div>

        {/* Right Side: Training curves / live stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>AI Generator Optimization Curves</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Real-time loss tracking for GAN structures or LoRA gradient steps.</p>
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                {isTraining && (
                  <span className="badge badge-amber animate-pulse-glow" style={{ animation: 'pulse-glow 1.5s infinite' }}>
                    <Loader size={12} style={{ marginRight: '4px', animation: 'spin 1s linear infinite' }} /> Ingesting / Epoch {currentEpoch}
                  </span>
                )}
                {trainingComplete && !isTraining && (
                  <span className="badge badge-green">
                    <CheckCircle2 size={12} style={{ marginRight: '4px' }} /> Converged
                  </span>
                )}
                {!trainingComplete && !isTraining && (
                  <span className="badge badge-red">
                    <AlertCircle size={12} style={{ marginRight: '4px' }} /> Idle
                  </span>
                )}
              </div>
            </div>

            {/* Loss graph */}
            <div style={{ position: 'relative', height: '280px', width: '100%', flexGrow: 1 }}>
              <Line data={chartData} options={chartOptions} />
            </div>

            {/* Live statistics row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '20px', textAlign: 'center' }}>
              <div>
                <p style={{ fontSize: '10px', font: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Gen Loss</p>
                <p style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-secondary)', marginTop: '4px', fontFamily: 'monospace' }}>
                  {currentLoss ? currentLoss.gen.toFixed(4) : '—'}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '10px', font: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Disc Loss</p>
                <p style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-primary)', marginTop: '4px', fontFamily: 'monospace' }}>
                  {currentLoss ? currentLoss.disc.toFixed(4) : '—'}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '10px', font: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Fidelity Estimate</p>
                <p style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-success)', marginTop: '4px', fontFamily: 'monospace' }}>
                  {currentValScore > 0 ? `${(currentValScore * 100).toFixed(1)}%` : '—'}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '10px', font: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Progress</p>
                <p style={{ fontSize: '20px', fontWeight: 800, marginTop: '4px', fontFamily: 'monospace' }}>
                  {trainingProgress}%
                </p>
              </div>
            </div>

            {/* Trigger Button container */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button 
                  onClick={handleTriggerSynthesis}
                  disabled={isTraining}
                  className="btn-primary"
                  style={{ flexShrink: 0, padding: '12px 32px', fontSize: '14px', animation: !isTraining ? 'pulse-glow 2s infinite' : 'none' }}
                >
                  {isTraining ? (
                    <>
                      <Loader size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> Compiling Model...
                    </>
                  ) : (
                    <>
                      🚀 Generate Synthetic Data
                    </>
                  )}
                </button>
                
                {isTraining && (
                  <div style={{ flexGrow: 1, backgroundColor: 'var(--bg-primary)', borderRadius: '9999px', height: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                    <div 
                      className="h-full bg-gradient-primary"
                      style={{ height: '100%', width: `${trainingProgress}%`, transition: 'width 0.15s ease-out' }}
                    ></div>
                  </div>
                )}

                {trainingComplete && !isTraining && (
                  <div style={{ fontSize: '12px', color: 'var(--color-success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={14} /> Synthetic dataset generation completed ({syntheticRows.toLocaleString()} rows).
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
