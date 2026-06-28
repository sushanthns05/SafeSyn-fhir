# SafeSyn AI 🛡️

**SafeSyn AI** is an advanced, privacy-preserving healthcare data engine and synthetic data generation platform. It empowers clinical researchers, data scientists, and healthcare organizations to safely share, analyze, and utilize highly sensitive Electronic Health Records (EHR) and FHIR data without compromising patient privacy.

By leveraging Differential Privacy and Generative AI techniques, SafeSyn AI generates highly statistically similar ("High Fidelity") synthetic cohorts that look and behave like real patient data while ensuring absolutely zero data leakage or row replication.

---

## 🌟 Key Features

* **FHIR & CSV Ingestion:** Seamlessly upload and parse complex FHIR transaction bundles (JSON) and clinical CSV datasets. Automatically extracts demographics, clinical activities, and flags Personally Identifiable Information (PII).
* **Differential Privacy Engine:** Transforms high-risk datasets into secure synthetic cohorts, utilizing Laplace noise injection and strict privacy budgets (Epsilon/Delta) to guarantee compliance with HIPAA, GDPR, and NIST-188 standards.
* **Fidelity & Utility Analytics:** Real-time statistical dashboard displaying dynamic evaluation metrics, including Column Shapes, Column Pair Trends, Overall Similarity, and Quality Scores to prove downstream research readiness.
* **Interactive Data Visualizations:** Built-in charts and histograms comparing Original vs. Synthetic datasets across age, gender, and encounter frequencies to visualize statistical parity.
* **Secure Export & Compliance:** Automatically generates downloadable outputs including:
  * Synthetic FHIR JSON Bundles
  * Synthetic CSV Data
  * Signed Privacy Audit Reports (PDF)
  * Fidelity & Utility Evaluation Reports (PDF)
  * Verifiable Compliance Certificates

---

## 🛠️ Technology Stack

* **Frontend Framework:** React 19 + Vite
* **Styling:** Custom CSS (Glassmorphism, Dark/Light modes, vibrant interactive UI)
* **Data Visualization:** Chart.js & react-chartjs-2
* **Icons & UI Elements:** Lucide-React
* **Document Generation:** jsPDF & jspdf-autotable
* **Hosting/Deployment:** Firebase Hosting (Web App)

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v18 or higher)
* npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sushanthns05/SafeSyn-fhir.git
   cd SafeSyn-fhir/dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```
SafeSyn-fhir/
│
├── dashboard/
│   ├── public/                   # Static assets, default evaluation reports & CSV datasets
│   ├── src/
│   │   ├── components/           # React UI Components (Analytics, Overview, Downloads, etc.)
│   │   ├── utils/                # Utility scripts (e.g., fhirParser.js for data ingestion)
│   │   ├── App.jsx               # Main application router and state management
│   │   ├── index.css             # Global styling and design system tokens
│   │   └── main.jsx              # Application entry point
│   ├── index.html                # Vite HTML template
│   ├── package.json              # Dependencies and scripts
│   └── vite.config.js            # Vite configuration
│
└── README.md                     # Project documentation
```

---

## 📊 How It Works

1. **Ingest:** Drag and drop your highly sensitive `.json` (FHIR Bundle) or `.csv` dataset into the SafeSyn AI Source Data tab.
2. **Scan:** The system immediately scans the data for PII and categorizes the risk level.
3. **Synthesize:** Initiate the AI Synthesis process, which trains on the dataset and generates a secure, privacy-preserving synthetic cohort.
4. **Analyze:** Navigate to the Analytics tab to review the exact statistical parity (fidelity) and data utility comparisons between the real and synthetic cohorts.
5. **Export:** Download the newly generated synthetic dataset and certified compliance reports for downstream research.

---

## 🔒 Security & Privacy Notice

**SafeSyn AI** operates fully locally within your browser during development and doesn't send your raw, highly sensitive patient data to external servers without explicit API routing. All parsing, visualization, and PDF generation processes are currently designed to maintain strict client-side isolation.

---

## 📜 License

This project is proprietary and intended for healthcare data generation use-cases. All rights reserved.
