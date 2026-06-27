/**
 * Pre-compiled sample patient data and statistics generator.
 * This represents the 5000+ patients in synthetic_patient_dataset.csv
 */

// A rich set of detailed patients for the UI Table (Page 1)
export const SAMPLE_DETAILED_PATIENTS = [
  { id: 1, age: 47, gender: 'Female', maritalStatus: 'Single', race: 'White', conditions: ['Prediabetes', 'Allergy check due'], encounters: 8 },
  { id: 2, age: 12, gender: 'Female', maritalStatus: 'Married', race: 'Black or African American', conditions: ['Childhood Asthma'], encounters: 3 },
  { id: 3, age: 20, gender: 'Male', maritalStatus: 'Married', race: 'White', conditions: ['Acute bronchitis'], encounters: 2 },
  { id: 4, age: 25, gender: 'Female', maritalStatus: 'Married', race: 'Asian', conditions: ['Normal pregnancy checkup'], encounters: 12 },
  { id: 5, age: 38, gender: 'Male', maritalStatus: 'Married', race: 'White', conditions: ['Hypertension', 'Hyperlipidemia'], encounters: 6 },
  { id: 6, age: 3, gender: 'Male', maritalStatus: 'Married', race: 'Other', conditions: ['Well child visit'], encounters: 1 },
  { id: 7, age: 35, gender: 'Female', maritalStatus: 'Married', race: 'White', conditions: ['Chronic Sinusitis'], encounters: 4 },
  { id: 8, age: 42, gender: 'Female', maritalStatus: 'Single', race: 'Asian', conditions: ['Depression'], encounters: 9 },
  { id: 9, age: 73, gender: 'Male', maritalStatus: 'Married', race: 'White', conditions: ['Type 2 Diabetes', 'Hypertension', 'Osteoarthritis'], encounters: 18 },
  { id: 10, age: 35, gender: 'Male', maritalStatus: 'Married', race: 'Black or African American', conditions: ['Low back pain'], encounters: 5 },
  { id: 11, age: 10, gender: 'Female', maritalStatus: 'Married', race: 'White', conditions: ['Otitis media'], encounters: 4 },
  { id: 12, age: 27, gender: 'Male', maritalStatus: 'Married', race: 'Other', conditions: ['General physical exam'], encounters: 2 },
  { id: 13, age: 40, gender: 'Female', maritalStatus: 'Married', race: 'White', conditions: ['Gastroesophageal reflux disease (GERD)'], encounters: 7 },
  { id: 14, age: 41, gender: 'Male', maritalStatus: 'Married', race: 'Asian', conditions: ['Essential hypertension'], encounters: 5 },
  { id: 15, age: 21, gender: 'Male', maritalStatus: 'Single', race: 'Black or African American', conditions: ['Contact dermatitis'], encounters: 2 },
  { id: 16, age: 8, gender: 'Female', maritalStatus: 'Single', race: 'White', conditions: ['Well child visit'], encounters: 1 },
  { id: 17, age: 6, gender: 'Male', maritalStatus: 'Single', race: 'Asian', conditions: ['Streptococcal sore throat'], encounters: 3 },
  { id: 18, age: 77, gender: 'Female', maritalStatus: 'Married', race: 'White', conditions: ['Osteoporosis', 'Cataract'], encounters: 14 },
  { id: 19, age: 19, gender: 'Male', maritalStatus: 'Married', race: 'White', conditions: ['General physical exam'], encounters: 2 },
  { id: 20, age: 64, gender: 'Female', maritalStatus: 'Married', race: 'Black or African American', conditions: ['Hyperlipidemia', 'Hypertension'], encounters: 11 },
  { id: 21, age: 23, gender: 'Female', maritalStatus: 'Married', race: 'Asian', conditions: ['Allergic rhinitis'], encounters: 3 },
  { id: 22, age: 57, gender: 'Male', maritalStatus: 'Married', race: 'White', conditions: ['Type 2 Diabetes', 'Neuropathy'], encounters: 15 },
  { id: 23, age: 79, gender: 'Male', maritalStatus: 'Married', race: 'White', conditions: ['Coronary heart disease', 'Atrial fibrillation'], encounters: 22 },
  { id: 24, age: 51, gender: 'Female', maritalStatus: 'Single', race: 'White', conditions: ['Anxiety disorder'], encounters: 6 },
  { id: 25, age: 24, gender: 'Male', maritalStatus: 'Married', race: 'Black or African American', conditions: ['Acute pharyngitis'], encounters: 2 },
  { id: 26, age: 58, gender: 'Female', maritalStatus: 'Married', race: 'White', conditions: ['Hypothyroidism', 'Osteoarthritis'], encounters: 10 },
  { id: 27, age: 31, gender: 'Male', maritalStatus: 'Single', race: 'Other', conditions: ['Insomnia'], encounters: 4 },
  { id: 28, age: 44, gender: 'Male', maritalStatus: 'Married', race: 'White', conditions: ['Obesity', 'Hyperlipidemia'], encounters: 5 },
  { id: 29, age: 62, gender: 'Female', maritalStatus: 'Single', race: 'White', conditions: ['Rheumatoid Arthritis'], encounters: 12 },
  { id: 30, age: 14, gender: 'Female', maritalStatus: 'Single', race: 'Asian', conditions: ['Scoliosis screening'], encounters: 2 }
];

