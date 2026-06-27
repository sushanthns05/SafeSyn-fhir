import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Trash2, Download, X, MessageSquare, 
  Copy, Check, Info, ShieldAlert, CheckCircle2 
} from 'lucide-react';

export default function SafeSynChatbot({ stats, activeDataset, patients, piiLogs, triggeredMessage }) {
  const [isOpen, setIsOpen] = useState(false);
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: "Hello! I'm SafeSyn AI. I can help explain privacy metrics, differential privacy (DP), data fidelity, synthetic data models, and regulatory compliance on this dashboard.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  useEffect(() => {
    if (triggeredMessage?.text) {
      setIsOpen(true);
      handleSendMessage(triggeredMessage.text);
    }
  }, [triggeredMessage]);

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    if (!textToSend) {
      setInput('');
    }

    // Add user message
    const userMsg = {
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    if (!apiKey) {
      // Missing API Key fallback response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          sender: 'assistant',
          text: "I need a **Gemini API Key** to respond in real-time. Please define `VITE_GEMINI_API_KEY` in your environment configuration (`.env` file).",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setIsTyping(false);
      }, 800);
      return;
    }

    try {
      // Build conversation context history
      const formattedHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      // Append current user message
      formattedHistory.push({
        role: 'user',
        parts: [{ text: query }]
      });

      // System context instructions
      const systemInstruction = `You are SafeSyn AI Assistant, a privacy-preserving healthcare data engine expert and AI data analyst. You are integrated into the SafeSyn platform. Your primary purpose is to help researchers and compliance officers understand differential privacy, data fidelity, synthetic data generation models (like CTGAN, Gemma-2B fine-tuning), and HIPAA/GDPR compliance. 

IMPORTANT: You are NOT a medical diagnosis system; do not provide medical advice. Be concise, highly professional, and informative. Keep responses structured using bullet points or clean markdown where appropriate.

Current Dashboard Context:
- Active Dataset: ${activeDataset.name} (Size: ${activeDataset.size})
- Total Ingested Patient Records: ${stats.totalRecords.toLocaleString()}
- Privacy Protection Level: ${stats.riskLevel === 'Low' ? 'Low Risk (Secure Synthetic Data)' : 'High Risk (Raw Vulnerable Data)'}
- Differential Privacy: Epsilon (ε) = 4.5, Laplace Noise
- Data Fidelity: 94.2% EHR cohort match
- PII Audit Violations in Raw Data: ${piiLogs.length} violations (including SSN, Full Name, Contact info, Addresses, DL, Passport, NPI Practitioner IDs)
- Active models: Gemma-2-2B Fine-Tuned (for clinical JSON schemas) & CTGAN Tabular Checker (for structural correlations)`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: formattedHistory,
            systemInstruction: {
              parts: [{ text: systemInstruction }]
            },
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 800
            }
          })
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Gemini API Error');
      }

      const botText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I apologize, but I couldn't formulate a response. Please check your query or try again.";

      setMessages(prev => [...prev, {
        sender: 'assistant',
        text: botText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

    } catch (err) {
      setMessages(prev => [...prev, {
        sender: 'assistant',
        text: `Error connecting to Gemini API: ${err.message}. Please check your internet connection or verify that your API key is correct.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (action) => {
    let query = '';
    switch (action) {
      case 'explain_privacy':
        query = "Can you explain the privacy score and current leakage risk of the active dataset?";
        break;
      case 'explain_fidelity':
        query = `Why is the cohort fidelity score 94.2% and what does it mean for research utility?`;
        break;
      case 'dataset_summary':
        query = `Provide a comprehensive summary of the current active dataset named ${activeDataset.name} containing ${stats.totalRecords.toLocaleString()} records.`;
        break;
      case 'explain_epsilon':
        query = "What does Epsilon (ε) = 4.5 mean in terms of differential privacy and mathematical guarantees?";
        break;
      case 'model_info':
        query = "What AI models are used for synthetic generation on this platform? Please describe Gemma-2B fine-tuning and CTGAN.";
        break;
      case 'compliance_status':
        query = "Explain the HIPAA Safe Harbor, GDPR Article 29, and NIST compliance status of the synthesized dataset.";
        break;
      default:
        return;
    }
    handleSendMessage(query);
  };

  const handleCopyMessage = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleClearChat = () => {
    if (window.confirm("Clear conversation history?")) {
      setMessages([
        {
          sender: 'assistant',
          text: "Conversation cleared. Hello! I'm SafeSyn AI. How can I assist you with clinical privacy analytics today?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  const handleExportChat = () => {
    const formatted = messages.map(msg => `[${msg.timestamp}] ${msg.sender.toUpperCase()}:\n${msg.text}\n`).join('\n');
    const blob = new Blob([formatted], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `safesyn_ai_assistant_chat_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="chatbot-container">
      {isOpen ? (
        <div className="chatbot-window glass-panel" style={{ display: 'flex', flexDirection: 'column', borderRadius: '16px', overflow: 'hidden' }}>
          
          {/* Header */}
          <div className="chatbot-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ fontSize: '20px' }}>🤖</div>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 800, margin: 0, color: '#FFF' }}>SafeSyn AI Assistant</h4>
                <p style={{ fontSize: '9px', opacity: 0.8, margin: 0, color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Privacy & Data Intelligence • <span style={{ color: '#4ADE80', fontWeight: 'bold' }}>🟢 Online</span>
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button 
                onClick={handleClearChat}
                style={{ background: 'transparent', border: 'none', color: '#FFF', cursor: 'pointer', display: 'flex', padding: '4px' }}
                title="Clear Conversation"
              >
                <Trash2 size={16} />
              </button>
              <button 
                onClick={handleExportChat}
                style={{ background: 'transparent', border: 'none', color: '#FFF', cursor: 'pointer', display: 'flex', padding: '4px' }}
                title="Export Conversation"
              >
                <Download size={16} />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#FFF', cursor: 'pointer', display: 'flex', padding: '4px' }}
                title="Close Chat"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="chatbot-messages" style={{ flexGrow: 1, overflowY: 'auto' }}>
            {messages.map((msg, index) => (
              <div key={index} className={`chat-bubble chat-bubble-${msg.sender}`} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {msg.text}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '9px', opacity: 0.6, marginTop: '4px' }}>
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'assistant' && (
                    <button 
                      onClick={() => handleCopyMessage(msg.text, index)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', padding: '2px' }}
                      title="Copy response"
                    >
                      {copiedIndex === index ? <Check size={10} style={{ color: '#4ADE80' }} /> : <Copy size={10} />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            )}

            {/* Welcome quick actions (shown on initialization or clear) */}
            {messages.length === 1 && !isTyping && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Capabilities:
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                  <div>✓ Privacy scores</div>
                  <div>✓ Differential privacy</div>
                  <div>✓ Data fidelity</div>
                  <div>✓ Synthetic data generation</div>
                  <div>✓ Compliance metrics</div>
                  <div>✓ Dataset statistics</div>
                </div>

                <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '8px' }}>
                  Quick Actions:
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  <button className="btn-secondary" style={{ padding: '6px', fontSize: '11px', borderRadius: '6px', justifyContent: 'center' }} onClick={() => handleQuickAction('explain_privacy')}>
                    Explain Privacy Score
                  </button>
                  <button className="btn-secondary" style={{ padding: '6px', fontSize: '11px', borderRadius: '6px', justifyContent: 'center' }} onClick={() => handleQuickAction('explain_fidelity')}>
                    Explain Fidelity
                  </button>
                  <button className="btn-secondary" style={{ padding: '6px', fontSize: '11px', borderRadius: '6px', justifyContent: 'center' }} onClick={() => handleQuickAction('dataset_summary')}>
                    Dataset Summary
                  </button>
                  <button className="btn-secondary" style={{ padding: '6px', fontSize: '11px', borderRadius: '6px', justifyContent: 'center' }} onClick={() => handleQuickAction('explain_epsilon')}>
                    Explain Epsilon
                  </button>
                  <button className="btn-secondary" style={{ padding: '6px', fontSize: '11px', borderRadius: '6px', justifyContent: 'center' }} onClick={() => handleQuickAction('model_info')}>
                    AI Model Info
                  </button>
                  <button className="btn-secondary" style={{ padding: '6px', fontSize: '11px', borderRadius: '6px', justifyContent: 'center' }} onClick={() => handleQuickAction('compliance_status')}>
                    Compliance Status
                  </button>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="chatbot-input-area" style={{ borderTop: '1px solid var(--border-color)', padding: '10px 16px', display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Ask about privacy or dataset stats..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              style={{ fontSize: '12px', height: '36px' }}
            />
            <button 
              className="btn-primary" 
              onClick={() => handleSendMessage()}
              style={{ width: '36px', height: '36px', padding: 0, flexShrink: 0, borderRadius: '8px' }}
            >
              <Send size={14} />
            </button>
          </div>

        </div>
      ) : (
        <button 
          className="chatbot-fab" 
          onClick={() => setIsOpen(true)}
          title="Open SafeSyn AI Assistant"
        >
          <MessageSquare size={24} />
        </button>
      )}
    </div>
  );
}
