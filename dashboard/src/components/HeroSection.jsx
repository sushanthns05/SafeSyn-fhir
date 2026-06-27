import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = ({ onLaunchConsole }) => (
  <section className="landing-hero" style={{ padding: '140px 24px 100px 24px' }}>
    <div className="landing-glow-blob" />
    <motion.div
      className="hero-content"
      style={{ position: 'relative', zIndex: 5, maxWidth: '1000px', margin: '0 auto' }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="badge badge-cyan" style={{ marginBottom: '24px', padding: '6px 14px' }}>
        ✨ SafeSyn Enterprise V2.0
      </div>
      <motion.h2
        className="gradient-text"
        style={{ fontSize: '54px', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: '24px' }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Transform Sensitive Healthcare Data Into <br />
        <span className="gradient-text">Privacy-Preserving Intelligence.</span>
      </motion.h2>
      <motion.p
        style={{ fontSize: '18px', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto 40px auto', lineHeight: 1.6, fontWeight: 500 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        Generate high-fidelity, fully de-identified synthetic EHR datasets, FHIR endpoints, and clinical records using advanced generative models backed by mathematical Differential Privacy.
      </motion.p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
        <motion.button
          className="btn-primary"
          style={{ padding: '14px 36px', fontSize: '15px' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onLaunchConsole}
        >
          Launch Dashboard Console
        </motion.button>
        <motion.button
          className="btn-secondary"
          style={{ padding: '14px 36px', fontSize: '15px' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => console.log('Demo video placeholder')}
        >
          Watch Demo Video ⚡
        </motion.button>
      </div>
    </motion.div>
  </section>
);

export default HeroSection;