const CONDITIONS_POOL = [
  'Hypertension', 'Hyperlipidemia', 'Type 2 Diabetes', 'Obesity', 
  'Prediabetes', 'Anxiety disorder', 'Depression', 'Asthma', 
  'Gastroesophageal reflux disease (GERD)', 'Chronic Sinusitis', 
  'Hypothyroidism', 'Osteoarthritis', 'Back pain', 'Allergic rhinitis',
  'Acute bronchitis', 'Otitis media', 'Cataract', 'Osteoporosis'
];

const RACES_POOL = [
  'White', 'White', 'White', 'Black or African American', 
  'Asian', 'Asian', 'Other', 'American Indian or Alaska Native'
];

// Generates simulated records matching the real synthetic_patient_dataset.csv distributions
// Used for high-fidelity chart computations
export function generateStatisticalPopulation(count = 5001, seed = 42) {
  // Simple LCG random generator for reproducible data based on seed
  let s = seed;
  const random = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };

  const population = [];

  for (let i = 0; i < count; i++) {
    // 1. Gender distribution (approx 51% female, 49% male)
    const genderVal = random() > 0.49 ? 'female' : 'male';
    const gender = genderVal === 'female' ? 'Female' : 'Male';

    // 2. Marital Status distribution (approx 75% Married, 25% Single)
    const maritalStatus = random() > 0.25 ? 'Married' : 'Single';

    // 3. Age distribution matching the CSV (heavy on children/infants like 3, and clusters around 30-60)
    let age;
    const ageRand = random();
    if (ageRand < 0.15) {
      age = 3; // Synthea has a lot of pediatric baseline records (3 years old)
    } else if (ageRand < 0.25) {
      age = Math.floor(random() * 15) + 4; // 4 to 18
    } else if (ageRand < 0.75) {
      age = Math.floor(random() * 30) + 19; // 19 to 49
    } else if (ageRand < 0.95) {
      age = Math.floor(random() * 20) + 50; // 50 to 69
    } else {
      age = Math.floor(random() * 16) + 70; // 70 to 85
    }

    // 4. Race
    const race = RACES_POOL[Math.floor(random() * RACES_POOL.length)];

    // 5. Conditions count & list
    const condCount = age < 10 ? 1 : age < 40 ? Math.floor(random() * 2) + 1 : Math.floor(random() * 3) + 1;
    const conditions = [];
    for (let c = 0; c < condCount; c++) {
      conditions.push(CONDITIONS_POOL[Math.floor(random() * CONDITIONS_POOL.length)]);
    }

    // 6. Encounters count
    const encounters = Math.max(1, Math.floor((age / 4) + (random() * 5)));

    population.push({
      id: i + 31, // offset from sample detailed patients
      age,
      gender,
      maritalStatus,
      race,
      conditions: [...new Set(conditions)],
      encounters
    });
  }

  return population;
}

// Generate the full static population (matches 5001 records)
export const ENTIRE_RAW_POPULATION = [
  ...SAMPLE_DETAILED_PATIENTS,
  ...generateStatisticalPopulation(4971, 42)
];
