import React from 'react';
import { motion } from 'framer-motion';
import { CloudUpload, ShieldCheck, Database, BarChart3 } from 'react-icons/fi';

const steps = [
  {
    id: 1,
    title: 'Upload FHIR JSON',
    description: 'Drag and drop your FHIR bundle or CSV file.',
    img: '/assets/workflow_step_1.png',
    icon: <CloudUpload size={32} />,
  },
  {
    id: 2,
    title: 'Detect PII Risks',
    description: 'Automated privacy audit identifies sensitive fields.',
    img: '/assets/workflow_step_2.png',
    icon: <ShieldCheck size={32} />,
  },
  {
    id: 3,
    title: 'Generate Synthetic Data',
    description: 'AI models create realistic, privacy‑preserving records.',
    img: '/assets/workflow_step_3.png',
    icon: <Database size={32} />,
  },
  {
    id: 4,
    title: 'Compare Data Fidelity',
    description: 'Visual charts show similarity between raw and synthetic data.',
    img: '/assets/workflow_step_4.png',
    icon: <BarChart3 size={32} />,
  },
];

const ProductDemoSection = () => (
  <section style={{ padding: '80px 5%', backgroundColor: 'var(--bg-primary)' }}>
    <h2 className="gradient-text" style={{ textAlign: 'center', fontSize: '32px', fontWeight: 800, marginBottom: '40px' }}>
      See SafeSyn In Action
    </h2>
    <div className="grid-cols-5" style={{ gap: '24px' }}>
      {steps.map(step => (
        <motion.div
          key={step.id}
          className="glass-panel glass-panel-hover"
          style={{ padding: '24px', textAlign: 'center' }}
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.5, delay: step.id * 0.1 }}
        >
          <div style={{ marginBottom: '12px' }}>{step.icon}</div>
          <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{step.title}</h4>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>{step.description}</p>
          <img src={step.img} alt={step.title} style={{ width: '100%', borderRadius: '8px' }} />
        </motion.div>
      ))}
    </div>
    <div style={{ textAlign: 'center', marginTop: '40px' }}>
      <motion.button
        className="btn-primary"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => console.log('View Dashboard Demo')}
      >
        View Dashboard Demo
      </motion.button>
    </div>
  </section>
);

export default ProductDemoSection;
