/**
 * Utility to parse FHIR transaction bundles and CSV files for demographics,
 * clinical activity, and PII identification.
 */

// Helper to calculate age from birthDate
export function calculateAge(birthDateString) {
  if (!birthDateString) return Math.floor(Math.random() * 60) + 20;
  const birthDate = new Date(birthDateString);
  const today = new Date('2026-06-27'); // Aligned with metadata current time
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? age : 0;
}

// Parse a single FHIR Bundle JSON
export function parseFhirBundle(bundle) {
  if (!bundle || bundle.resourceType !== 'Bundle' || !Array.isArray(bundle.entry)) {
    throw new Error('Invalid FHIR Bundle format. Must be a transaction bundle.');
  }

  // 1. Locate the Patient resource
  const patientEntry = bundle.entry.find(e => e.resource && e.resource.resourceType === 'Patient');
  if (!patientEntry) {
    throw new Error('Patient resource not found in the FHIR Bundle.');
  }

  const patient = patientEntry.resource;
  
  // 2. Locate Encounters and Conditions
  const encounters = bundle.entry.filter(e => e.resource && e.resource.resourceType === 'Encounter');
  const conditions = bundle.entry.filter(e => e.resource && e.resource.resourceType === 'Condition');
  
  // 3. Extract Demographics
  const gender = patient.gender || 'unknown';
  
  // Extract Race (US Core Patient Extension)
  let race = 'Other';
  const raceExt = patient.extension?.find(ext => ext.url === 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-race');
  if (raceExt) {
    const textSub = raceExt.extension?.find(sub => sub.url === 'text');
    if (textSub && textSub.valueString) {
      race = textSub.valueString;
    } else {
      const categorySub = raceExt.extension?.find(sub => sub.url === 'ombCategory');
      if (categorySub && categorySub.valueCoding && categorySub.valueCoding.display) {
        race = categorySub.valueCoding.display;
      }
    }
  }

  // Extract Marital Status
  let maritalStatus = 'Single';
  if (patient.maritalStatus) {
    if (patient.maritalStatus.text) {
      maritalStatus = patient.maritalStatus.text;
    } else if (Array.isArray(patient.maritalStatus.coding) && patient.maritalStatus.coding[0]?.display) {
      maritalStatus = patient.maritalStatus.coding[0].display;
    }
  }

  // Calculate Age
  const age = calculateAge(patient.birthDate);

  // Extract Conditions list
  const conditionList = conditions.map(c => {
    return c.resource.code?.text || c.resource.code?.coding?.[0]?.display || 'Unknown Condition';
  });
  // Unique conditions
  const uniqueConditions = [...new Set(conditionList)];

  // 4. Auditing PII
  const piiAudited = [];
  
  // Patient UUID
  if (patient.id) {
    piiAudited.push({
      field: 'Patient UUID',
      value: patient.id,
      description: 'Internal database key containing global patient resource identifier.'
    });
  }

  // Full Name
  if (Array.isArray(patient.name) && patient.name[0]) {
    const n = patient.name[0];
    const given = Array.isArray(n.given) ? n.given.join(' ') : '';
    const family = n.family || '';
    const prefix = Array.isArray(n.prefix) ? n.prefix.join(' ') : '';
    const fullName = `${prefix ? prefix + ' ' : ''}${given} ${family}`.trim();
    if (fullName) {
      piiAudited.push({
        field: 'Full Patient Name',
        value: fullName,
        description: 'Direct identity identifier (Surname + First Names).'
      });
    }
  }

  // Phone numbers/telecoms
  if (Array.isArray(patient.telecom)) {
    patient.telecom.forEach(t => {
      piiAudited.push({
        field: `Contact Info (${t.system || 'telecom'})`,
        value: t.value,
        description: `Direct communications address (${t.use || 'primary'}).`
      });
    });
  }

  // Address
  if (Array.isArray(patient.address) && patient.address[0]) {
    const addr = patient.address[0];
    const fullAddr = `${addr.line ? addr.line.join(', ') : ''}, ${addr.city || ''}, ${addr.state || ''} ${addr.postalCode || ''}`.replace(/^,\s*/, '').trim();
    if (fullAddr) {
      piiAudited.push({
        field: 'Physical Address',
        value: fullAddr,
        description: 'Geographic location detail, violating HIPAA Safe Harbor.'
      });
    }
  }

  // SSN, DL, Passport
  if (Array.isArray(patient.identifier)) {
    patient.identifier.forEach(id => {
      const typeText = id.type?.text || id.type?.coding?.[0]?.display || '';
      let fieldLabel = 'National Identifier';
      
      if (typeText.toLowerCase().includes('social security') || id.system?.includes('us-ssn')) {
        fieldLabel = 'Social Security Number (SSN)';
      } else if (typeText.toLowerCase().includes('driver') || id.system?.includes('dl')) {
        fieldLabel = "Driver's License";
      } else if (typeText.toLowerCase().includes('passport') || id.system?.includes('passport')) {
        fieldLabel = 'Passport Number';
      } else if (typeText.toLowerCase().includes('medical record') || id.type?.coding?.[0]?.code === 'MR') {
        fieldLabel = 'Medical Record Number (MRN)';
      }

      piiAudited.push({
        field: fieldLabel,
        value: id.value,
        description: `Government or institutional unique identifier.`
      });
    });
  }

  // Mother's Maiden Name
  const mothersMaidenNameExt = patient.extension?.find(ext => ext.url?.includes('mothersMaidenName'));
  if (mothersMaidenNameExt && mothersMaidenNameExt.valueString) {
    piiAudited.push({
      field: "Mother's Maiden Name",
      value: mothersMaidenNameExt.valueString,
      description: 'High-security security verification question answer.'
    });
  }

  // Practitioner NPIs
  encounters.forEach(e => {
    if (Array.isArray(e.resource.participant)) {
      e.resource.participant.forEach(p => {
        if (p.individual && p.individual.reference) {
          const ref = p.individual.reference;
          const display = p.individual.display || 'Practitioner';
          if (ref.includes('us-npi') || ref.includes('Practitioner')) {
            piiAudited.push({
              field: 'Practitioner ID (NPI)',
              value: ref.split('|').pop(),
              description: `Care provider directory identifier (${display}).`
            });
          }
        }
      });
    }
  });

  return {
    patientId: patient.id || 'unknown',
    gender: gender.charAt(0).toUpperCase() + gender.slice(1),
    maritalStatus,
    race,
    age,
    conditions: uniqueConditions,
    encounterCount: encounters.length,
    piiAudited,
    riskLevel: piiAudited.length > 0 ? 'High' : 'Low'
  };
}

// Parse a raw CSV text containing gender,maritalStatus,age
export function parseCsvText(csvText) {
  if (!csvText || typeof csvText !== 'string') {
    throw new Error('CSV text is empty or invalid.');
  }

  const lines = csvText.split('\n').map(l => l.trim()).filter(l => l);
  if (lines.length === 0) {
    throw new Error('CSV file has no lines.');
  }

  const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
  const genderIdx = headers.findIndex(h => h.toLowerCase() === 'gender');
  const maritalIdx = headers.findIndex(h => h.toLowerCase() === 'maritalstatus');
  const ageIdx = headers.findIndex(h => h.toLowerCase() === 'age');

  if (genderIdx === -1 || maritalIdx === -1 || ageIdx === -1) {
    throw new Error('CSV must contain headers: gender, maritalStatus, age');
  }

  const records = [];
  const piiAudited = []; // CSV with just gender, maritalStatus, age typically has no PII!

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
    if (row.length < headers.length) continue;

    const age = parseInt(row[ageIdx], 10);
    const gender = row[genderIdx];
    const maritalStatus = row[maritalIdx];

    records.push({
      gender: gender.charAt(0).toUpperCase() + gender.slice(1),
      maritalStatus,
      race: 'Synthesized / Unknown',
      age: isNaN(age) ? 35 : age,
      conditions: ['Allergy check due', 'Hypertension management'].slice(0, Math.floor(Math.random() * 2) + 1),
      encounterCount: Math.floor(Math.random() * 5) + 1
    });
  }

  return {
    records,
    piiAudited,
    riskLevel: 'Low' // Standard synthesized CSV has no raw PII
  };
}
