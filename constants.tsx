import React from 'react';
import { Users, CheckSquare, Zap, Shield } from 'lucide-react';
import { Course, Grade, EducationLevel, Exam, Stream } from './types';

const getThumb = (subject: string, id: number) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=400&sig=${subject}`;

const CURRENT_YEAR = new Date().getFullYear();

export const NATIONAL_CENTER_INFO = {
  name: "IFTU National Digital Sovereign Education Center",
  shortName: "IFTU NDC",
  location: "Ethiopia, Oromia region, West Arsi Zone, Kore woreda",
  coordinates: { lat: 7.15, lng: 39.05 },
  mapsLink: "https://www.google.com/maps/search/Kore+woreda+West+Arsi+Zone+Oromia+Ethiopia/",
  authorizedBy: "Jemal Fano Haji",
  founderPhoto: "/developer_jemal_fano_portrait.jpg"
};

export const MOCK_COURSES: Course[] = [
  // --- GRADE 9 & 10 GENERAL STREAM COURSES ---
  {
    id: 'g9-eng',
    title: 'Grade 9 English Language',
    code: 'ENG-G9-GEN',
    grade: Grade.G9,
    stream: Stream.GENERAL,
    level: EducationLevel.SECONDARY,
    thumbnail: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=800',
    description: 'Ethiopian Curriculum Grade 9 English: Reading comprehension, grammar structures, vocabulary development, listening, and formal composition.',
    instructor: 'Abebe T.',
    instructorEmail: 'abebe.t@iftu.edu.et',
    subject: 'English',
    lessons: [
      { id: 'eng9-l1', title: 'Unit 1: Study Skills & Grammar', duration: '30m', content: 'Present simple vs present continuous tenses, dictionary usage, and reading techniques.', type: 'reading', contentType: 'reading' },
      { id: 'eng9-l2', title: 'Unit 2: Environmental Conservation', duration: '25m', content: 'Comprehension passage on Ethiopian endemic wildlife and passive voice exercises.', type: 'video', contentType: 'video', videoUrl: 'https://www.youtube.com/watch?v=5UfG_5iK_N8' },
      { id: 'eng9-tutor', title: 'AI English Grammar Tutor', duration: 'Flexible', content: 'Master key grammar points: Tense consistency, reported speech, conditional sentences, and active/passive transformations.', type: 'tutor', contentType: 'tutor' }
    ]
  },
  {
    id: 'g10-afaan-oromoo',
    title: 'Afaan Oromoo Kutaa 9 & 10',
    code: 'AFO-G10-GEN',
    grade: Grade.G10,
    stream: Stream.GENERAL,
    level: EducationLevel.SECONDARY,
    thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800',
    description: 'Sirna Barnoota Biyyaaleessaa: Caaslugaa Afaan Oromoo, Ogbarruu Oromoo, Mammootaa fi Og-aadaa Kutaa 9ffaafi 10ffaa.',
    instructor: 'Barsiisaa Gemechu',
    instructorEmail: 'gemechu@iftu.edu.et',
    subject: 'Afaan Oromoo',
    lessons: [
      { id: 'afo10-l1', title: 'Boqonnaa 1: Caaslugaa fi Jechoota', duration: '30m', content: 'Hima Salphaa fi Hima Xaxamaa, Dhamjecha fi seerluga Afaan Oromoo.', type: 'reading', contentType: 'reading' },
      { id: 'afo10-l2', title: 'Boqonnaa 2: Ogbarruu fi Afoola Oromoo', duration: '35m', content: 'Mammaaksa, Eebbaa fi Hibboo: Xin-sammuu fi Aadaa Oromoo sakatta\'uu.', type: 'quiz', contentType: 'quiz', questions: [
        { id: 'q-afo-1', text: 'Dhamjechi caasaa jechaa keessatti maal gargaara?', type: 'multiple-choice', options: ['Hiika jechaa jijjiiruu', 'Sagaleedha', 'Fiixee qofa', 'Hima raawwachuu'], correctAnswer: 0, points: 10, category: 'Afaan Oromoo' }
      ]}
    ]
  },
  {
    id: 'g9-amharic',
    title: 'Amharic Language Grade 9 & 10',
    code: 'AMH-G9-GEN',
    grade: Grade.G9,
    stream: Stream.GENERAL,
    level: EducationLevel.SECONDARY,
    thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800',
    description: 'Grade 9 & 10 Amharic Curriculum: Grammar analysis, paragraph composition, literature, and oral presentation skills.',
    instructor: 'Tigist W.',
    instructorEmail: 'tigist.w@iftu.edu.et',
    subject: 'Amharic',
    lessons: [
      { id: 'amh9-l1', title: 'Chapter 1: Amharic Grammar & Syntax', duration: '30m', content: 'Nouns, verbs, adjectives and sentence structures in standard written Amharic.', type: 'reading', contentType: 'reading' }
    ]
  },
  {
    id: 'g9-math',
    title: 'Grade 9 & 10 Mathematics',
    code: 'MATH-G9-GEN',
    grade: Grade.G9,
    stream: Stream.GENERAL,
    level: EducationLevel.SECONDARY,
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=800',
    description: 'Ethiopian Curriculum Math for Grades 9 & 10: Real numbers, linear equations, quadratic functions, coordinate geometry, and basic trigonometry.',
    instructor: 'Mr. Solomon B.',
    instructorEmail: 'solomon.b@iftu.edu.et',
    subject: 'Mathematics',
    lessons: [
      { id: 'm9-l1', title: 'Unit 1: Further Sets & Real Numbers', duration: '35m', content: 'Set operations, Venn diagrams, rational and irrational number proofs.', type: 'reading', contentType: 'reading' },
      { id: 'm9-l2', title: 'Unit 2: Linear & Quadratic Equations', duration: '40m', content: 'Solving equations using factoring, completing the square, and quadratic formula.', type: 'video', contentType: 'video', videoUrl: 'https://www.youtube.com/watch?v=5UfG_5iK_N8' }
    ]
  },
  {
    id: 'g9-phys',
    title: 'Grade 9 & 10 Physics',
    code: 'PHYS-G9-GEN',
    grade: Grade.G9,
    stream: Stream.GENERAL,
    level: EducationLevel.SECONDARY,
    thumbnail: 'https://images.unsplash.com/photo-1635070041012-9169624d3c48?auto=format&fit=crop&q=80&w=800',
    description: 'General Physics: Physical quantities, vectors, kinematics, Newton’s laws of motion, work, energy, power, and simple machines.',
    instructor: 'Dr. Tesfaye',
    instructorEmail: 'dr.tesfaye@iftu.edu.et',
    subject: 'Physics',
    lessons: [
      { id: 'p9-l1', title: 'Unit 1: Vectors & Kinematics', duration: '30m', content: 'Scalar vs vector quantities, displacement, velocity, and acceleration graphs.', type: 'reading', contentType: 'reading' }
    ]
  },
  {
    id: 'g10-chem',
    title: 'Grade 9 & 10 Chemistry',
    code: 'CHEM-G10-GEN',
    grade: Grade.G10,
    stream: Stream.GENERAL,
    level: EducationLevel.SECONDARY,
    thumbnail: 'https://images.unsplash.com/photo-1532187863486-abbf71d50228?auto=format&fit=crop&q=80&w=800',
    description: 'General Chemistry: Atomic models, electron configuration, periodic table trends, chemical bonds, stoichiometry, and electrochemistry.',
    instructor: 'Abebe C.',
    instructorEmail: 'abebe.c@iftu.edu.et',
    subject: 'Chemistry',
    lessons: [
      { id: 'c10-l1', title: 'Unit 1: Periodic Table Trends', duration: '30m', content: 'Ionization energy, electronegativity, atomic radius trends across periods and groups.', type: 'reading', contentType: 'reading' }
    ]
  },
  {
    id: 'g9-bio',
    title: 'Grade 9 & 10 Biology',
    code: 'BIO-G9-GEN',
    grade: Grade.G9,
    stream: Stream.GENERAL,
    level: EducationLevel.SECONDARY,
    thumbnail: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=800',
    description: 'General Biology: Cell theory, enzymes, photosynthesis, human digestive/circulatory systems, genetics, and Ethiopian ecology.',
    instructor: 'Dr. Almaz H.',
    instructorEmail: 'almaz.h@iftu.edu.et',
    subject: 'Biology',
    lessons: [
      { id: 'b9-l1', title: 'Unit 1: Cell Structure & Function', duration: '35m', content: 'Organelles of plant and animal cells, cell membrane transport mechanisms.', type: 'reading', contentType: 'reading' }
    ]
  },
  {
    id: 'g9-it',
    title: 'Grade 9 & 10 Information Technology (IT)',
    code: 'IT-G9-GEN',
    grade: Grade.G9,
    stream: Stream.GENERAL,
    level: EducationLevel.SECONDARY,
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
    description: 'Information Technology: Hardware components, operating systems, word processing, spreadsheets, internet literacy, and cybersecurity.',
    instructor: 'Jemal Fano Haji',
    instructorEmail: 'jemalfano030@gmail.com',
    subject: 'IT',
    lessons: [
      { id: 'it9-l1', title: 'Unit 1: Computer Hardware & Systems Architecture', duration: '30m', content: 'CPU, RAM, storage devices, motherboard architecture, and input/output peripherals.', type: 'reading', contentType: 'reading' },
      { id: 'it9-l2', title: 'Unit 2: Computer Networks & Internet Protocol', duration: '40m', content: 'LAN, WAN, IP addresses, DNS, internet safety, and cybersecurity best practices.', type: 'video', contentType: 'video', videoUrl: 'https://www.youtube.com/watch?v=5UfG_5iK_N8' }
    ]
  },
  {
    id: 'g9-hpe',
    title: 'Grade 9 & 10 Health & Physical Education (HPE)',
    code: 'HPE-G9-GEN',
    grade: Grade.G9,
    stream: Stream.GENERAL,
    level: EducationLevel.SECONDARY,
    thumbnail: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800',
    description: 'Health & Physical Education: Physical fitness components, athletics rules, team sports strategy, personal hygiene, and nutritional health.',
    instructor: 'Coach Dawit',
    instructorEmail: 'dawit@iftu.edu.et',
    subject: 'HPE',
    lessons: [
      { id: 'hpe9-l1', title: 'Unit 1: Fitness Components & Athletic Training', duration: '25m', content: 'Cardiovascular endurance, muscular strength, flexibility, and sprint techniques.', type: 'reading', contentType: 'reading' }
    ]
  },
  {
    id: 'g10-hist',
    title: 'Grade 9 & 10 History',
    code: 'HIST-G10-GEN',
    grade: Grade.G10,
    stream: Stream.GENERAL,
    level: EducationLevel.SECONDARY,
    thumbnail: 'https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&q=80&w=800',
    description: 'History of Ethiopia & The World: Early civilizations, Aksumite empire, Medieval kingdoms, Battle of Adwa, and 20th century world wars.',
    instructor: 'Mr. Getachew',
    instructorEmail: 'getachew@iftu.edu.et',
    subject: 'History',
    lessons: [
      { id: 'hist10-l1', title: 'Unit 1: Ethiopian State Formation & Victory of Adwa', duration: '40m', content: 'Historical analysis of the 1896 Battle of Adwa and sovereign independence.', type: 'reading', contentType: 'reading' }
    ]
  },
  {
    id: 'g9-geo',
    title: 'Grade 9 & 10 Geography',
    code: 'GEO-G9-GEN',
    grade: Grade.G9,
    stream: Stream.GENERAL,
    level: EducationLevel.SECONDARY,
    thumbnail: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=800',
    description: 'Geography of Ethiopia & The Horn: Map reading scales, landforms, climate zones, drainage systems, and natural resource conservation.',
    instructor: 'Mrs. Aster',
    instructorEmail: 'aster@iftu.edu.et',
    subject: 'Geography',
    lessons: [
      { id: 'geo9-l1', title: 'Unit 1: Map Reading & Contour Lines', duration: '35m', content: 'Calculating scale, measuring distances, reading elevation contours and slope profiles.', type: 'reading', contentType: 'reading' }
    ]
  },
  {
    id: 'g10-econ',
    title: 'Grade 9 & 10 Economics',
    code: 'ECON-G10-GEN',
    grade: Grade.G10,
    stream: Stream.GENERAL,
    level: EducationLevel.SECONDARY,
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800',
    description: 'Introductory Economics: Scarcity, opportunity cost, supply & demand curves, market equilibrium, and basic banking systems.',
    instructor: 'Dr. Worku',
    instructorEmail: 'worku@iftu.edu.et',
    subject: 'Economics',
    lessons: [
      { id: 'econ10-l1', title: 'Unit 1: Principles of Supply & Demand', duration: '30m', content: 'Law of demand, law of supply, price elasticity, and market clearing prices.', type: 'reading', contentType: 'reading' }
    ]
  },
  {
    id: 'g9-citizenship',
    title: 'Grade 9 & 10 Citizenship Education',
    code: 'CIT-G9-GEN',
    grade: Grade.G9,
    stream: Stream.GENERAL,
    level: EducationLevel.SECONDARY,
    thumbnail: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=800',
    description: 'Citizenship & Ethics: Constitutional principles, human rights, civic responsibility, rule of law, anti-corruption, and national unity.',
    instructor: 'Mr. Hailu',
    instructorEmail: 'hailu@iftu.edu.et',
    subject: 'Citizenship',
    lessons: [
      { id: 'cit9-l1', title: 'Unit 1: Constitution & Rule of Law', duration: '30m', content: 'Rights and duties of citizens under the Ethiopian Federal Constitution.', type: 'reading', contentType: 'reading' }
    ]
  },

  // --- GRADE 11 & 12 NATURAL SCIENCE STREAM COURSES ---
  {
    id: 'g11-nat-math',
    title: 'Grade 11 & 12 Mathematics (Natural Science)',
    code: 'MATH-G11-NAT',
    grade: Grade.G11,
    stream: Stream.NATURAL_SCIENCE,
    level: EducationLevel.SECONDARY,
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=800',
    description: 'Advanced Natural Science Math: Vectors, complex numbers, matrices, sequences & series, differential & integral calculus, and 3D geometry.',
    instructor: 'Prof. Alemayehu',
    instructorEmail: 'alemayehu@iftu.edu.et',
    subject: 'Mathematics',
    lessons: [
      { id: 'm11-nat-l1', title: 'Unit 1: Sequences & Series', duration: '40m', content: 'Arithmetic and geometric progressions, summation notation, infinite series convergence.', type: 'reading', contentType: 'reading' },
      { id: 'm11-nat-l2', title: 'Unit 2: Limits & Continuity', duration: '45m', content: 'Epsilon-delta limits, limit laws, algebraic manipulation of limits, continuity tests.', type: 'video', contentType: 'video', videoUrl: 'https://www.youtube.com/watch?v=5UfG_5iK_N8' }
    ]
  },
  { 
    id: 'g11-phys-core', 
    title: 'Grade 11 Core Physics', 
    code: 'PHYS-G11-C', 
    grade: Grade.G11, 
    stream: Stream.NATURAL_SCIENCE, 
    level: EducationLevel.SECONDARY, 
    thumbnail: 'https://images.unsplash.com/photo-1635070041012-9169624d3c48?q=80&w=1000&auto=format&fit=crop', 
    description: 'Foundational mechanics, vectors, rotational motion, thermodynamics, and fluid dynamics for Natural Science.', 
    instructor: 'Dr. Tesfaye', 
    instructorEmail: 'dr.tesfaye@iftu.edu.et', 
    subject: 'Physics', 
    lessons: [
      { id: 'p11-l1', title: 'Kinematics', duration: '20m', content: 'Linear motion basics.', type: 'video', contentType: 'video', videoUrl: 'https://www.youtube.com/watch?v=5UfG_5iK_N8' },
      { id: 'p11-l2', title: 'Dynamics & Forces', duration: '25m', content: 'Newton\'s laws of motion and gravitational force calculation.', type: 'reading', contentType: 'reading' },
      { id: 'p11-l3', title: 'Energy & Work', duration: '30m', content: 'Conservation of energy and mechanical work principles.', type: 'quiz', contentType: 'quiz', questions: [
        { id: 'q-p11-1', text: 'What is the unit of Work?', type: 'multiple-choice', options: ['Newton', 'Joule', 'Watt', 'Pascal'], correctAnswer: 1, points: 10, category: 'Physics' }
      ]},
      { 
        id: 'p11-tutor', 
        title: 'AI Physics Tutor', 
        duration: 'Flexible', 
        content: 'Linear motion is motion in a straight line. Key kinematic equations: v = u + at, s = ut + 1/2at^2, v^2 = u^2 + 2as. Vector resolution into x and y components is essential for 2D dynamics.', 
        type: 'tutor', 
        contentType: 'tutor' 
      }
    ]
  },
  { 
    id: 'g12-phys-adv', 
    title: 'Grade 12 Advanced Physics', 
    code: 'PHYS-G12-A', 
    grade: Grade.G12, 
    stream: Stream.NATURAL_SCIENCE, 
    level: EducationLevel.SECONDARY, 
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800', 
    description: 'Grade 12 Physics: Electromagnetism, Maxwell equations, wave optics, special relativity, atomic physics, and nuclear reactions.', 
    instructor: 'Dr. Tesfaye', 
    instructorEmail: 'dr.tesfaye@iftu.edu.et', 
    subject: 'Physics', 
    prerequisites: ['g11-phys-core'],
    lessons: [
      { id: 'p12-l1', title: 'Quantum Duality & Photoelectric Effect', duration: '45m', content: 'Wave-particle duality, Planck constant, photoelectric equation, and de Broglie wavelength.', type: 'reading', contentType: 'reading' },
      { id: 'p12-l2', title: 'Electromagnetism & Induction', duration: '40m', content: 'Faraday\'s law, Lenz\'s law, electromagnetic waves spectrum.', type: 'video', contentType: 'video', videoUrl: 'https://www.youtube.com/watch?v=5UfG_5iK_N8' }
    ]
  },
  {
    id: 'g11-nat-chem',
    title: 'Grade 11 & 12 Advanced Chemistry',
    code: 'CHEM-G11-NAT',
    grade: Grade.G11,
    stream: Stream.NATURAL_SCIENCE,
    level: EducationLevel.SECONDARY,
    thumbnail: 'https://images.unsplash.com/photo-1532187863486-abbf71d50228?auto=format&fit=crop&q=80&w=800',
    description: 'Natural Science Chemistry: Chemical thermodynamics, reaction kinetics, chemical equilibrium, acid-base titrations, and organic reaction mechanisms.',
    instructor: 'Abebe C.',
    instructorEmail: 'abebe.c@iftu.edu.et',
    subject: 'Chemistry',
    lessons: [
      { id: 'c11-nat-l1', title: 'Unit 1: Chemical Reaction Kinetics', duration: '35m', content: 'Reaction rate laws, order of reaction, activation energy, and Arrhenius equation.', type: 'reading', contentType: 'reading' }
    ]
  },
  {
    id: 'g12-nat-bio',
    title: 'Grade 12 Advanced Biology',
    code: 'BIO-G12-NAT',
    grade: Grade.G12,
    stream: Stream.NATURAL_SCIENCE,
    level: EducationLevel.SECONDARY,
    thumbnail: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=800',
    description: 'Advanced Molecular Biology: DNA structure, transcription, translation, recombinant DNA technology, human genetics, and biotechnology in agriculture.',
    instructor: 'Dr. Almaz H.',
    instructorEmail: 'almaz.h@iftu.edu.et',
    subject: 'Biology',
    lessons: [
      { id: 'b12-nat-l1', title: 'Unit 1: Molecular Genetics & Protein Synthesis', duration: '45m', content: 'Structure of DNA double helix, mRNA transcription, tRNA codons, and ribose translation.', type: 'reading', contentType: 'reading' }
    ]
  },
  {
    id: 'g11-nat-it',
    title: 'Grade 11 & 12 Computer Science & IT',
    code: 'IT-G11-NAT',
    grade: Grade.G11,
    stream: Stream.NATURAL_SCIENCE,
    level: EducationLevel.SECONDARY,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
    description: 'Natural Science IT: Problem solving algorithms, Python programming, database management (SQL), and web application development.',
    instructor: 'Jemal Fano Haji',
    instructorEmail: 'jemalfano030@gmail.com',
    subject: 'IT',
    lessons: [
      { id: 'it11-nat-l1', title: 'Unit 1: Algorithmic Logic & Python Syntax', duration: '40m', content: 'Variables, loops, control flow, functions, and data structures in Python.', type: 'reading', contentType: 'reading' }
    ]
  },
  {
    id: 'g11-nat-agri',
    title: 'Grade 11 & 12 Agricultural Science',
    code: 'AGRI-G11-NAT',
    grade: Grade.G11,
    stream: Stream.NATURAL_SCIENCE,
    level: EducationLevel.SECONDARY,
    thumbnail: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=800',
    description: 'Ethiopian Agricultural Science: Soil fertility management, crop rotation, irrigation technology, livestock breeding, and agro-forestry.',
    instructor: 'Dr. Bekele',
    instructorEmail: 'bekele@iftu.edu.et',
    subject: 'Agriculture',
    lessons: [
      { id: 'agri11-l1', title: 'Unit 1: Soil Physics & Agronomy Principles', duration: '35m', content: 'Soil texture, pH testing, organic fertilizer formulation, and sustainable farming.', type: 'reading', contentType: 'reading' }
    ]
  },
  {
    id: 'g11-nat-design',
    title: 'Grade 11 & 12 Design and Drawing',
    code: 'DES-G11-NAT',
    grade: Grade.G11,
    stream: Stream.NATURAL_SCIENCE,
    level: EducationLevel.SECONDARY,
    thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&q=80&w=800',
    description: 'Technical Design & Drawing: Geometrical construction, orthographic projections, 3D isometric sketching, sectioning, and CAD fundamentals.',
    instructor: 'Eng. Kassa',
    instructorEmail: 'kassa@iftu.edu.et',
    subject: 'Design and Drawing',
    lessons: [
      { id: 'des11-l1', title: 'Unit 1: Orthographic Projection Standards', duration: '40m', content: 'First angle vs third angle projections, hidden detail lines, and dimensioning standards.', type: 'reading', contentType: 'reading' }
    ]
  },
  {
    id: 'g11-nat-hpe',
    title: 'Grade 11 & 12 Natural Science HPE',
    code: 'HPE-G11-NAT',
    grade: Grade.G11,
    stream: Stream.NATURAL_SCIENCE,
    level: EducationLevel.SECONDARY,
    thumbnail: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800',
    description: 'Advanced HPE: Kinesiology, sports physiology, exercise science, athletic biomechanics, and community health management.',
    instructor: 'Coach Dawit',
    instructorEmail: 'dawit@iftu.edu.et',
    subject: 'HPE',
    lessons: [
      { id: 'hpe11-l1', title: 'Unit 1: Exercise Physiology & Biomechanics', duration: '30m', content: 'Musculoskeletal movement mechanics, lactic acid energy systems, and endurance conditioning.', type: 'reading', contentType: 'reading' }
    ]
  },

  // --- GRADE 11 & 12 SOCIAL SCIENCE STREAM COURSES ---
  {
    id: 'g11-soc-math',
    title: 'Grade 11 & 12 Mathematics (Social Science)',
    code: 'MATH-G11-SOC',
    grade: Grade.G11,
    stream: Stream.SOCIAL_SCIENCE,
    level: EducationLevel.SECONDARY,
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=800',
    description: 'Social Science Mathematics: Commercial math, statistics, probability distributions, linear programming, compound interest, and business modeling.',
    instructor: 'Mr. Solomon B.',
    instructorEmail: 'solomon.b@iftu.edu.et',
    subject: 'Mathematics',
    lessons: [
      { id: 'm11-soc-l1', title: 'Unit 1: Descriptive Statistics & Data Analysis', duration: '35m', content: 'Mean, median, mode, variance, standard deviation, and histograms in socio-economic surveys.', type: 'reading', contentType: 'reading' }
    ]
  },
  {
    id: 'g11-soc-eng',
    title: 'Grade 11 & 12 Advanced English & Communication',
    code: 'ENG-G11-SOC',
    grade: Grade.G11,
    stream: Stream.SOCIAL_SCIENCE,
    level: EducationLevel.SECONDARY,
    thumbnail: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=800',
    description: 'Advanced Social English: Essay writing, argumentative speech, literary analysis, formal report writing, and public communication.',
    instructor: 'Abebe T.',
    instructorEmail: 'abebe.t@iftu.edu.et',
    subject: 'English',
    lessons: [
      { id: 'eng11-soc-l1', title: 'Unit 1: Argumentative Essay Composition', duration: '35m', content: 'Structuring thesis statements, body paragraph evidence, counter-arguments, and persuasive devices.', type: 'reading', contentType: 'reading' }
    ]
  },
  {
    id: 'g11-soc-oromoo',
    title: 'Afaan Oromoo Sadarkaa 11 & 12',
    code: 'AFO-G11-SOC',
    grade: Grade.G11,
    stream: Stream.SOCIAL_SCIENCE,
    level: EducationLevel.SECONDARY,
    thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800',
    description: 'Afaan Oromoo Sadarkaa 11&12: Xiinsagaa, Xinhimaa, Ogbarruu fi Gadaa - Xiinxala Aadaa fi Saayinsii Hawaasaa.',
    instructor: 'Barsiisaa Gemechu',
    instructorEmail: 'gemechu@iftu.edu.et',
    subject: 'Afaan Oromoo',
    lessons: [
      { id: 'afo11-l1', title: 'Boqonnaa 1: Xiinsagaa fi Caasluga Afaan Oromoo', duration: '35m', content: 'Garaagarummaa sagaleewwan dubbachiiftuu fi dubbiffamaa, hudhaa fi jabbana.', type: 'reading', contentType: 'reading' }
    ]
  },
  {
    id: 'g12-soc-hist',
    title: 'Grade 12 History of Ethiopia & The World',
    code: 'HIST-G12-SOC',
    grade: Grade.G12,
    stream: Stream.SOCIAL_SCIENCE,
    level: EducationLevel.SECONDARY,
    thumbnail: 'https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&q=80&w=800',
    description: 'Advanced History: Imperial era, diplomatic history, League of Nations, Italian occupation & resistance, Cold War, and Pan-Africanism.',
    instructor: 'Mr. Getachew',
    instructorEmail: 'getachew@iftu.edu.et',
    subject: 'History',
    lessons: [
      { id: 'hist12-l1', title: 'Unit 1: Pan-African Movement & Organization of African Unity (OAU)', duration: '40m', content: 'Role of Addis Ababa as the diplomatic capital of Africa and anti-colonial movements.', type: 'reading', contentType: 'reading' }
    ]
  },
  {
    id: 'g11-soc-geo',
    title: 'Grade 11 & 12 Advanced Geography & GIS',
    code: 'GEO-G11-SOC',
    grade: Grade.G11,
    stream: Stream.SOCIAL_SCIENCE,
    level: EducationLevel.SECONDARY,
    thumbnail: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=800',
    description: 'Advanced Human & Physical Geography: Geographic Information Systems (GIS), satellite remote sensing, demographic models, and urban spatial planning.',
    instructor: 'Mrs. Aster',
    instructorEmail: 'aster@iftu.edu.et',
    subject: 'Geography',
    lessons: [
      { id: 'geo11-l1', title: 'Unit 1: Fundamentals of GIS & Remote Sensing', duration: '40m', content: 'Spatial data layers, raster vs vector formats, coordinate reference systems, and satellite imagery interpretation.', type: 'reading', contentType: 'reading' }
    ]
  },
  {
    id: 'g12-soc-econ',
    title: 'Grade 12 Advanced Economics',
    code: 'ECON-G12-SOC',
    grade: Grade.G12,
    stream: Stream.SOCIAL_SCIENCE,
    level: EducationLevel.SECONDARY,
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800',
    description: 'Macroeconomics & National Policy: Gross Domestic Product (GDP), inflation rates, fiscal policy, central banking, and international trade balance.',
    instructor: 'Dr. Worku',
    instructorEmail: 'worku@iftu.edu.et',
    subject: 'Economics',
    lessons: [
      { id: 'econ12-l1', title: 'Unit 1: National Income Accounting (GDP & GNP)', duration: '35m', content: 'Expenditure approach vs income approach for measuring national product and inflation adjustment.', type: 'reading', contentType: 'reading' }
    ]
  },
  {
    id: 'g11-soc-acct',
    title: 'Grade 11 & 12 Fundamentals of Accounting',
    code: 'ACCT-G11-SOC',
    grade: Grade.G11,
    stream: Stream.SOCIAL_SCIENCE,
    level: EducationLevel.SECONDARY,
    thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800',
    description: 'Financial Accounting Principles: Double-entry bookkeeping, journalizing transactions, ledger posting, trial balance, and financial statement generation.',
    instructor: 'Mr. Tolossa',
    instructorEmail: 'tolossa@iftu.edu.et',
    subject: 'Accounting',
    lessons: [
      { id: 'acct11-l1', title: 'Unit 1: Double-Entry Bookkeeping & The Accounting Equation', duration: '40m', content: 'Assets = Liabilities + Equity. Debits and credits rules for balance sheet accounts.', type: 'reading', contentType: 'reading' }
    ]
  },

  // --- TVET COLLEGE SPECIALTIES ---
  { 
    id: 'tvet-auto-l3', 
    title: 'Automotive Systems L3', 
    code: 'AUTO-L3', 
    grade: Grade.TVET_LEVEL_3, 
    stream: Stream.GENERAL, 
    level: EducationLevel.TVET, 
    thumbnail: 'https://images.unsplash.com/photo-1511919884224-41908855a90d?auto=format&fit=crop&q=80&w=800', 
    description: 'Advanced engine diagnostics, hybrid vehicle systems, and electrical safety protocols.', 
    instructor: 'Kebede J.', 
    instructorEmail: 'kebede.j@iftu.edu.et', 
    subject: 'Automotive', 
    lessons: [
      { id: 'auto-l3-intro', title: 'Hybrid Components', duration: '30m', content: 'Introduction to high-voltage batteries and inverters.', type: 'reading', contentType: 'reading' },
      { id: 'auto-l3-oral', title: 'Technical Interview: Hybrid Safety', duration: '15m', content: 'Live oral examination with an AI Auditor regarding High-Voltage safety protocols.', type: 'quiz', contentType: 'quiz' }
    ] 
  }
];

export const MOCK_EXAMS: Exam[] = [
  {
    id: 'exam-mock-g9-general',
    title: 'Grade 9 General Education Mock',
    courseCode: 'GEN-G9-MOCK',
    grade: Grade.G9,
    stream: Stream.GENERAL,
    academicYear: CURRENT_YEAR,
    durationMinutes: 60,
    totalPoints: 100,
    status: 'published',
    type: 'mock-eaes',
    semester: 1,
    difficulty: 'Medium',
    subject: 'General Science & Social',
    categories: ['Biology', 'Chemistry', 'Physics', 'History', 'Geography'],
    questions: [
      { id: 'g9q1', text: 'Which cell organelle is known as the "powerhouse" of the cell?', type: 'multiple-choice', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Vacuole'], correctAnswer: 1, points: 10, category: 'Biology' },
      { id: 'g9q2', text: 'What is the chemical symbol for Gold?', type: 'multiple-choice', options: ['Ag', 'Au', 'Pb', 'Fe'], correctAnswer: 1, points: 10, category: 'Chemistry' },
      { id: 'g9q3', text: 'Newton\'s First Law is also known as the Law of:', type: 'multiple-choice', options: ['Acceleration', 'Inertia', 'Action-Reaction', 'Gravity'], correctAnswer: 1, points: 10, category: 'Physics' },
      { id: 'g9q4', text: 'In which year did the Battle of Adwa take place?', type: 'multiple-choice', options: ['1886', '1896', '1906', '1936'], correctAnswer: 1, points: 10, category: 'History' },
      { id: 'g9q5', text: 'What is the capital of Ethiopia?', type: 'multiple-choice', options: ['Dire Dawa', 'Addis Ababa', 'Gondar', 'Hawassa'], correctAnswer: 1, points: 10, category: 'Geography' },
      { id: 'g9q6', text: 'Which planet is known as the Red Planet?', type: 'multiple-choice', options: ['Venus', 'Jupiter', 'Mars', 'Saturn'], correctAnswer: 2, points: 10, category: 'General Science' },
      { id: 'g9q7', text: 'What is the value of 2 + 3 * 4?', type: 'multiple-choice', options: ['20', '14', '16', '12'], correctAnswer: 1, points: 10, category: 'Mathematics' },
      { id: 'g9q8', text: 'Who interpreted the concept of Gravitation?', type: 'multiple-choice', options: ['Einstein', 'Newton', 'Galileo', 'Tesla'], correctAnswer: 1, points: 10, category: 'Physics' },
      { id: 'g9q9', text: 'The Nile river flows into which sea?', type: 'multiple-choice', options: ['Red Sea', 'Mediterranean Sea', 'Caspian Sea', 'Dead Sea'], correctAnswer: 1, points: 10, category: 'Geography' },
      { id: 'g9q10', text: 'Which component of the computer is the "brain"?', type: 'multiple-choice', options: ['RAM', 'Monitor', 'CPU', 'Hard Drive'], correctAnswer: 2, points: 10, category: 'IT' }
    ]
  },
  {
    id: 'exam-mock-g11-natural',
    title: 'Grade 11 Natural Science Complex Mock',
    courseCode: 'NAT-G11-MOCK',
    grade: Grade.G11,
    stream: Stream.NATURAL_SCIENCE,
    academicYear: CURRENT_YEAR,
    durationMinutes: 120,
    totalPoints: 110,
    status: 'published',
    type: 'mock-eaes',
    semester: 1,
    difficulty: 'Medium',
    subject: 'Natural Science Stream',
    categories: ['Physics', 'Chemistry', 'Biology', 'Maths', 'English', 'IT'],
    questions: [
      { id: 'g11nq1', text: 'The rate of change of momentum is equal to:', type: 'multiple-choice', options: ['Velocity', 'Work', 'Force', 'Kinetic Energy'], correctAnswer: 2, points: 10, category: 'Physics' },
      { id: 'g11nq2', text: 'Which subatomic particle has no charge?', type: 'multiple-choice', options: ['Proton', 'Electron', 'Neutron', 'Positron'], correctAnswer: 2, points: 10, category: 'Chemistry' },
      { id: 'g11nq3', text: 'What is the functional unit of heredity?', type: 'multiple-choice', options: ['Chromosome', 'DNA', 'Gene', 'Nucleus'], correctAnswer: 2, points: 10, category: 'Biology' },
      { id: 'g11nq4', text: 'Find the derivative of x^2.', type: 'multiple-choice', options: ['x', '2x', '2', 'x^3/3'], correctAnswer: 1, points: 10, category: 'Mathematics' },
      { id: 'g11nq5', text: 'Choose the correct synonym for "Benevolent":', type: 'multiple-choice', options: ['Cruel', 'Greedy', 'Kind', 'Fast'], correctAnswer: 2, points: 10, category: 'English' },
      { id: 'g11nq6', text: 'What is the primary function of an Operating System?', type: 'multiple-choice', options: ['Word Processing', 'Managing Hardware', 'Designing Graphics', 'Sending Emails'], correctAnswer: 1, points: 10, category: 'IT' },
      { id: 'g11nq7', text: 'What is the molar mass of Water (H2O)?', type: 'multiple-choice', options: ['16g/mol', '18g/mol', '20g/mol', '2g/mol'], correctAnswer: 1, points: 10, category: 'Chemistry' },
      { id: 'g11nq8', text: 'The law of conservation of energy states that energy:', type: 'multiple-choice', options: ['Can be created', 'Can be destroyed', 'Cannot be created or destroyed', 'Is always lost as heat'], correctAnswer: 2, points: 10, category: 'Physics' },
      { id: 'g11nq9', text: 'Where does photosynthesis primarily occur in a plant cell?', type: 'multiple-choice', options: ['Mitochondria', 'Chloroplast', 'Cytoplasm', 'Wall'], correctAnswer: 1, points: 10, category: 'Biology' },
      { id: 'g11nq10', text: 'Which protocol is used to browse websites?', type: 'multiple-choice', options: ['FTP', 'SMTP', 'HTTP', 'SSH'], correctAnswer: 2, points: 10, category: 'IT' },
      { id: 'g11nq11', text: 'According to Faraday\'s Law of induction, the induced EMF in a conductor is proportional to the rate of change of:', type: 'multiple-choice', options: ['Magnetic Flux', 'Magnetic Field', 'Electric Field', 'Current'], correctAnswer: 0, points: 10, category: 'Physics' }
    ]
  },
  {
    id: 'exam-mock-g11-social',
    title: 'Grade 11 Social Science Complex Mock',
    courseCode: 'SOC-G11-MOCK',
    grade: Grade.G11,
    stream: Stream.SOCIAL_SCIENCE,
    academicYear: CURRENT_YEAR,
    durationMinutes: 120,
    totalPoints: 110,
    status: 'published',
    type: 'mock-eaes',
    semester: 1,
    difficulty: 'Medium',
    subject: 'Social Science Stream',
    categories: ['History', 'Geography', 'Economics', 'Maths', 'English', 'IT'],
    questions: [
      { id: 'g11sq1', text: 'The League of Nations was established after which war?', type: 'multiple-choice', options: ['Napoleonic Wars', 'World War I', 'World War II', 'Cold War'], correctAnswer: 1, points: 10, category: 'History' },
      { id: 'g11sq2', text: 'Which is the largest desert in the world?', type: 'multiple-choice', options: ['Gobi', 'Kalahari', 'Sahara', 'Antarctica'], correctAnswer: 3, points: 10, category: 'Geography' },
      { id: 'g11sq3', text: 'The fundamental economic problem is:', type: 'multiple-choice', options: ['Inflation', 'Scarcity', 'Unemployment', 'Poverty'], correctAnswer: 1, points: 10, category: 'Economics' },
      { id: 'g11sq4', text: 'What is the median of 3, 7, 2, 9, 11?', type: 'multiple-choice', options: ['2', '7', '9', '6.4'], correctAnswer: 1, points: 10, category: 'Mathematics' },
      { id: 'g11sq5', text: 'Which word is the antonym of "Diligent"?', type: 'multiple-choice', options: ['Hardworking', 'Lazy', 'Smart', 'Active'], correctAnswer: 1, points: 10, category: 'English' },
      { id: 'g11sq6', text: 'What does URL stand for?', type: 'multiple-choice', options: ['Universal Resource Locator', 'Uniform Resource Locator', 'United Resource Line', 'User Resource List'], correctAnswer: 1, points: 10, category: 'IT' },
      { id: 'g11sq7', text: 'Which civilization developed the pyramid?', type: 'multiple-choice', options: ['Greek', 'Roman', 'Egyptian', 'Mesopotamian'], correctAnswer: 2, points: 10, category: 'History' },
      { id: 'g11sq8', text: 'GDP stands for:', type: 'multiple-choice', options: ['Gross Domestic Product', 'General Development Plan', 'Global Distribution Process', 'Government Debt Percentage'], correctAnswer: 0, points: 10, category: 'Economics' },
      { id: 'g11sq9', text: 'What is the prime meridian?', type: 'multiple-choice', options: ['0° Longitude', '0° Latitude', '180° Longitude', '90° Latitude'], correctAnswer: 0, points: 10, category: 'Geography' },
      { id: 'g11sq10', text: 'Which of these is a social media platform?', type: 'multiple-choice', options: ['Photoshop', 'LinkedIn', 'Word', 'Excel'], correctAnswer: 1, points: 10, category: 'IT' },
      { id: 'g11sq11', text: 'The primary goal of the United Nations is to:', type: 'multiple-choice', options: ['Promote global peace and security', 'Increase fossil fuel use', 'Start space colonies', 'Regulate internet memes'], correctAnswer: 0, points: 10, category: 'Citizenship' }
    ]
  },
  {
    id: 'exam-mock-g12-natural',
    title: 'Grade 12 National Natural Science Mock',
    courseCode: 'PHYS-G12-A',
    grade: Grade.G12,
    stream: Stream.NATURAL_SCIENCE,
    academicYear: CURRENT_YEAR,
    durationMinutes: 120,
    totalPoints: 110,
    status: 'published',
    type: 'mock-eaes',
    semester: 2,
    difficulty: 'Medium',
    subject: 'Natural Science Intensive',
    categories: ['Physics', 'Chemistry', 'Biology', 'Maths', 'English', 'IT'],
    questions: [
      { id: 'g12nq1', text: 'What is the escape velocity of Earth?', type: 'multiple-choice', options: ['9.8 km/s', '11.2 km/s', '7.9 km/s', '15.0 km/s'], correctAnswer: 1, points: 10, category: 'Physics' },
      { id: 'g12nq2', text: 'Which functional group is present in Alcohols?', type: 'multiple-choice', options: ['-COOH', '-CHO', '-OH', '-CO-'], correctAnswer: 2, points: 10, category: 'Chemistry' },
      { id: 'g12nq3', text: 'Mendel\'s second law is the law of:', type: 'multiple-choice', options: ['Segregation', 'Dominance', 'Independent Assortment', 'Inheritance'], correctAnswer: 2, points: 10, category: 'Biology' },
      { id: 'g12nq4', text: 'Integrate the function f(x) = 2x.', type: 'multiple-choice', options: ['x^2 + C', '2 + C', 'x + C', '2x^2 + C'], correctAnswer: 0, points: 10, category: 'Mathematics' },
      { id: 'g12nq5', text: 'Complete the sentence: "If I _____ harder, I would have passed."', type: 'multiple-choice', options: ['study', 'studied', 'had studied', 'will study'], correctAnswer: 2, points: 10, category: 'English' },
      { id: 'g12nq6', text: 'What is the main advantage of Fiber Optic cable?', type: 'multiple-choice', options: ['Cheap', 'No speed limit', 'High Bandwidth', 'Easy to install'], correctAnswer: 2, points: 10, category: 'IT' },
      { id: 'g12nq7', text: 'What is the oxidation state of Oxygen in most compounds?', type: 'multiple-choice', options: ['+2', '0', '-2', '-1'], correctAnswer: 2, points: 10, category: 'Chemistry' },
      { id: 'g12nq8', text: 'According to Einstein\'s E=mc^2, "c" represents:', type: 'multiple-choice', options: ['Constant', 'Cooling rate', 'Speed of light', 'Charge'], correctAnswer: 2, points: 10, category: 'Physics' },
      { id: 'g12nq9', text: 'Double fertilization is a characteristic of:', type: 'multiple-choice', options: ['Bryophytes', 'Pteridophytes', 'Gymnosperms', 'Angiosperms'], correctAnswer: 3, points: 10, category: 'Biology' },
      { id: 'g12nq10', text: 'Which HTML tag is used for the largest heading?', type: 'multiple-choice', options: ['<head>', '<h6>', '<heading>', '<h1>'], correctAnswer: 3, points: 10, category: 'IT' },
      { id: 'g12nq11', text: 'Faraday\'s Law of Induction states that the induced EMF in any closed circuit is equal to:', type: 'multiple-choice', options: ['The negative rate of change of magnetic flux through the circuit', 'The total current flowing through the circuit', 'The product of resistance and inductance', 'The density of the magnetic field'], correctAnswer: 0, points: 10, category: 'Physics' }
    ]
  },
  {
    id: 'exam-mock-g12-social',
    title: 'Grade 12 National Social Science Mock',
    courseCode: 'SOC-G12-MOCK',
    grade: Grade.G12,
    stream: Stream.SOCIAL_SCIENCE,
    academicYear: CURRENT_YEAR,
    durationMinutes: 120,
    totalPoints: 110,
    status: 'published',
    type: 'mock-eaes',
    semester: 2,
    difficulty: 'Medium',
    subject: 'Social Science Intensive',
    categories: ['History', 'Geography', 'Economics', 'Maths', 'English', 'IT'],
    questions: [
      { id: 'g12sq1', text: 'The Berlin Conference of 1884-85 was about:', type: 'multiple-choice', options: ['Ending Slavery', 'Partition of Africa', 'Industrial Revolution', 'French Revolution'], correctAnswer: 1, points: 10, category: 'History' },
      { id: 'g12sq2', text: 'Which type of rock is formed from cooled magma?', type: 'multiple-choice', options: ['Sedimentary', 'Metamorphic', 'Igneous', 'Sandstone'], correctAnswer: 2, points: 10, category: 'Geography' },
      { id: 'g12sq3', text: 'A market structure with only one seller is:', type: 'multiple-choice', options: ['Monopoly', 'Oligopoly', 'Perfect Competition', 'Monopsony'], correctAnswer: 0, points: 10, category: 'Economics' },
      { id: 'g12sq4', text: 'Solve for x: log10(x) = 2.', type: 'multiple-choice', options: ['10', '100', '20', '2'], correctAnswer: 1, points: 10, category: 'Mathematics' },
      { id: 'g12sq5', text: 'Identify the passive voice: "The chef cooked dinner."', type: 'multiple-choice', options: ['The chef is cooking.', 'Dinner was cooked by the chef.', 'Chef dinner cooked.', 'Dinner cooked the chef.'], correctAnswer: 1, points: 10, category: 'English' },
      { id: 'g12sq6', text: 'Which software is best for managing complex databases?', type: 'multiple-choice', options: ['Notepad', 'PowerPoint', 'MySQL', 'Paint'], correctAnswer: 2, points: 10, category: 'IT' },
      { id: 'g12sq7', text: 'The Cold War was primarily a struggle between:', type: 'multiple-choice', options: ['UK & France', 'USA & USSR', 'China & Japan', 'Germany & Italy'], correctAnswer: 1, points: 10, category: 'History' },
      { id: 'g12sq8', text: 'Which sector of the economy involves raw material extraction?', type: 'multiple-choice', options: ['Primary', 'Secondary', 'Tertiary', 'Quaternary'], correctAnswer: 0, points: 10, category: 'Economics' },
      { id: 'g12sq9', text: 'Plate tectonics theory explains:', type: 'multiple-choice', options: ['Weather patterns', 'Continental drift', 'Global warming', 'Tides'], correctAnswer: 1, points: 10, category: 'Geography' },
      { id: 'g12sq10', text: 'What is the purpose of a Firewall?', type: 'multiple-choice', options: ['Accelerate internet', 'Store passwords', 'Block unauthorized access', 'Clean dust'], correctAnswer: 2, points: 10, category: 'IT' },
      { id: 'g12sq11', text: 'Which theory in Economics states that "Supply creates its own demand"?', type: 'multiple-choice', options: ['Say\'s Law', 'Keynesian Theory', 'Malthusian Theory', 'Ricardian Theory'], correctAnswer: 0, points: 10, category: 'Economics' }
    ]
  },
  {
    id: 'exam-mock-g12-natural-science-subject',
    title: 'Grade 12 Natural Science Mastery Mock',
    courseCode: 'NS-G12-SUB',
    grade: Grade.G12,
    stream: Stream.NATURAL_SCIENCE,
    academicYear: CURRENT_YEAR,
    durationMinutes: 120,
    totalPoints: 100,
    status: 'published',
    type: 'mock-eaes',
    semester: 2,
    difficulty: 'Medium',
    subject: 'Natural Science Subjects',
    categories: ['Physics', 'Chemistry', 'Biology'],
    questions: [
      { id: 'g12nss1', text: 'Which particle is responsible for electricity conduction in metals?', type: 'multiple-choice', options: ['Protons', 'Neutrons', 'Electrons', 'Photons'], correctAnswer: 2, points: 10, category: 'Physics' },
      { id: 'g12nss2', text: 'What is the pH of pure water?', type: 'multiple-choice', options: ['0', '7', '14', '1'], correctAnswer: 1, points: 10, category: 'Chemistry' },
      { id: 'g12nss3', text: 'The DNA molecule is shaped like a:', type: 'multiple-choice', options: ['Single helix', 'Double helix', 'Sphere', 'Cube'], correctAnswer: 1, points: 10, category: 'Biology' }
    ]
  },
  {
    id: 'exam-mock-g12-social-science-subject',
    title: 'Grade 12 Social Science Mastery Mock',
    courseCode: 'SS-G12-SUB',
    grade: Grade.G12,
    stream: Stream.SOCIAL_SCIENCE,
    academicYear: CURRENT_YEAR,
    durationMinutes: 120,
    totalPoints: 100,
    status: 'published',
    type: 'mock-eaes',
    semester: 2,
    difficulty: 'Medium',
    subject: 'Social Science Subjects',
    categories: ['Geography', 'History', 'Economics'],
    questions: [
      { id: 'g12sss1', text: 'Which continent has the most countries?', type: 'multiple-choice', options: ['Asia', 'Europe', 'Africa', 'South America'], correctAnswer: 2, points: 10, category: 'Geography' },
      { id: 'g12sss2', text: 'Who wrote the Wealth of Nations?', type: 'multiple-choice', options: ['Karl Marx', 'Adam Smith', 'John Keynes', 'David Ricardo'], correctAnswer: 1, points: 10, category: 'Economics' }
    ]
  },
  {
    id: 'exam-mock-g12-biology',
    title: 'Grade 12 Biology National Mock',
    courseCode: 'BIO-G12-MOCK',
    grade: Grade.G12,
    stream: Stream.NATURAL_SCIENCE,
    academicYear: CURRENT_YEAR,
    durationMinutes: 90,
    totalPoints: 100,
    status: 'published',
    type: 'mock-eaes',
    semester: 2,
    difficulty: 'Medium',
    subject: 'Biology',
    categories: ['Genetics', 'Evolution', 'Ecology', 'Human Biology'],
    questions: [
      { id: 'g12bq1', text: 'Which of the following is responsible for the synthesis of proteins?', type: 'multiple-choice', options: ['Ribosome', 'Golgi complex', 'Lysosome', 'Smooth ER'], correctAnswer: 0, points: 10, category: 'Cell Biology' },
      { id: 'g12bq2', text: 'The theory of natural selection was proposed by:', type: 'multiple-choice', options: ['Lamarck', 'Watson', 'Darwin', 'Mendel'], correctAnswer: 2, points: 10, category: 'Evolution' },
      { id: 'g12bq3', text: 'What is the phenotypic ratio of a dihybrid cross?', type: 'multiple-choice', options: ['3:1', '9:3:3:1', '1:2:1', '1:1:1:1'], correctAnswer: 1, points: 10, category: 'Genetics' },
      { id: 'g12bq4', text: 'Which hormone is produced in response to low blood sugar?', type: 'multiple-choice', options: ['Insulin', 'Glucagon', 'Adrenaline', 'Thyroxine'], correctAnswer: 1, points: 10, category: 'Human Biology' }
    ]
  },
  {
    id: 'exam-mock-g12-history',
    title: 'Grade 12 History National Mock',
    courseCode: 'HIST-G12-MOCK',
    grade: Grade.G12,
    stream: Stream.SOCIAL_SCIENCE,
    academicYear: CURRENT_YEAR,
    durationMinutes: 90,
    totalPoints: 100,
    status: 'published',
    type: 'mock-eaes',
    semester: 2,
    difficulty: 'Medium',
    subject: 'History',
    categories: ['Ancient History', 'Modern World', 'African History'],
    questions: [
      { id: 'g12hq1', text: 'The French Revolution began in:', type: 'multiple-choice', options: ['1789', '1889', '1776', '1804'], correctAnswer: 0, points: 10, category: 'Modern World' },
      { id: 'g12hq2', text: 'Who was the last emperor of Ethiopia?', type: 'multiple-choice', options: ['Menelik II', 'Haile Selassie I', 'Tewodros II', 'Yohannes IV'], correctAnswer: 1, points: 10, category: 'African History' },
      { id: 'g12hq3', text: 'The industrial revolution first started in:', type: 'multiple-choice', options: ['USA', 'France', 'Great Britain', 'Germany'], correctAnswer: 2, points: 10, category: 'Modern World' }
    ]
  },
  {
    id: 'exam-national-physics-9-11',
    title: 'National Baseline Mastery: Grade 9-11 Physics',
    courseCode: 'PHYS-G11-C',
    grade: Grade.G11,
    stream: Stream.NATURAL_SCIENCE,
    academicYear: CURRENT_YEAR,
    durationMinutes: 90,
    totalPoints: 100,
    status: 'published',
    type: 'National',
    semester: 1,
    subject: 'Physics',
    difficulty: 'Medium',
    description: 'A comprehensive assessment covering foundational physics concepts from Grade 9 to 11, focusing on mechanics, heat, and electricity.',
    questions: [
      { id: 'p-q1', text: 'A car accelerates from rest at a constant rate of 4 m/s² for 5 seconds. What is its final velocity?', type: 'multiple-choice', options: ['10 m/s', '20 m/s', '25 m/s', '40 m/s'], correctAnswer: 1, points: 10, category: 'Mechanics' },
      { id: 'p-q2', text: "Newton's Second Law of Motion states that force is equal to the product of mass and:", type: 'multiple-choice', options: ['Velocity', 'Displacement', 'Acceleration', 'Momentum'], correctAnswer: 2, points: 5, category: 'Mechanics' },
      { id: 'p-q3', text: 'The energy an object possesses due to its motion is called:', type: 'multiple-choice', options: ['Potential Energy', 'Chemical Energy', 'Thermal Energy', 'Kinetic Energy'], correctAnswer: 3, points: 5, category: 'Energy' },
      { id: 'p-q4', text: 'Which of the following is a vector quantity?', type: 'multiple-choice', options: ['Speed', 'Distance', 'Mass', 'Force'], correctAnswer: 3, points: 5, category: 'Mechanics' },
      { id: 'p-q5', text: 'The transfer of heat through a vacuum is known as:', type: 'multiple-choice', options: ['Conduction', 'Convection', 'Radiation', 'Insulation'], correctAnswer: 2, points: 5, category: 'Thermodynamics' },
      { id: 'p-q6', text: 'A resistor of 10 Ohms is connected to a 12V battery. What is the current flowing through it?', type: 'multiple-choice', options: ['1.2 A', '120 A', '0.83 A', '2 A'], correctAnswer: 0, points: 10, category: 'Electricity' },
      { id: 'p-q7', text: 'The SI unit of power is the:', type: 'multiple-choice', options: ['Joule', 'Newton', 'Watt', 'Volt'], correctAnswer: 2, points: 5, category: 'Energy' },
      { id: 'p-q8', text: "According to Pascal's Principle, pressure applied to an enclosed fluid is:", type: 'multiple-choice', options: ['Decreased with depth', 'Transmitted undiminished', 'Only vertical', 'Dependent on shape'], correctAnswer: 1, points: 10, category: 'Fluids' },
      { id: 'p-q9', text: 'Which type of lens can form both real and virtual images?', type: 'multiple-choice', options: ['Concave lens', 'Convex lens', 'Planar lens', 'Bifocal lens'], correctAnswer: 1, points: 10, category: 'Optics' },
      { id: 'p-q10', text: 'The pitch of a sound wave depends primarily on its:', type: 'multiple-choice', options: ['Amplitude', 'Velocity', 'Phase', 'Frequency'], correctAnswer: 3, points: 5, category: 'Waves' },
      { id: 'p-q11', text: 'The rate of change of momentum of an object is proportional to the applied ____.', type: 'fill-in-the-blank', options: [], correctAnswer: 'force', points: 5, category: 'Mechanics' },
      { id: 'p-q12', text: 'The device used to measure electric current is the ____.', type: 'fill-in-the-blank', options: [], correctAnswer: 'ammeter', points: 5, category: 'Electricity' },
      { id: 'p-q13', text: 'The process of heat transfer through direct contact of particles is called ____.', type: 'fill-in-the-blank', options: [], correctAnswer: 'conduction', points: 10, category: 'Thermodynamics' },
      { id: 'p-q14', text: 'In a series circuit, the ____ remains the same through all components.', type: 'fill-in-the-blank', options: [], correctAnswer: 'current', points: 10, category: 'Electricity' },
      { id: 'p-q15', text: 'The work done per unit charge is defined as electric ____.', type: 'fill-in-the-blank', options: [], correctAnswer: 'potential', points: 5, category: 'Electricity' }
    ]
  },
  {
    id: 'exam-national-chemistry-9-12',
    title: 'National Baseline Mastery: Grade 9-12 Chemistry',
    courseCode: 'CHEMS-9,10,11,12',
    grade: Grade.G12,
    stream: Stream.NATURAL_SCIENCE,
    academicYear: CURRENT_YEAR,
    durationMinutes: 120,
    totalPoints: 100,
    status: 'published',
    type: 'National',
    semester: 2,
    subject: 'Chemistry',
    difficulty: 'Medium',
    description: 'An essential benchmark exam covering atomic structure, stoichiometry, and organic chemistry for high school graduation readiness.',
    questions: [
      { id: 'c-q1', text: 'An element has 11 protons and 12 neutrons. What is its mass number?', type: 'multiple-choice', options: ['11', '12', '23', '1'], correctAnswer: 2, points: 5, category: 'Atomic Structure' },
      { id: 'c-q2', text: 'Which of the following elements has the highest electronegativity?', type: 'multiple-choice', options: ['Sodium', 'Chlorine', 'Fluorine', 'Oxygen'], correctAnswer: 2, points: 5, category: 'Periodic Table' },
      { id: 'c-q3', text: 'What type of bond is formed when electrons are shared between two atoms?', type: 'multiple-choice', options: ['Ionic Bond', 'Covalent Bond', 'Metallic Bond', 'Hydrogen Bond'], correctAnswer: 1, points: 5, category: 'Chemical Bonding' },
      { id: 'c-q4', text: 'How many moles are in 36 grams of Water (H₂O)? (Atomic weights: H=1, O=16)', type: 'multiple-choice', options: ['1 mole', '2 moles', '1.5 moles', '3 moles'], correctAnswer: 1, points: 10, category: 'Stoichiometry' },
      { id: 'c-q5', text: 'A solution with a pH of 3 is considered:', type: 'multiple-choice', options: ['Neutral', 'Weakly Basic', 'Strongly Acidic', 'Weakly Acidic'], correctAnswer: 2, points: 5, category: 'Acids and Bases' },
      { id: 'c-q6', text: 'In a redox reaction, oxidation is defined as the ____ of electrons.', type: 'multiple-choice', options: ['Loss', 'Gain', 'Sharing', 'Neutron loss'], correctAnswer: 0, points: 10, category: 'Redox' },
      { id: 'c-q7', text: 'Which functional group is characteristic of carboxylic acids?', type: 'multiple-choice', options: ['-OH', '-CHO', '-COOH', '-CO-'], correctAnswer: 2, points: 10, category: 'Organic Chemistry' },
      { id: 'c-q8', text: 'Which of the following increases the rate of a chemical reaction?', type: 'multiple-choice', options: ['Lowering temperature', 'Decreasing pressure', 'Adding a catalyst', 'Increasing particle size'], correctAnswer: 2, points: 5, category: 'Kinetics' },
      { id: 'c-q9', text: 'The simplest member of the Alkyne family is:', type: 'multiple-choice', options: ['Methane', 'Ethane', 'Ethene', 'Ethyne'], correctAnswer: 3, points: 10, category: 'Organic Chemistry' },
      { id: 'c-q10', text: "According to Le Chatelier's Principle, adding more reactant to a system at equilibrium will shift it to the:", type: 'multiple-choice', options: ['Left', 'Right', 'No shift', 'Center'], correctAnswer: 1, points: 10, category: 'Equilibrium' },
      { id: 'c-q11', text: 'The subatomic particle that determines the identity of an element is the ____.', type: 'fill-in-the-blank', options: [], correctAnswer: 'proton', points: 5, category: 'Atomic Structure' },
      { id: 'c-q12', text: 'The chemical symbol for the element Potassium is ____.', type: 'fill-in-the-blank', options: [], correctAnswer: 'K', points: 5, category: 'Periodic Table' },
      { id: 'c-q13', text: 'Methane (CH4) is a member of the ____ family of hydrocarbons.', type: 'fill-in-the-blank', options: [], correctAnswer: 'alkane', points: 10, category: 'Organic Chemistry' },
      { id: 'c-q14', text: 'A substance that donates a pair of electrons is called a ____ base.', type: 'fill-in-the-blank', options: [], correctAnswer: 'Lewis', points: 10, category: 'Acids and Bases' },
      { id: 'c-q15', text: "Avogadro's number is approximately 6.022 x 10^____.", type: 'fill-in-the-blank', options: [], correctAnswer: '23', points: 5, category: 'Stoichiometry' }
    ]
  },
  {
    id: 'exam-mock-tvet-l1',
    title: 'TVET Level 1 Technical Mock',
    courseCode: 'TVET-L1-MOCK',
    grade: Grade.TVET_LEVEL_1,
    stream: Stream.GENERAL,
    academicYear: CURRENT_YEAR,
    durationMinutes: 60,
    totalPoints: 100,
    status: 'published',
    type: 'tvet-exit',
    semester: 1,
    difficulty: 'Medium',
    subject: 'Technical Foundation',
    categories: ['HRMS', 'Technical Drawing', 'Accounting', 'IT'],
    questions: [
      { id: 'tl1q1', text: 'In HRMS, what does HR stand for?', type: 'multiple-choice', options: ['High Resource', 'Human Resource', 'Hardware Repair', 'Help Registry'], correctAnswer: 1, points: 10, category: 'HRMS' },
      { id: 'tl1q2', text: 'Which tool is essential for drawing a straight line?', type: 'multiple-choice', options: ['Compass', 'Protractor', 'Ruler', 'Eraser'], correctAnswer: 2, points: 10, category: 'Technical Drawing' },
      { id: 'tl1q3', text: 'Accounting: "Assets = Liabilities + ____"', type: 'multiple-choice', options: ['Income', 'Equity', 'Expense', 'Cash'], correctAnswer: 1, points: 10, category: 'Accounting' },
      { id: 'tl1q4', text: 'Which device is used for typing?', type: 'multiple-choice', options: ['Mouse', 'Printer', 'Keyboard', 'Webcam'], correctAnswer: 2, points: 10, category: 'IT' },
      { id: 'tl1q5', text: 'Drawing: What type of line is used for hidden edges?', type: 'multiple-choice', options: ['Solid', 'Dashed', 'Thick', 'Zigzag'], correctAnswer: 1, points: 10, category: 'Technical Drawing' },
      { id: 'tl1q6', text: 'What is the primary goal of HRM?', type: 'multiple-choice', options: ['Selling products', 'Managing people', 'Repairing machines', 'Coding'], correctAnswer: 1, points: 10, category: 'HRMS' },
      { id: 'tl1q7', text: 'Accounting: A ledger is used to:', type: 'multiple-choice', options: ['Draw plans', 'Record transactions', 'Send emails', 'Play games'], correctAnswer: 1, points: 10, category: 'Accounting' },
      { id: 'tl1q8', text: 'What does PC stand for?', type: 'multiple-choice', options: ['Private Call', 'Personal Computer', 'Professional Core', 'Processing Center'], correctAnswer: 1, points: 10, category: 'IT' },
      { id: 'tl1q9', text: 'Which scale is 1:1?', type: 'multiple-choice', options: ['Enlargement', 'Reduction', 'Full Scale', 'Half Scale'], correctAnswer: 2, points: 10, category: 'Technical Drawing' },
      { id: 'tl1q10', text: 'What software is used for spreadsheets?', type: 'multiple-choice', options: ['Chrome', 'Word', 'Excel', 'VLC'], correctAnswer: 2, points: 10, category: 'IT' }
    ]
  },
  {
    id: 'exam-mock-tvet-l4',
    title: 'TVET Level 4 Advanced Professional Mock',
    courseCode: 'TVET-L4-MOCK',
    grade: Grade.TVET_LEVEL_4,
    stream: Stream.GENERAL,
    academicYear: CURRENT_YEAR,
    durationMinutes: 90,
    totalPoints: 100,
    status: 'published',
    type: 'tvet-exit',
    semester: 1,
    difficulty: 'Hard',
    subject: 'Professional Leadership',
    categories: ['HRMS', 'Design Drawing', 'Management Accounting', 'Advanced IT'],
    questions: [
      { id: 'tl4q1', text: 'Strategic HRM focuses on:', type: 'multiple-choice', options: ['Payroll only', 'Long-term goals', 'Hiring daily', 'Cleaning office'], correctAnswer: 1, points: 10, category: 'HRMS' },
      { id: 'tl4q2', text: 'In CAD, what does it stand for?', type: 'multiple-choice', options: ['Computer Aided Design', 'Common Auto Design', 'Call And Draw', 'Construct All data'], correctAnswer: 0, points: 10, category: 'Design Drawing' },
      { id: 'tl4q3', text: 'What is a Balance Sheet used for?', type: 'multiple-choice', options: ['Profit projection', 'Financial position', 'Daily sales', 'Staff attendance'], correctAnswer: 1, points: 10, category: 'Management Accounting' },
      { id: 'tl4q4', text: 'Which concept is vital for Cloud Computing?', type: 'multiple-choice', options: ['Virtualization', 'Hardware upgrade', 'Physical cables', 'Dial-up'], correctAnswer: 0, points: 10, category: 'Advanced IT' },
      { id: 'tl4q5', text: 'HRMS: Performance Appraisal is for:', type: 'multiple-choice', options: ['Firing people', 'Evaluating work', 'Taking photos', 'Buying lunch'], correctAnswer: 1, points: 10, category: 'HRMS' },
      { id: 'tl4q6', text: 'In 3D modeling, "Extrude" means:', type: 'multiple-choice', options: ['Delete', 'Flatten', 'Add thickness', 'Rotate'], correctAnswer: 2, points: 10, category: 'Design Drawing' },
      { id: 'tl4q7', text: 'GAAP stands for:', type: 'multiple-choice', options: ['General Accounting and Audit', 'Generally Accepted Accounting Principles', 'Global Account Access Port', 'Government Audit and Policy'], correctAnswer: 1, points: 10, category: 'Management Accounting' },
      { id: 'tl4q8', text: 'What is Big Data characterized by?', type: 'multiple-choice', options: ['Small size', 'High Variety/Volume', 'Low speed', 'Paper storage'], correctAnswer: 1, points: 10, category: 'Advanced IT' },
      { id: 'tl4q9', text: 'Conflict resolution is a skill for:', type: 'multiple-choice', options: ['Accountants only', 'Engineers only', 'Managers/Leaders', 'IT Techs'], correctAnswer: 2, points: 10, category: 'HRMS' },
      { id: 'tl4q10', text: 'What is a relational database?', type: 'multiple-choice', options: ['A music folder', 'Data stored in tables', 'A text file', 'A single image'], correctAnswer: 1, points: 10, category: 'Advanced IT' }
    ]
  }
];

export const MOCK_NEWS = [
  { id: 'n1', date: `Feb 22, ${CURRENT_YEAR}`, tag: 'Infrastructure', title: 'IFTU National Server Cluster Upgraded', summary: 'Improved latency for remote proctoring.', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=600', content: 'The upgrade ensures stable connections for students in all regions.' },
  { 
    id: 'n2', 
    date: `March 1, ${CURRENT_YEAR}`, 
    tag: 'Exams', 
    title: `${CURRENT_YEAR} Ethiopian National Exam Registration Schedule`, 
    summary: 'Official registration dates for regular and private candidates have been announced.', 
    content: `The Ethiopian Educational Assessment and Examinations Service (EAES) has officially announced the registration schedule for the ${CURRENT_YEAR} National Examinations.\n\n• Regular Registration: Starts March 20, ${CURRENT_YEAR} and ends April 15, ${CURRENT_YEAR}.\n• Private Candidate Registration: Starts April 1, ${CURRENT_YEAR} and ends April 30, ${CURRENT_YEAR}.\n\nAll candidates must complete their registration through the official portal before the strict deadlines. Late registrations will not be accepted under any circumstances.`, 
    image: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&q=80&w=600' 
  }
];

export const SUMMER_STATS = [
  { label: 'ACTIVE LEARNERS', value: '450K+', color: '#3b82f6', icon: <Users size={48} /> },
  { label: 'MODULES COMPLETED', value: '1.2M', color: '#009b44', icon: <CheckSquare size={48} /> },
  { label: 'SYSTEM UPTIME', value: '99.9%', color: '#ffcd00', icon: <Zap size={48} /> },
  { label: 'EXAM INTEGRITY', value: '100%', color: '#ef3340', icon: <Shield size={48} /> }
];

export const SUMMER_ACTIVITIES = [
  { title: 'STEM Innovation Fair', date: 'August 15', desc: 'National exhibition of student projects.', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600', tag: 'Innovation' },
  { title: 'Digital Bootcamps', date: 'July - Aug', desc: 'Coding and engineering for TVET.', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600', tag: 'Skills' }
];

export const MOCK_EXAM_RESULTS: any[] = [
  {
    id: 'res-1',
    studentId: 'std-demo',
    examId: 'exam-mock-g11-natural',
    score: 85,
    totalPoints: 110,
    answers: {},
    completedAt: '2025-01-10T10:00:00Z',
    timeSpentSeconds: 3600
  },
  {
    id: 'res-2',
    studentId: 'std-demo',
    examId: 'exam-mock-g11-natural',
    score: 95,
    totalPoints: 110,
    answers: {},
    completedAt: '2025-02-15T14:00:00Z',
    timeSpentSeconds: 3400
  },
  {
    id: 'res-3',
    studentId: 'std-demo',
    examId: 'exam-mock-g12-natural',
    score: 105,
    totalPoints: 110,
    answers: {},
    completedAt: '2025-03-25T09:30:00Z',
    timeSpentSeconds: 3200
  },
  {
    id: 'res-4',
    studentId: 'std-demo',
    examId: 'exam-mock-g12-natural',
    score: 110,
    totalPoints: 110,
    answers: {},
    completedAt: '2026-04-20T11:00:00Z',
    timeSpentSeconds: 3100
  }
];

export const ACADEMIC_SUBJECTS: Record<string, string[]> = {
  // Grade 9 & 10: General Stream
  'Grade 9-General': ['English', 'Afaan Oromoo', 'Amharic', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'IT', 'HPE', 'History', 'Geography', 'Economics', 'Citizenship'],
  'Grade 10-General': ['English', 'Afaan Oromoo', 'Amharic', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'IT', 'HPE', 'History', 'Geography', 'Economics', 'Citizenship'],
  
  // Grade 11 & 12: Natural Science
  'Grade 11-Natural Science': ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'IT', 'HPE', 'Agriculture', 'Design and Drawing'],
  'Grade 12-Natural Science': ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'IT', 'HPE', 'Agriculture', 'Design and Drawing'],
  
  // Grade 11 & 12: Social Science
  'Grade 11-Social Science': ['Mathematics', 'English', 'Afaan Oromoo', 'IT', 'History', 'Geography', 'Economics', 'Accounting', 'HPE'],
  'Grade 12-Social Science': ['Mathematics', 'English', 'Afaan Oromoo', 'IT', 'History', 'Geography', 'Economics', 'Accounting', 'HPE'],
  
  // Teaching College / TVET
  'TVET Level 1-General': ['Communication', 'Basics of Computing', 'Mathematics', 'English', 'Occupational Safety'],
  'TVET Level 2-General': ['Communication', 'Basics of Computing', 'Mathematics', 'English', 'Occupational Safety'],
  'TVET Level 3-General': ['Customer Service', 'Information Systems', 'English', 'Professional Ethics'],
  'TVET Level 4-General': ['Management', 'Strategy', 'English', 'Advanced Ethics'],
};

export const EAES_SUBJECT_COUNTS: Record<string, number> = {
  'English': 60,
  'Mathematics (Natural)': 60,
  'Mathematics (Social)': 60,
  'Physics': 60,
  'Chemistry': 60,
  'Biology': 60,
  'History': 60,
  'Geography': 60,
  'Economics': 60,
  'Aptitude': 60
};

export const EAES_NATURAL_SUBJECTS = ['English', 'Mathematics (Natural)', 'Chemistry', 'Physics', 'Biology', 'Aptitude'];
export const EAES_SOCIAL_SUBJECTS = ['English', 'Mathematics (Social)', 'History', 'Geography', 'Economics', 'Aptitude'];

export const getSubjectsBySelection = (grade: Grade, stream: Stream) => {
  const key = `${grade}-${stream}`;
  return ACADEMIC_SUBJECTS[key] || ['General Education', 'Pedagogy', 'Special Foundations'];
};
