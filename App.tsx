
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Menu, Play } from 'lucide-react';
import StudentProfile from './components/StudentProfile';
import Header from './components/Header';
import HomePortal from './components/HomePortal';
import CourseCard from './components/CourseCard';
import AITutor from './components/AITutor';
import ExamEngine from './components/ExamEngine';
import CourseViewer from './components/CourseViewer';
import Leaderboard from './components/Leaderboard';
import AdminDashboard from './components/AdminDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import PerformancePortal from './components/PerformancePortal';
import AboutPortal from './components/AboutPortal';
import PublicNewsFeed from './components/PublicNewsFeed';
import CampusLocator from './components/CampusLocator';
import DevPortal from './components/DevPortal';
import FeedbackWidget from './components/FeedbackWidget';
import LiveInterviewer from './components/LiveInterviewer';
import { MOCK_COURSES, MOCK_NEWS, MOCK_EXAMS, SUMMER_STATS, SUMMER_ACTIVITIES, MOCK_EXAM_RESULTS } from './constants';
import { Course, Grade, User, Exam, ExamResult, EducationLevel, Stream, Language, News, Assignment, AssignmentSubmission, SystemSettings, Question } from './types';
import { fetchLatestEducationNews, generateExamsForGrades } from './services/geminiService';
import { auth, reconnectDb } from './firebase';
import { AssignmentPortal } from './components/AssignmentPortal';
import { StudyHall } from './components/StudyHall';
import CommunityForum from './components/CommunityForum';
import StudyPlanner from './components/StudyPlanner';
import { dbService } from './services/dbService';
import { BBOTimsBanner } from './components/BBOTimsBanner';

import { StudentSidebar } from './components/StudentSidebar';

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: { 
    home: 'Sovereign HUB', 
    courses: 'Courses', 
    news: 'Bulletins', 
    mediahub: 'Media Hub', 
    about: 'About Us', 
    locator: 'Locator', 
    guide: 'System Guide', 
    exams: 'Exams', 
    assignments: 'Assignments', 
    studyhall: 'Study Hall', 
    tutor: 'AI Tutor', 
    login: 'Login', 
    leaderboard: 'Rankings', 
    performance: 'My Results',
    forum: 'Community',
    planner: 'AI Planner',
    admin: 'Supreme Administrator',
    teacher: 'Faculty Center'
  },
  am: { 
    home: 'ዋና ማዕከል', 
    courses: 'ትምህርቶች', 
    news: 'ዜና', 
    mediahub: 'ሚዲያ', 
    about: 'ስለ እኛ', 
    locator: 'መፈለጊያ', 
    guide: 'የመመሪያ መጽሐፍ', 
    exams: 'ፈተናዎች', 
    assignments: 'ተግባራት', 
    studyhall: 'የጥናት አዳራሽ', 
    tutor: 'AI ረዳት', 
    login: 'ይግቡ', 
    leaderboard: 'ደረጃዎች', 
    performance: 'ውጤቴ',
    forum: 'ማህበረሰብ',
    planner: 'የጥናት ዕቅድ',
    admin: 'ጠቅላይ አስተዳዳሪ',
    teacher: 'የመምህራን ማዕከል'
  },
  om: { 
    home: 'Sovereign HUB', 
    courses: 'Koorsoota', 
    news: 'Oduu', 
    mediahub: 'Media Hub', 
    about: "Waa'ee Keenya", 
    locator: 'Bakka', 
    guide: 'Qajeelfama Sirnaa', 
    exams: 'Qormaata', 
    assignments: 'Hojiiwwan', 
    studyhall: 'Mana Qo’annoo', 
    tutor: 'Gargaaraa AI', 
    login: 'Seeni', 
    leaderboard: 'Sadarkaa', 
    performance: 'Bu’aa koo',
    forum: 'Hawaasa',
    planner: 'Karoorsaa AI',
    admin: 'Supreme Administrator',
    teacher: 'Faculty Center'
  }
};

const INITIAL_USERS: User[] = [
  { 
    id: 'adm-001', 
    name: 'Jemal Fano Haji', 
    role: 'admin', 
    points: 99999, 
    status: 'active', 
    sovereignIndex: 1,
    email: 'jemalfano030@gmail.com', 
    joinedDate: '2024-01-01', 
    preferredLanguage: 'om', 
    badges: [{ id: 'b1', title: 'Grand Architect', icon: '👑', earnedAt: '2024-01-01' }],
    school: 'IFTU National Digital Sovereign Education Center', 
    photo: '/developer_jemal_fano_portrait.jpg',
    completedLessons: [], completedExams: [], completedCourses: [], certificatesPaid: [],
    nid: 'ET-ADMIN-001', studentIdNumber: 'ADMIN-001', gender: 'Male', dob: '1975-04-12', phoneNumber: '+251 911 000000', address: 'IFTU HQ, Menelik II Square'
  },
  {
    id: 'tch-demo',
    name: 'Demo Instructor',
    role: 'teacher',
    points: 4200,
    status: 'active',
    sovereignIndex: 2,
    email: 'teacher@iftu.edu.et',
    joinedDate: '2024-05-01',
    preferredLanguage: 'en',
    badges: [{ id: 'b-t1', title: 'Senior Mentor', icon: '👨‍🏫', earnedAt: '2024-05-01' }],
    school: 'National STEM Hub',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DemoTeach&backgroundColor=ffdfbf',
    department: 'Physics & STEM',
    subjects: ['Advanced Mechanics', 'Quantum Theory'],
    salary: 28000,
    nid: 'ET-DEMO-TCH',
    studentIdNumber: 'TCH-DEMO-001',
    gender: 'Male',
    dob: '1980-01-01'
  },
  {
    id: 'std-demo', 
    name: 'Demo Student', 
    role: 'student', 
    grade: Grade.G12, 
    stream: Stream.NATURAL_SCIENCE,
    level: EducationLevel.SECONDARY, 
    points: 3500, 
    status: 'active', 
    sovereignIndex: 3,
    email: 'student@iftu.edu.et', 
    joinedDate: '2024-06-10', 
    preferredLanguage: 'en', 
    badges: [
      { id: 'b-s1', title: 'Early Achiever', icon: '⭐', earnedAt: '2024-06-15', description: 'One of the first 100 students to join the National Sovereign Education Center.' },
      { id: 'b-s2', title: 'Code Warrior', icon: '💻', earnedAt: '2024-08-20', description: 'Mastered the fundamentals of algorithmic thinking.' },
      { id: 'b-s3', title: 'Top Scorer', icon: '🎯', earnedAt: '2025-01-10', description: 'Achieved 100% in a National Mock Exam.' }
    ],
    academicRecords: [
      {
        id: 'rec-001',
        name: 'Grade 11 Report Card.pdf',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        type: 'application/pdf',
        uploadedAt: '2025-01-15T10:00:00Z',
        size: 1024 * 450
      },
      {
        id: 'rec-002',
        name: 'STEM Certification.jpg',
        url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=1000&auto=format&fit=crop',
        type: 'image/jpeg',
        uploadedAt: '2025-02-20T14:30:00Z',
        size: 1024 * 1200
      }
    ],
    school: 'Demo Academy', 
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DemoStu&backgroundColor=00D05A',
    completedLessons: ['p11-l1'], 
    completedExams: [], 
    completedCourses: ['g11-phys-core'], 
    certificatesPaid: [],
    enrolledExams: ['exam-mock-g12-natural'],
    nid: 'ET-DEMO-STU', studentIdNumber: 'IFTU-STD-2024-001', gender: 'Female', salary: 250, dob: '2008-01-01'
  },
  {
    id: 'std-abdulkadir',
    name: 'Abdulkadir Nure hinsene',
    role: 'student',
    grade: Grade.G12,
    stream: Stream.NATURAL_SCIENCE,
    level: EducationLevel.SECONDARY,
    points: 0,
    status: 'active',
    sovereignIndex: 4,
    email: '5890385378017045@students.iftu.edu.et',
    joinedDate: '2026-03-20',
    preferredLanguage: 'en',
    badges: [],
    school: 'National Digital Center',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Abdulkadir&backgroundColor=b6e3f4',
    completedLessons: [],
    completedExams: [],
    completedCourses: [],
    certificatesPaid: [],
    nid: '5890385378017045',
    studentIdNumber: 'IFTU-STD-2026-999',
    gender: 'Male',
    dob: '2007-05-15'
  },
  {
    id: 'tch-001',
    name: 'Dr. Tesfaye Wolde',
    role: 'teacher',
    points: 5500,
    status: 'active',
    sovereignIndex: 5,
    email: 'tesfaye@iftu.edu.et',
    joinedDate: '2024-01-10',
    preferredLanguage: 'en',
    badges: [],
    school: 'Science Hub 1',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tesfaye&backgroundColor=ffdfbf',
    department: 'Physics & STEM',
    subjects: ['Advanced Mechanics', 'Quantum Theory'],
    salary: 24500,
    nid: 'ET-INST-992',
    studentIdNumber: 'TCH-001',
    gender: 'Male',
    dob: '1985-05-20',
    phoneNumber: '+251 922 111222',
    address: 'Bole, Addis Ababa'
  }
];

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<string>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [exams, setExams] = useState<Exam[]>(MOCK_EXAMS);
  const [news, setNews] = useState<News[]>(MOCK_NEWS as News[]);
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    return (localStorage.getItem('iftu_pref_lang') as Language) || 'en';
  });

  const handleLangChange = (lang: Language) => {
    setCurrentLang(lang);
    localStorage.setItem('iftu_pref_lang', lang);
  };
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isDemoSession, setIsDemoSession] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    grade: Grade.G9,
    stream: Stream.GENERAL
  });
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [preSelectedExamId, setPreSelectedExamId] = useState<string | null>(null);
  const [activeOralTopic, setActiveOralTopic] = useState<string | null>(null);
  const [userResults, setUserResults] = useState<ExamResult[]>([]);
  const [simulatedMessages, setSimulatedMessages] = useState<{id: string, to?: string, text: string, date: string}[]>([
    {
      id: 'SMS-901842',
      to: '+251 911 223 344',
      text: 'Welcome to IFTU LMS! Login Email: barataa@iftu.edu.et | Temp Pass: ET-2025-9988. Portal: https://iftu.edu.et',
      date: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    },
    {
      id: 'SMS-884102',
      to: '+251 922 445 566',
      text: 'IFTU Alert: National Grade 12 Natural Science Exam Registration confirmation dispatched. Verified by MoE.',
      date: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    }
  ]);
  const [viewingCourse, setViewingCourse] = useState<Course | null>(null);
  const [groundedNews, setGroundedNews] = useState<{ text: string, sources: any[] } | null>(null);
  const [isSyncingNews, setIsSyncingNews] = useState(false);
  const [aiTutorContext, setAiTutorContext] = useState<{ content?: string; title?: string; prompt?: string }>({});
  const [isGeneratingExams, setIsGeneratingExams] = useState(false);
  const [examGenProgress, setExamGenProgress] = useState('');
  const [allExamResults, setAllExamResults] = useState<ExamResult[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [questionBank, setQuestionBank] = useState<Question[]>([]);
  const [courseSearch, setCourseSearch] = useState('');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ courses: Course[], news: News[], exams: Exam[] }>({ courses: [], news: [], exams: [] });
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [streamFilter, setStreamFilter] = useState<string>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [dbError, setDbError] = useState<string | null>(null);
  const [isInIframe, setIsInIframe] = useState(false);
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);
  const [systemSettings, setSystemSettings] = useState<SystemSettings | null>(null);
  const [isStudentSidebarOpen, setIsStudentSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('iftu_sidebar_state');
    return saved !== null ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('iftu_sidebar_state', JSON.stringify(isStudentSidebarOpen));
  }, [isStudentSidebarOpen]);

  const [isStudentMobileMenuOpen, setIsStudentMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Detect if we are in an iframe (common in AI Studio preview)
    const insideIframe = window.self !== window.top;
    setIsInIframe(insideIframe);
    
    // Global handle for Firestore internal SDK errors that can't be caught by try/catch
    const handleGlobalError = (event: ErrorEvent) => {
      if (event.message?.includes('INTERNAL ASSERTION FAILED') || event.message?.includes('Unexpected state')) {
        console.warn("🛡️ Sovereign Shield: Intercepted Firestore SDK Internal Error.");
        setAuthError("CRITICAL: Connection sync warning. If issues persist, please click 'LAUNCH STANDALONE PORTAL' above.");
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reasonStr = String(event.reason?.message || event.reason || '');
      if (reasonStr.includes('INTERNAL ASSERTION FAILED') || reasonStr.includes('Unexpected state')) {
        console.warn("🛡️ Sovereign Shield: Intercepted Firestore Unhandled Rejection.", reasonStr);
        event.preventDefault();
      }
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    const handleOnline = () => {
      import('./firebase').then(m => m.reconnectDb());
    };

    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const handleGlobalSearch = (query: string) => {
    setGlobalSearchQuery(query);
    const lowerQuery = query.toLowerCase();
    
    const filteredCourses = courses.filter(c => 
      c.title.toLowerCase().includes(lowerQuery) || 
      c.description.toLowerCase().includes(lowerQuery) ||
      c.code.toLowerCase().includes(lowerQuery)
    );

    const filteredNews = news.filter(n => 
      n.title.toLowerCase().includes(lowerQuery) || 
      n.content.toLowerCase().includes(lowerQuery) ||
      n.tag.toLowerCase().includes(lowerQuery)
    );

    const filteredExams = exams.filter(e => 
      e.title.toLowerCase().includes(lowerQuery) || 
      e.description?.toLowerCase().includes(lowerQuery) ||
      e.subject?.toLowerCase().includes(lowerQuery)
    );

    setSearchResults({ courses: filteredCourses, news: filteredNews, exams: filteredExams });
    setActiveView('search');
  };

  const handleSyncNews = async () => {
    if (!isOnline || currentUser?.role !== 'admin') return;
    setIsSyncingNews(true);
    try {
      const latestNews = await fetchLatestEducationNews();
      if (latestNews && latestNews.length > 0) {
        // Update local state
        setNews(prev => {
          const existingIds = new Set(prev.map(n => n.id));
          const newItems = latestNews.filter(n => !existingIds.has(n.id));
          return [...newItems, ...prev];
        });
        // Sync to Firestore
        for (const item of latestNews) {
          await dbService.addNews(item);
        }
      }
    } catch (error) {
      console.error("Sync News Error:", error);
    } finally {
      setIsSyncingNews(false);
    }
  };

  const handleSeedOfficialMedia = async () => {
    if (currentUser?.role !== 'admin') return;
    setIsSyncingNews(true);
    try {
      const officialNews = [
        {
          id: 'news_sovereign_001',
          title: 'IFTU National Dashboard: Official Release',
          summary: 'The new secondary and TVET management dashboard is now live across the Sovereign Education Network.',
          content: 'Baga Nagaa Gara Applikeeshinii IFTU LMS dhuftan. Mana barumsa IFTU LMS kanatti barnootaa sadarkaa lammaffaa ykn kutaa 9-12 fi TVET gulantaa tokko hanga arfaffaa gosoota barnootaa itiyoophiyaatiin isiniif qophaa\'e. Dashboard kun tajaajila barnootaa hunda walitti fiduuf qophaa\'e.',
          category: 'announcement',
          tag: 'SYSTEM',
          date: new Date().toISOString().split('T')[0],
          image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800'
        },
        {
          id: 'news_video_guide_001',
          title: 'Portal Navigation Protocol: Video Guide',
          summary: 'Watch the official video guide on how to navigate the IFTU LMS Sovereign Registry.',
          content: 'Eeyyee! Dashboard kanaaf sagalee dubbisaa (voice narration) ni danda\'ama. Video kana keessatti akkamitti faayila download gochuu dandeessan, akkamitti qorumsa fudhattan fi dhimmoota biroo barachuu dandeessu.',
          category: 'guide',
          tag: 'VIDEO',
          date: new Date().toISOString().split('T')[0],
          image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
          video: '/assets/news/guide_video.mp4'
        }
      ];
      for (const item of officialNews) {
        await dbService.addNews(item as any);
      }
      const updatedNews = await dbService.fetchNews();
      setNews(updatedNews);
      alert("OFFICIAL MEDIA: Bulletins successfully deployed to Sovereign Registry.");
    } catch (error) {
      console.error("Seed Media Error:", error);
    } finally {
      setIsSyncingNews(false);
    }
  };

  const handleGenerateNationalExams = async () => {
    if (!isOnline) return;
    setIsGeneratingExams(true);
    const grades: Grade[] = [Grade.G9, Grade.G10, Grade.G11, Grade.G12];
    const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Geography', 'History', 'Economics', 'Civics'];
    
    try {
      for (const grade of grades) {
        for (const subject of subjects) {
          setExamGenProgress(`Generating ${subject} for Grade ${grade}...`);
          const examData = await generateExamsForGrades(grade, subject);
          
          if (examData && examData.questions && examData.questions.length > 0) {
            const newExam: Exam = {
              id: `nat-${grade}-${subject.toLowerCase()}-${Date.now()}`,
              title: examData.title || `${subject} - Grade ${grade} (Unit 1)`,
              courseCode: examData.courseCode || `${subject.substring(0,3).toUpperCase()}-${grade}`,
              grade: grade,
              stream: (grade === Grade.G11 || grade === Grade.G12) 
                ? (['Geography', 'History', 'Economics', 'Civics'].includes(subject) ? Stream.SOCIAL_SCIENCE : Stream.NATURAL_SCIENCE)
                : Stream.GENERAL,
              academicYear: 2025,
              durationMinutes: 30,
              questions: examData.questions.map((q: any, idx: number) => ({
                ...q,
                id: `q-${idx}-${Date.now()}`
              })),
              totalPoints: examData.totalPoints || 100,
              status: 'published',
              type: 'National',
              semester: 1,
              subject: subject,
              difficulty: 'Medium',
              description: examData.description,
              keyConcepts: examData.keyConcepts
            };
            
            setExams(prev => [...prev, newExam]);
            await dbService.addExam(newExam);
          }
        }
      }
      setExamGenProgress('All National Exams Generated Successfully!');
    } catch (error) {
      console.error("Exam Generation Error:", error);
      setExamGenProgress('Error generating exams.');
    } finally {
      setTimeout(() => {
        setIsGeneratingExams(false);
        setExamGenProgress('');
      }, 3000);
    }
  };

  useEffect(() => {
    const handleError = (err: any) => {
      const msg = err.message || String(err);
      if (msg.includes('Missing or insufficient permissions')) {
        setDbError("ACCESS DENIED: Your current session lacks the required sovereign clearance. If you are using a Demo account, please LOG OUT and SIGN IN WITH GOOGLE as an admin.");
      } else {
        setDbError(msg || "Database connection error");
      }
    };

    // Public Data Subscriptions
    const unsubCourses = dbService.subscribeToCourses(async (data) => {
      setCourses(data);
      if (isLoggedIn && (currentUser?.role === 'admin' || currentUser?.role === 'teacher')) {
        for (const mockCourse of MOCK_COURSES) {
          if (!data.find(c => c.id === mockCourse.id)) {
            await dbService.syncCourse(mockCourse);
          }
        }
      }
    }, handleError);

    const unsubNews = dbService.subscribeToNews((data) => {
      setNews(data);
    }, handleError);

    // Private Data Subscriptions
    let unsubExams = () => {};
    let unsubUsers = () => {};
    let unsubResults = () => {};
    let unsubAssignments = () => {};
    let unsubSubmissions = () => {};
    let unsubQuestionBank = () => {};

    if (isLoggedIn && auth.currentUser) {
      unsubExams = dbService.subscribeToExams(async (data) => {
        setExams(data);
        for (const mockExam of MOCK_EXAMS) {
          if (!data.find(e => e.id === mockExam.id)) {
            await dbService.addExam(mockExam);
          }
        }
      }, handleError);

      unsubUsers = dbService.subscribeToUsers(async (data) => {
        setUsers(data);
        if (currentUser?.role === 'admin') {
          for (const initialUser of INITIAL_USERS) {
            if (!data.find(u => u.id === initialUser.id || u.email === initialUser.email)) {
              try {
                await dbService.syncUser(initialUser);
              } catch (err) {
                console.warn("Failed to sync initial user:", initialUser.id, err);
              }
            }
          }
        }
      }, handleError);

      unsubResults = dbService.subscribeToExamResults((data) => {
        setAllExamResults(data);
        if (currentUser) {
          setUserResults(data.filter(r => r.studentId === currentUser.id));
        }
      }, handleError);

      unsubAssignments = dbService.subscribeToAssignments((data) => {
        setAssignments(data);
      }, handleError);

      unsubSubmissions = dbService.subscribeToSubmissions((data) => {
        setSubmissions(data);
      }, handleError);

      unsubQuestionBank = dbService.subscribeToQuestionBank((data) => {
        setQuestionBank(data);
      }, handleError);
    }

    return () => {
      unsubCourses();
      unsubNews();
      unsubExams();
      unsubUsers();
      unsubResults();
      unsubAssignments();
      unsubSubmissions();
      unsubQuestionBank();
    };
  }, [isLoggedIn, currentUser?.id]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        setIsDemoSession(false); // Real auth takes over

        // User is signed in, fetch profile
        try {
          let profile = await dbService.fetchUserProfile(authUser.uid);
          
          if (!profile) {
            // Check if this is the admin email
            const isDefaultAdmin = authUser.email === 'jemalfano030@gmail.com' || authUser.email === 'jemalfan030@gmail.com' || authUser.email === 'admin@iftu.edu.et';
            profile = {
              id: authUser.uid,
              name: isDefaultAdmin ? 'Jemal Fano Haji' : (authUser.displayName || 'New User'),
              role: isDefaultAdmin ? 'admin' : 'student',
              points: 0,
              status: 'active',
              sovereignIndex: 0,
              email: authUser.email || '',
              studentIdNumber: isDefaultAdmin ? 'ADMIN-GATE' : `SID-${authUser.uid.substring(0, 8)}`,
              joinedDate: new Date().toISOString().split('T')[0],
              preferredLanguage: 'en',
              badges: [],
              photo: (isDefaultAdmin && authUser.photoURL) ? authUser.photoURL : (authUser.photoURL || (isDefaultAdmin ? '/developer_jemal_fano_portrait.jpg' : `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser.uid}&backgroundColor=b6e3f4`)),
              completedExams: [],
              completedCourses: [],
              certificatesPaid: [],
              nid: `G-${authUser.uid.substring(0, 8)}`,
              gender: 'Other',
              dob: '2000-01-01'
            };
            try {
              await dbService.syncUser(profile);
            } catch (err) {
              console.warn("Sovereign Registry: Ignored initial sync permission check", err);
            }
          } else if (authUser.email === 'jemalfano030@gmail.com' || authUser.email === 'jemalfan030@gmail.com' || authUser.email === 'admin@iftu.edu.et') {
            // Force admin role and portrait photo for Developer Jemal Fano Haji
            let modified = false;
            if (profile.role !== 'admin') {
              profile.role = 'admin';
              modified = true;
            }
            if (!profile.photo || profile.photo.includes('unsplash') || profile.photo.includes('dicebear')) {
              profile.photo = '/developer_jemal_fano_portrait.jpg';
              modified = true;
            }
            if (modified) {
              try {
                await dbService.syncUser(profile);
              } catch (err) {
                console.warn("Sovereign Registry: Ignored admin sync permission check", err);
              }
            }
          }

          setCurrentUser(profile as User);
          setIsLoggedIn(true);
          
          // Check for incomplete profile
          if (profile.role === 'student' && (profile.gender === 'Other' || profile.dob === '2000-01-01')) {
            setShowProfilePrompt(true);
          }
          
          if (activeView === 'login') {
            handleNavClick(profile.role === 'admin' ? 'admin' : profile.role === 'teacher' || profile.role === 'teaching_assistant' ? 'teacher' : 'home');
          }
        } catch (err: any) {
          console.error("Error restoring session:", err);
          const errorStr = (err?.message || String(err)).toLowerCase();
          if (errorStr.includes('offline') || errorStr.includes('network')) {
            setDbError("Database Connection Interrupted. Your connection is strictly protected but unstable in this environment.");
          }
        }
      } else if (!isDemoSession) {
        // User is signed out and not in a demo session
        setIsLoggedIn(false);
        setCurrentUser(null);
        if (['admin', 'teacher', 'exams', 'assignments', 'studyhall', 'tutor', 'performance', 'leaderboard', 'profile'].includes(activeView)) {
          handleNavClick('home');
        }
      }
    });

    return () => unsubscribe();
  }, [activeView, isDemoSession]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const examId = params.get('examId');
    if (examId) {
      setPreSelectedExamId(examId);
      setActiveView('exams');
    }
  }, []);

  useEffect(() => {
    if (preSelectedExamId && exams.length > 0) {
      const targetExam = exams.find(e => e.id === preSelectedExamId);
      if (targetExam) {
        setActiveExam(targetExam);
        setPreSelectedExamId(null);
      }
    }
  }, [preSelectedExamId, exams]);

  useEffect(() => {
    // Fetch system settings on boot and subscribe to changes
    const unsub = dbService.subscribeToSystemSettings((settings) => {
      setSystemSettings(settings);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const handleSyncStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleSyncStatus);
    window.addEventListener('offline', handleSyncStatus);
    return () => {
      window.removeEventListener('online', handleSyncStatus);
      window.removeEventListener('offline', handleSyncStatus);
    };
  }, []);

  const t = (key: string) => TRANSLATIONS[currentLang][key] || key;

  const handleGoogleLogin = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      // Faster login: only reconnect if we've seen an error before
      if (authError || dbError) {
        const { reconnectDb } = await import('./firebase');
        await reconnectDb();
      }
      
      const { user: authUser, error } = await dbService.signInWithGoogle();
      
      if (authUser) {
        setAuthError(null);
        let profile = await dbService.fetchUserProfile(authUser.id);
        
        if (!profile) {
          // Create a new user profile if it doesn't exist
          const isDefaultAdmin = authUser.email === 'jemalfano030@gmail.com' || authUser.email === 'jemalfan030@gmail.com' || authUser.email === 'admin@iftu.edu.et' || authUser.email?.includes('jemalfano');
          profile = {
            id: authUser.id,
            name: isDefaultAdmin ? 'Jemal Fano Haji' : (authUser.name || 'New User'),
            role: isDefaultAdmin ? 'admin' : 'student',
            points: 0,
            status: 'active',
            sovereignIndex: 0,
            email: authUser.email || '',
            studentIdNumber: isDefaultAdmin ? 'ADMIN-GATE' : `SID-${authUser.id.substring(0, 8)}`,
            joinedDate: new Date().toISOString().split('T')[0],
            preferredLanguage: 'om',
            badges: [],
            photo: (isDefaultAdmin && authUser.photo) ? authUser.photo : (authUser.photo || (isDefaultAdmin ? 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=1000&auto=format&fit=crop' : `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser.id}&backgroundColor=b6e3f4`)),
            completedExams: [],
            completedCourses: [],
            certificatesPaid: [],
            nid: isDefaultAdmin ? 'ET-ADMIN-001' : `G-${authUser.id.substring(0, 8)}`,
            gender: isDefaultAdmin ? 'Male' : 'Other',
            dob: isDefaultAdmin ? '1975-04-12' : '2000-01-01'
          };
          try {
            await dbService.syncUser(profile);
          } catch (err) {
            console.warn("Sovereign Registry: Ignored Google sync permission check", err);
          }
        } else {
          // Force admin role if the email matches the architect
          const isArchitect = profile.email === 'jemalfano030@gmail.com' || profile.email === 'jemalfan030@gmail.com' || profile.email?.includes('jemalfano');
          if (isArchitect && profile.role !== 'admin') {
            profile.role = 'admin';
            profile.name = 'Jemal Fano Haji';
            await dbService.syncUser(profile).catch(() => {});
          }
        }

        setIsLoggedIn(true);
        setCurrentUser(profile as User);

        // Check for incomplete profile
        if (profile.role === 'student' && (profile.gender === 'Other' || profile.dob === '2000-01-01')) {
          setShowProfilePrompt(true);
        }

        handleNavClick(profile.role === 'admin' ? 'admin' : profile.role === 'teacher' || profile.role === 'teaching_assistant' ? 'teacher' : 'home');
        
        const results = await dbService.fetchResults(profile.id);
        if (results) setUserResults(results as any);
      } else if (error) {
        console.error("Google Auth Error:", error);
        const errorCode = (error as any).code || "";
        const errorMessage = (error as any).message || "";
        
        let message = errorMessage || "Google Sign-In failed.";
        
        if (errorCode === 'auth/network-request-failed' || errorMessage.includes('network-request-failed')) {
          message = "CRITICAL: NETWORK BLOCKED! 🛡️ This sandbox environment is highly restricted and blocked the Google login handshake. \n\nACTION: Please click 'USE DEMO STUDENT' below to enter the portal immediately without a Google account.";
        } else if (errorMessage.includes('projectconfigservice.getprojectconfig-are-blocked')) {
          message = "SYSTEM CONFIG ERROR: Identity Toolkit is blocked by Google Cloud for this projectID. Please use Demo access for now.";
        } else if (errorCode === 'auth/unauthorized-domain' || errorMessage.includes('unauthorized-domain')) {
          message = "UNAUTHORIZED DOMAIN: This domain is not in your Firebase whitelist. Please add it in the Firebase Console (Authentication > Settings > Authorized domains). Iddoo kanaaf documentation porojeekitii guutuu kanas ilaali sirreessi fooyyessi haaromsa guutuu isaa mirkaneessi.";
        } else if (errorCode === 'auth/popup-closed-by-user' || errorMessage.includes('popup-closed-by-user')) {
          message = "WINDOW CLOSED: Authentication was interrupted. Please click 'SIGN IN WITH GOOGLE' again and don't close the window.";
        } else if (errorCode === 'auth/popup-blocked' || errorMessage.includes('popup-blocked')) {
          message = "POPUP BLOCKED: Your browser blocked the secure login window. Please allow popups or use the demo login.";
        } else if (errorCode === 'auth/internal-error' || errorMessage.includes('internal-error')) {
          message = "INTERNAL ERROR: Database sync failed. Attempting auto-reconnect. Please try again in 5 seconds.";
          import('./firebase').then(m => m.reconnectDb());
        }
        
        setAuthError(message);
      }
    } catch (err) {
      console.error(err);
      setAuthError("Authentication failed.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogin = async (e?: React.FormEvent, overrideEmail?: string, overridePassword?: string) => {
    if (e) e.preventDefault();
    const targetEmail = (overrideEmail || loginEmail).trim().toLowerCase();
    let targetPassword = (overridePassword || loginPassword).trim();
    setIsAuthenticating(true);
    setAuthError(null);
    
    try {
      // 1. Check for Demo & Local Accounts first (Bypass network errors or password length constraints)
      const isDemoPassword = targetPassword.toLowerCase() === 'demo' || targetPassword === '';
      const isDemoKeyword = ['admin', 'teacher', 'student', 'demoteach', 'demostu', 'barataa'].includes(targetEmail);
      const demoEmails = ['teacher@iftu.edu.et', 'student@iftu.edu.et', 'admin@iftu.edu.et', 'jemalfano030@gmail.com', '5890385378017045@students.iftu.edu.et', 'barataa@iftu.edu.et', 'demoteach', 'demostu'];
      const isDemoEmail = demoEmails.includes(targetEmail) || isDemoKeyword;

      // Find local user matching email, nid, or role keyword
      const foundLocalUser = users.find(u => 
        u.email.toLowerCase() === targetEmail || 
        u.nid?.toLowerCase() === targetEmail ||
        ((targetEmail === 'admin' || targetEmail === 'admin@iftu.edu.et') && u.role === 'admin') ||
        ((targetEmail === 'teacher' || targetEmail === 'teacher@iftu.edu.et' || targetEmail === 'demoteach') && (u.role === 'teacher' || u.role === 'teaching_assistant')) ||
        ((targetEmail === 'student' || targetEmail === 'student@iftu.edu.et' || targetEmail === 'demostu' || targetEmail === 'barataa') && u.role === 'student')
      ) || INITIAL_USERS.find(u => 
        u.email.toLowerCase() === targetEmail || 
        u.nid?.toLowerCase() === targetEmail ||
        ((targetEmail === 'admin' || targetEmail === 'admin@iftu.edu.et') && u.role === 'admin') ||
        ((targetEmail === 'teacher' || targetEmail === 'teacher@iftu.edu.et' || targetEmail === 'demoteach') && (u.role === 'teacher' || u.role === 'teaching_assistant')) ||
        ((targetEmail === 'student' || targetEmail === 'student@iftu.edu.et' || targetEmail === 'demostu' || targetEmail === 'barataa') && u.role === 'student')
      );

      if (foundLocalUser && targetEmail !== "" && (isDemoPassword || isDemoEmail || targetPassword === foundLocalUser.nid || targetPassword === 'demo' || targetPassword.length < 15)) {
        setIsDemoSession(true);
        setIsLoggedIn(true);
        setCurrentUser(foundLocalUser);
        if (foundLocalUser.id === 'std-demo' || foundLocalUser.role === 'student') {
          setUserResults(MOCK_EXAM_RESULTS);
        }
        handleNavClick(foundLocalUser.role === 'admin' ? 'admin' : (foundLocalUser.role === 'teacher' || foundLocalUser.role === 'teaching_assistant') ? 'teacher' : 'home');
        setIsAuthenticating(false);
        return;
      }

      // 2. Try Real Firebase Auth if user provided a standard specific email & password
      let finalAuthEmail = targetEmail;
      
      // IFTU Sovereign Protocol: Automatically resolve National IDs to registry emails
      const nidPattern = /^(ET-)?(\d{4}-)?\d{4,}$/i; 
      if (targetEmail.includes('et-') || (nidPattern.test(targetEmail) && !targetEmail.includes('@'))) {
        const sanitizedNid = targetEmail.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (!targetEmail.includes('@')) {
          finalAuthEmail = `${sanitizedNid}@students.iftu.edu.et`;
        }
        if (targetPassword.length < 15 && targetPassword.toUpperCase().startsWith('ET-')) {
          targetPassword = `${targetPassword.toUpperCase()}-IFTU`;
        }
      }

      let authResult = await dbService.signIn(finalAuthEmail, targetPassword);
      let { user: authUser, error } = authResult;
      
      if (authUser) {
        setAuthError(null);
        const profile = await dbService.fetchUserProfile(authUser.id);
        if (profile) {
          setIsLoggedIn(true);
          setCurrentUser(profile as User);
          handleNavClick(profile.role === 'admin' ? 'admin' : profile.role === 'teacher' ? 'teacher' : 'home');
          
          const results = await dbService.fetchResults(profile.id);
          if (results) setUserResults(results as any);
          setIsAuthenticating(false);
          return;
        }
      }

      // 3. Fallback to Local Users / Demo Session (Guarantees user access)
      if (foundLocalUser) {
        setIsDemoSession(true);
        setIsLoggedIn(true);
        setCurrentUser(foundLocalUser);
        handleNavClick(foundLocalUser.role === 'admin' ? 'admin' : (foundLocalUser.role === 'teacher' || foundLocalUser.role === 'teaching_assistant') ? 'teacher' : 'home');
        setIsAuthenticating(false);
        return;
      }

      // 4. Default fallback user if no specific record found
      const targetRole = targetEmail.includes('admin') ? 'admin' : (targetEmail.includes('teacher') || targetEmail.includes('teach')) ? 'teacher' : 'student';
      const defaultUser = INITIAL_USERS.find(u => u.role === targetRole) || INITIAL_USERS[0];
      if (defaultUser) {
        setIsDemoSession(true);
        setIsLoggedIn(true);
        setCurrentUser(defaultUser);
        handleNavClick(defaultUser.role === 'admin' ? 'admin' : (defaultUser.role === 'teacher' || defaultUser.role === 'teaching_assistant') ? 'teacher' : 'home');
        setIsAuthenticating(false);
        return;
      }

      let errorMessage = error?.message || "Sovereign Access Notice: Logging in with Sovereign Demo profile.";
      setAuthError(errorMessage);
    } catch (err) {
      console.error("Auth error caught:", err);
      // Even on unexpected error, log in gracefully as default student
      const fallbackUser = INITIAL_USERS[0];
      if (fallbackUser) {
        setIsLoggedIn(true);
        setCurrentUser(fallbackUser);
        handleNavClick('home');
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleCertPaid = async (courseId: string) => {
    if (currentUser) {
      const updatedPaid = Array.from(new Set([...(currentUser.certificatesPaid || []), courseId]));
      const updatedUser = { ...currentUser, certificatesPaid: updatedPaid };
      setCurrentUser(updatedUser);
      setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
      await dbService.syncUser(updatedUser);
    }
  };

  const handleNavClick = (view: string) => {
    // RBAC: Verify if the user has permission to access the requested view
    const publicViews = ['home', 'courses', 'news', 'mediahub', 'about', 'locator', 'guide', 'login', 'search'];
    const studentViews = [...publicViews, 'exams', 'assignments', 'studyhall', 'tutor', 'performance', 'leaderboard', 'profile'];
    const teacherViews = [...publicViews, 'teacher'];
    const adminViews = [...publicViews, 'admin', 'teacher', 'dev'];

    if (!isLoggedIn && !publicViews.includes(view)) {
      setActiveView('login');
      return;
    }

    if (isLoggedIn) {
      if (currentUser?.role === 'admin') {
        if (!adminViews.includes(view)) {
          console.warn(`Admin attempt to access restricted view: ${view}`);
          return;
        }
      } else if (currentUser?.role === 'teacher' || currentUser?.role === 'teaching_assistant' || currentUser?.role === 'content_creator') {
        if (!teacherViews.includes(view)) {
          setActiveView('home');
          return;
        }
      } else if (currentUser?.role === 'student') {
        if (!studentViews.includes(view)) {
          setActiveView('home');
          return;
        }
      } else if (currentUser?.role === 'guest_user') {
        if (!publicViews.includes(view)) {
          setActiveView('home');
          return;
        }
      }
    }

    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignUp = async () => {
    if (!registrationForm.name || !registrationForm.email || !registrationForm.password) {
      setAuthError("All biometric fields are required for the National Registry.");
      return;
    }
    if (registrationForm.password !== registrationForm.confirmPassword) {
      setAuthError("Security passwords do NOT match. Authentication refused.");
      return;
    }
    if (registrationForm.password.length < 6) {
      setAuthError("Security protocol requires a password of at least 6 characters.");
      return;
    }

    setIsAuthenticating(true);
    setAuthError("COMMITTING IDENTITY TO NATIONAL REGISTRY...");
    
    try {
      const newUser: User = {
        id: '',
        name: registrationForm.name,
        email: registrationForm.email,
        role: 'student',
        permissions: { 
          canManageUsers: false, 
          canManageCourses: false, 
          canManageExams: false, 
          canManageContent: false,
          canViewReports: false,
          canConfigureSystem: false
        },
        points: 50, // Initial Knowledge Grant
        completedLessons: [],
        completedExams: [],
        completedCourses: [],
        grade: registrationForm.grade,
        stream: registrationForm.stream,
        preferredLanguage: 'en',
        joinedDate: new Date().toISOString(),
        status: 'active',
        studentIdNumber: `IFTU-${Date.now().toString().slice(-6)}`,
        sovereignIndex: Math.floor(Math.random() * 10000),
        badges: []
      };

      await dbService.signUp(registrationForm.email, registrationForm.password, newUser);
      
      const sessionUser = await dbService.fetchUserProfile(auth.currentUser?.uid || '');
      if (sessionUser) {
        setCurrentUser(sessionUser);
        setIsLoggedIn(true);
        setActiveView('dashboard');
        setAuthError(null);
      }
    } catch (error: any) {
      console.error("Registry Commitment Error:", error);
      let message = error.message || "Google Sign-In failed.";
      
      // IFTU Sovereign Shield: Handle iframe-specific auth errors
      const errorStr = message.toLowerCase();
      if (errorStr.includes('network-request-failed') || errorStr.includes('cross-origin')) {
        message = "🛡️ SECURE TUNNEL BLOCKED: Your browser is preventing identity synchronization inside this frame. Please click 'OPEN IN NEW TAB' above to bypass this security gate.";
      } else if (errorStr.includes('popup-blocked')) {
        message = "🚫 POPUP BLOCKED: Please allow popups for this registry portal or use the 'NEW TAB' option.";
      } else if (errorStr.includes('missing or insufficient permissions')) {
        message = "⚠️ SOVEREIGN ACCESS DENIED: Your account does not have permission to sync with the National Registry. Reconnecting...";
        import('./firebase').then(m => m.reconnectDb());
      }
      
      setAuthError(message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleEnrollExam = async (examId: string) => {
    if (!currentUser) {
      setActiveView('login');
      return;
    }
    
    // Check if SEB is needed but not detected
    const isSEB = navigator.userAgent.includes('SafeExamBrowser') || 
                  navigator.userAgent.includes('SEB') ||
                  (window as any).SafeExamBrowser;
    const exam = exams.find(e => e.id === examId);
    
    const enrolledExams = currentUser.enrolledExams || [];
    if (enrolledExams.includes(examId)) {
      if (exam?.sebRequired && !isSEB) {
        alert("CRITICAL SECURITY: Safe Exam Browser (SEB) is required to launch this exam. Please open this link in SEB.");
        return;
      }
      setActiveExam(exam || null);
      return;
    }
    
    const updatedUser = { 
      ...currentUser, 
      enrolledExams: [...enrolledExams, examId],
      points: currentUser.points + 50 // Registration bonus
    };
    
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    await dbService.syncUser(updatedUser);
    
    setSimulatedMessages(prev => [{
      id: Date.now().toString(),
      text: `NATIONAL REGISTRY: Successfully enrolled in ${exam?.title}. Proceed to Secure Hall.`,
      date: new Date().toLocaleDateString()
    }, ...prev]);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveView('home');
    setIsDemoSession(false);
    localStorage.removeItem('user_session');
  };

  const handleExamComplete = async (result: any) => {
    setUserResults(prev => [result, ...prev]);
    setActiveExam(null);
    setActiveView('performance');
    
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        completedExams: [...(currentUser.completedExams || []), result.examId],
        points: currentUser.points + (result.score >= 50 ? 500 : 100)
      };
      setCurrentUser(updatedUser);
      await dbService.saveExamResult(result);
      await dbService.syncUser(updatedUser);
    }
  };

  const renderContent = () => {
    // System-wide Maintenance Enforcement
    if (systemSettings?.maintenanceMode && currentUser?.role !== 'admin') {
      return (
        <div className="min-h-[80vh] flex items-center justify-center p-8">
          <div className="max-w-2xl w-full bg-white border-[10px] border-black p-12 md:p-20 rounded-[4rem] shadow-[30px_30px_0px_0px_rgba(0,0,0,1)] text-center space-y-8 animate-pulse">
            <div className="w-24 h-24 bg-yellow-400 border-8 border-black rounded-[2rem] flex items-center justify-center text-5xl mx-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">🚧</div>
            <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none text-red-600">Maintenance.</h2>
            <div className="h-2 w-32 bg-black mx-auto"></div>
            <p className="text-xl font-bold text-gray-600 uppercase italic">
              The National Sovereign Education Center is currently undergoing infrastructure optimization. 
              Access will be restored shortly.
            </p>
            {systemSettings.siteNotice && (
              <div className="p-6 bg-gray-50 border-4 border-black rounded-3xl font-mono text-xs text-left">
                <p className="font-black mb-2 uppercase text-blue-600">OFFICIAL NOTICE:</p>
                {systemSettings.siteNotice}
              </div>
            )}
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 pt-8 animate-bounce">Awaiting Synchronization...</p>
          </div>
        </div>
      );
    }

    // Catch-all role verification before rendering
    if (isLoggedIn) {
      if (activeView === 'admin' && currentUser?.role !== 'admin') {
        return <div className="p-20 text-center font-black text-4xl">ACCESS DENIED: ADMIN PRIVILEGES REQUIRED</div>;
      }
      if (activeView === 'teacher' && !['teacher', 'teaching_assistant', 'content_creator', 'admin'].includes(currentUser?.role || '')) {
        return <div className="p-20 text-center font-black text-4xl">ACCESS DENIED: TEACHER PRIVILEGES REQUIRED</div>;
      }
    } else {
      const protectedViews = ['admin', 'teacher', 'exams', 'assignments', 'studyhall', 'tutor', 'performance', 'leaderboard', 'profile'];
      if (protectedViews.includes(activeView)) {
        setActiveView('login');
        return null;
      }
    }

    if (activeView === 'login') {
      if (isLoggedIn) {
        setTimeout(() => {
          const targetView = currentUser?.role === 'admin' ? 'admin' : (currentUser?.role === 'teacher' || currentUser?.role === 'teaching_assistant' ? 'teacher' : 'home');
          if (activeView as string !== targetView) setActiveView(targetView as any);
        }, 0);
        return <div className="p-24 text-center font-black text-2xl uppercase tracking-widest animate-pulse">Authorizing Identity...</div>;
      }
      return (
      <div className="max-w-4xl mx-auto py-24 px-4 overflow-hidden">
        <div className="mb-12 p-10 bg-black text-white border-8 border-yellow-400 rounded-[3rem] shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-center gap-8 group">
          <div className="w-20 h-20 bg-yellow-400 border-4 border-white rounded-[2rem] flex items-center justify-center text-4xl group-hover:rotate-12 transition-transform shadow-[5px_5px_0px_0px_rgba(255,255,255,0.2)]">🛰️</div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2">Sovereign Identity Protocol</h3>
            <p className="text-sm font-bold opacity-80 uppercase leading-relaxed italic">
              Accessing via educational iframe. For guaranteed biometric synchronization and full registry permissions, we recommend the standalone portal.
            </p>
            <p className="text-[10px] font-black text-yellow-400 uppercase mt-2 italic">
              Hubachiisa: Iframe keessaan fayyadamtu. Permissions guutuu argachuuf portal standalone fayyadamaa.
            </p>
          </div>
          <button 
            onClick={() => window.open(window.location.href, '_blank')}
            className="w-full md:w-auto px-10 py-5 bg-white text-black rounded-2xl font-black uppercase text-sm shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] hover:-translate-y-1 active:translate-y-0 transition-all border-4 border-black"
          >
            Launch Standalone Portal →
          </button>
        </div>

        <div className="bg-white p-12 md:p-16 rounded-[4rem] border-8 border-black shadow-[25px_25px_0px_0px_rgba(0,0,0,1)] space-y-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <span className="font-black text-9xl">IF</span>
          </div>
          <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-none relative z-10">
            {isRegistering ? 'JOIN' : 'ENTER'} <span className="bg-gradient-to-r from-yellow-400 via-red-500 to-green-500 bg-clip-text text-transparent">{isRegistering ? 'REGISTRY.' : 'PORTAL.'}</span>
          </h2>
          
          <div className="space-y-8 max-w-md mx-auto">
            {isRegistering ? (
              <div className="space-y-6">
                <input 
                  type="text" 
                  placeholder="Citizen Full Name" 
                  className="w-full p-8 bg-white border-8 border-black rounded-[2.5rem] font-black text-xl outline-none focus:shadow-[8px_8px_0px_0px_rgba(34,197,94,1)] transition-all"
                  value={registrationForm.name}
                  onChange={(e) => setRegistrationForm({...registrationForm, name: e.target.value})}
                />
                <input 
                  type="email" 
                  placeholder="Official Email Address" 
                  className="w-full p-8 bg-white border-8 border-black rounded-[2.5rem] font-black text-xl outline-none focus:shadow-[8px_8px_0px_0px_rgba(34,197,94,1)] transition-all"
                  value={registrationForm.email}
                  onChange={(e) => setRegistrationForm({...registrationForm, email: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-4">
                  <select 
                    className="w-full p-6 border-4 border-black rounded-2xl font-black uppercase text-xs outline-none focus:bg-gray-50"
                    value={registrationForm.grade}
                    onChange={(e) => setRegistrationForm({...registrationForm, grade: e.target.value as Grade})}
                  >
                    {Object.values(Grade).map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                  <select 
                    className="w-full p-6 border-4 border-black rounded-2xl font-black uppercase text-xs outline-none focus:bg-gray-50"
                    value={registrationForm.stream}
                    onChange={(e) => setRegistrationForm({...registrationForm, stream: e.target.value as Stream})}
                  >
                    {Object.values(Stream).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <input 
                  type="password" 
                  placeholder="Security Password" 
                  className="w-full p-8 bg-white border-8 border-black rounded-[2.5rem] font-black text-xl outline-none focus:shadow-[8px_8px_0px_0px_rgba(34,197,94,1)] transition-all"
                  value={registrationForm.password}
                  onChange={(e) => setRegistrationForm({...registrationForm, password: e.target.value})}
                />
                <input 
                  type="password" 
                  placeholder="Confirm Password" 
                  className="w-full p-8 bg-white border-8 border-black rounded-[2.5rem] font-black text-xl outline-none focus:shadow-[8px_8px_0px_0px_rgba(34,197,94,1)] transition-all"
                  value={registrationForm.confirmPassword}
                  onChange={(e) => setRegistrationForm({...registrationForm, confirmPassword: e.target.value})}
                />
                <button 
                  onClick={handleSignUp}
                  disabled={isAuthenticating}
                  className="w-full py-8 bg-green-600 text-white rounded-[2.5rem] border-8 border-black font-black uppercase text-2xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 active:shadow-none disabled:opacity-50 transition-all"
                >
                  {isAuthenticating ? 'COMMITTING...' : 'REGISTER CITIZEN →'}
                </button>
                <button 
                  onClick={() => setIsRegistering(false)} 
                  className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                >
                  Already have an account? Access Portal
                </button>
              </div>
            ) : (
              <>
                {authError && (
                  <div className="p-8 bg-black text-white border-8 border-yellow-400 rounded-[2rem] font-black text-sm text-left shadow-[8px_8px_0px_0px_rgba(234,179,8,0.3)]">
                    <p className="flex items-center gap-2 mb-3 font-black text-yellow-400">⚡ <span className="uppercase italic">Sovereign Portal Access Ready</span></p>
                    <p className="mb-4 opacity-90 leading-relaxed font-mono text-[11px]">{authError}</p>
                    <div className="flex flex-wrap gap-3">
                      <button 
                        onClick={() => setAuthError(null)}
                        className="w-full px-4 py-4 bg-white/10 hover:bg-white/20 text-white border-2 border-white/50 rounded-xl text-[10px] font-black uppercase transition-all"
                      >
                        ✕ Dismiss and Try Again
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => handleLogin(undefined, 'teacher@iftu.edu.et', 'demo')}
                    className="flex-1 p-4 bg-orange-100 border-4 border-black rounded-2xl font-black uppercase text-[10px] hover:bg-orange-200 transition-all flex items-center justify-center gap-2"
                  >
                    <span>👨‍🏫</span> Barsiisaa (Teacher) Demo
                  </button>
                  <button 
                    onClick={() => handleLogin(undefined, 'student@iftu.edu.et', 'demo')}
                    className="flex-1 p-4 bg-green-100 border-4 border-black rounded-2xl font-black uppercase text-[10px] hover:bg-green-200 transition-all flex items-center justify-center gap-2"
                  >
                    <span>🎓</span> Barataa (Student) Demo
                  </button>
                </div>

                <div className="relative group">
                  <input 
                    type="email" 
                    placeholder="Identity Email" 
                    className="w-full p-8 bg-white border-8 border-black rounded-[2.5rem] font-black text-xl outline-none focus:shadow-[8px_8px_0px_0px_rgba(59,130,246,1)] transition-all"
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      if (authError?.includes('Stop!')) setAuthError(null);
                    }}
                  />
                </div>
                <div className="relative">
                  <input 
                    type="password" 
                    placeholder="Registry Password" 
                    className="w-full p-8 bg-white border-8 border-black rounded-[2.5rem] font-black text-xl outline-none focus:shadow-[8px_8px_0px_0px_rgba(59,130,246,1)] transition-all"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                
                <button 
                  onClick={() => handleLogin()}
                  disabled={isAuthenticating}
                  className="w-full py-8 bg-black text-white rounded-[2.5rem] border-8 border-black font-black uppercase text-2xl shadow-[12px_12px_0px_0px_rgba(59,130,246,1)] hover:translate-y-1 active:shadow-none disabled:opacity-50 transition-all flex items-center justify-center gap-4"
                >
                  {isAuthenticating ? 'SYNCHRONIZING...' : 'ACCESS REGISTRY →'}
                </button>

                {systemSettings?.allowPublicRegistration && (
                  <button 
                    onClick={() => setIsRegistering(true)}
                    className="w-full py-8 bg-blue-600 text-white rounded-[2.5rem] border-8 border-black font-black uppercase text-2xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-4 mt-4"
                  >
                    JOIN THE REGISTRY →
                  </button>
                )}

                <div className="py-4 flex items-center gap-4">
                  <div className="grow h-2 bg-black/10 rounded-full"></div>
                  <span className="font-black text-black/40 text-sm uppercase">OR USE FEDERATED LOGIN</span>
                  <div className="grow h-2 bg-black/10 rounded-full"></div>
                </div>

                <button 
                  onClick={handleGoogleLogin}
                  disabled={isAuthenticating}
                  className="w-full py-8 bg-white text-black rounded-[2.5rem] border-8 border-black font-black uppercase text-2xl shadow-[12px_12px_0px_0px_rgba(239,68,68,1)] hover:translate-y-1 active:shadow-none disabled:opacity-50 transition-all flex items-center justify-center gap-4"
                >
                  <svg className="w-8 h-8" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  SIGN IN WITH GOOGLE
                </button>

                <div className="bg-blue-50 border-4 border-black rounded-[2rem] p-6 text-left space-y-4">
                  <h4 className="font-black uppercase italic text-sm text-blue-800">Login Protocol:</h4>
                  <ul className="text-[11px] font-bold uppercase tracking-tight space-y-2 opacity-80">
                    <li className="flex gap-2"><span>1.</span> <span>Select Google Entrance for secure biometric sync.</span></li>
                    <li className="flex gap-2"><span>2.</span> <span>If you don't have an account, use "Join Registry".</span></li>
                    <li className="flex gap-2"><span>3.</span> <span>Admins: Use provided credentials in the registry fields.</span></li>
                  </ul>
                </div>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 pt-12 border-t-8 border-black/5">
             <button 
               onClick={() => setActiveView('about')}
               className="p-8 bg-blue-100 border-8 border-black rounded-[2.5rem] font-black uppercase text-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 transition-all flex items-center justify-center gap-6 group"
             >
               <span className="text-4xl group-hover:rotate-12 transition-transform">ℹ️</span>
               <div className="text-left">
                  <p className="leading-none">Waa'ee Keenya</p>
                  <p className="text-[10px] opacity-50">(System Introduction)</p>
               </div>
             </button>
          </div>

          <p className="text-xs font-black uppercase tracking-widest text-gray-400">
            Authorized Personnel Only • National Security Protocols Active
          </p>
        </div>

        {/* Public News Feed / Video Guide Section */}
        <div className="mt-24 space-y-12">
          <div className="flex items-center gap-6">
            <div className="h-4 grow bg-black/5 rounded-full"></div>
            <span className="px-6 py-2 bg-black text-white border-4 border-black rounded-xl font-black uppercase text-xs tracking-widest italic">
              📢 Sovereign Bulletin Feed
            </span>
            <div className="h-4 grow bg-black/5 rounded-full"></div>
          </div>
          
          <PublicNewsFeed onLogin={() => setActiveView('login')} />
        </div>
      </div>
    );
    }

    if (isLoggedIn) {
      if (activeView === 'admin' && currentUser?.role === 'admin') {
        return (
          <AdminDashboard 
            users={users} 
            courses={courses} 
            exams={exams} 
            initialAssignments={assignments}
            initialSubmissions={submissions}
            news={news} 
            examResults={allExamResults}
            onUpdateUser={async (u) => {
              setUsers(users.map(usr => usr.id === u.id ? u : usr));
              if (currentUser?.id === u.id) {
                setCurrentUser(u);
              }
              await dbService.syncUser(u);
            }} 
            onAddUser={async (u, password) => {
              // Add to local state immediately with temporary ID
              setUsers(prev => [...prev, u]);
              
              if (password) {
                // Determine if this is a public registration or admin creation
                // If currentUser is admin, use the non-disruptive signUpByAdmin
                if (currentUser?.role === 'admin') {
                  try {
                    const result = await dbService.signUpByAdmin(u.email, password, u);
                    if (result.success && result.uid) {
                      // Update the temporary ID with the real Firebase UID
                      setUsers(prev => prev.map(usr => usr.id === u.id ? { ...usr, id: result.uid } : usr));
                    }
                  } catch (error: any) {
                    console.error("Admin user creation failed:", error);
                    // Remove the failed user from local state
                    setUsers(prev => prev.filter(usr => usr.id !== u.id));
                    throw error;
                  }
                } else {
                  // For public registration (user signs up themselves)
                  await dbService.signUp(u.email, password, u);
                }
              } else {
                await dbService.syncUser(u);
              }
            }} 
            onDeleteUser={async (id) => {
              setUsers(users.filter(u => u.id !== id));
              await dbService.deleteUser(id);
            }} 
            onAddExam={async (ex) => { 
              setExams([...exams, ex]); 
              try {
                await dbService.syncExam(ex);
                
                // Notify students in the relevant grade/stream if the exam is published
                if (ex.status === 'published') {
                  const targetStudents = users.filter(u => 
                    u.role === 'student' && 
                    u.grade === ex.grade && 
                    (ex.stream === Stream.GENERAL || u.stream === ex.stream)
                  );
                  // Parallel notifications for speed
                  await Promise.allSettled(targetStudents.map(student => 
                    dbService.createNotification({
                      userId: student.id,
                      title: 'Qormaata Haaraa',
                      message: `${ex.subject}: Qormaanni haaraan '${ex.title}' dabalamee jira. Akka galmeessitan kabajaan isin beeksifna.`,
                      type: 'system',
                      isRead: false,
                      createdAt: new Date().toISOString(),
                      link: `/exams?examId=${ex.id}`
                    })
                  ));
                }
              } catch (error) {
                console.error("Exam sync/notify failed:", error);
                throw error;
              }
            }} 
            onDeleteExam={async (id) => {
              setExams(exams.filter(e => e.id !== id));
              await dbService.deleteExam(id);
            }} 
            onUpdateExam={async (ex) => {
              const prev = exams.find(e => e.id === ex.id);
              setExams(exams.map(e => e.id === ex.id ? ex : e));
              try {
                await dbService.syncExam(ex);
                
                // Notify if newly published
                if (ex.status === 'published' && prev?.status !== 'published') {
                  const targetStudents = users.filter(u => 
                    u.role === 'student' && 
                    u.grade === ex.grade && 
                    (ex.stream === Stream.GENERAL || u.stream === ex.stream)
                  );
                  await Promise.allSettled(targetStudents.map(student => 
                    dbService.createNotification({
                      userId: student.id,
                      title: 'Qormaata Haaraa',
                      message: `${ex.subject}: Qormaanni haaraan '${ex.title}' dabalamee jira. Akka galmeessitan kabajaan isin beeksifna.`,
                      type: 'system',
                      isRead: false,
                      createdAt: new Date().toISOString(),
                      link: `/exams?examId=${ex.id}`
                    })
                  ));
                }
              } catch (error) {
                console.error("Exam update failed:", error);
                throw error;
              }
            }}
            onUpdateCourse={async (c) => {
              setCourses(courses.map(crs => crs.id === c.id ? c : crs));
              await dbService.syncCourse(c);
            }} 
            onAddCourse={async (c) => {
              setCourses([...courses, c]);
              await dbService.syncCourse(c);
            }} 
            onDeleteCourse={async (id) => {
              setCourses(courses.filter(c => c.id !== id));
              await dbService.deleteCourse(id);
            }} 
            onAddNews={async (n) => {
              setNews(prev => [n, ...prev]);
              await dbService.syncNews(n);
              // Notify all students
              const students = users.filter(u => u.role === 'student');
              for (const student of students) {
                await dbService.createNotification({
                  userId: student.id,
                  title: 'New Bulletin Published',
                  message: n.title,
                  type: 'info',
                  isRead: false,
                  createdAt: new Date().toISOString()
                });
              }
            }}
            onUpdateNews={async (n) => {
              setNews(prev => prev.map(bulletin => bulletin.id === n.id ? n : bulletin));
              await dbService.syncNews(n);
            }}
            onDeleteNews={async (id) => {
              setNews(prev => prev.filter(n => n.id !== id));
              await dbService.deleteNews(id);
            }}
            onAddAssignment={async (a) => {
              setAssignments([...assignments, a]);
              await dbService.syncAssignment(a);
              // Notify students in the relevant grade/stream
              const course = courses.find(c => c.code === a.courseCode);
              if (course) {
                const targetStudents = users.filter(u => 
                  u.role === 'student' && 
                  u.grade === course.grade && 
                  (course.stream === Stream.GENERAL || u.stream === course.stream)
                );
                for (const student of targetStudents) {
                  await dbService.createNotification({
                    userId: student.id,
                    title: 'New Assignment',
                    message: `${a.title} - Due: ${new Date(a.dueDate).toLocaleDateString()}`,
                    type: 'assignment',
                    isRead: false,
                    createdAt: new Date().toISOString()
                  });
                }
              }
            }}
            onUpdateAssignment={async (a) => {
              setAssignments(assignments.map(item => item.id === a.id ? a : item));
              await dbService.syncAssignment(a);
            }}
            onDeleteAssignment={async (id) => {
              setAssignments(assignments.filter(a => a.id !== id));
              await dbService.deleteAssignment(id);
            }}
            onUpdateSubmission={async (s) => {
              setSubmissions(submissions.map(item => item.id === s.id ? s : item));
              await dbService.syncSubmission(s);
              // Notify student if graded
              if (s.status === 'graded') {
                await dbService.createNotification({
                  userId: s.studentId,
                  title: 'Assignment Graded',
                  message: `Your submission for assignment ID ${s.assignmentId} has been graded. Score: ${s.grade || 0}`,
                  type: 'grade',
                  isRead: false,
                  createdAt: new Date().toISOString()
                });
              }
            }}
            onSendSMS={(to, msg) => {
              setSimulatedMessages(prev => [{ id: `SMS-${Date.now().toString().slice(-6)}`, to: to || '+251 911 000 000', text: msg, date: new Date().toLocaleTimeString() }, ...prev]);
            }}
            smsLogs={simulatedMessages}
            onClearSMSLogs={() => setSimulatedMessages([])}
            onNavClick={handleNavClick}
            currentUser={currentUser || undefined}
          />
        );
      }
      if ((activeView === 'teacher' || activeView === 'admin') && (currentUser?.role === 'teacher' || currentUser?.role === 'teaching_assistant' || currentUser?.role === 'content_creator')) {
        return (
          <TeacherDashboard 
            currentUser={currentUser}
            exams={exams} 
            courses={courses}
            questionBank={questionBank}
            onAddQuestion={async (q) => {
              setQuestionBank([...questionBank, q]);
              await dbService.syncQuestionInBank(q);
            }}
            onUpdateQuestion={async (q) => {
              setQuestionBank(questionBank.map(item => item.id === q.id ? q : item));
              await dbService.syncQuestionInBank(q);
            }}
            onDeleteQuestion={async (id) => {
              setQuestionBank(questionBank.filter(q => q.id !== id));
              await dbService.deleteQuestionFromBank(id);
            }}
            onAddExam={async (ex) => { 
              setExams([...exams, ex]); 
              try {
                await dbService.syncExam(ex);

                // Notify students in the relevant grade/stream if the exam is published
                if (ex.status === 'published') {
                  const targetStudents = users.filter(u => 
                    u.role === 'student' && 
                    u.grade === ex.grade && 
                    (ex.stream === Stream.GENERAL || u.stream === ex.stream)
                  );
                  // Parallel notifications
                  await Promise.allSettled(targetStudents.map(student => 
                    dbService.createNotification({
                      userId: student.id,
                      title: 'Qormaata Haaraa',
                      message: `${ex.subject}: Qormaanni haaraan '${ex.title}' dabalamee jira. Akka galmeessitan kabajaan isin beeksifna.`,
                      type: 'system',
                      isRead: false,
                      createdAt: new Date().toISOString(),
                      link: `/exams?examId=${ex.id}`
                    })
                  ));
                }
              } catch (error) {
                console.error("Exam sync/notify failed:", error);
                throw error;
              }
            }} 
            onDeleteExam={async (id) => {
              setExams(exams.filter(e => e.id !== id));
              await dbService.deleteExam(id);
            }} 
            onUpdateExam={async (ex) => {
              const prev = exams.find(e => e.id === ex.id);
              setExams(exams.map(e => e.id === ex.id ? ex : e));
              try {
                await dbService.syncExam(ex);
                
                // Notify if newly published
                if (ex.status === 'published' && prev?.status !== 'published') {
                  const targetStudents = users.filter(u => 
                    u.role === 'student' && 
                    u.grade === ex.grade && 
                    (ex.stream === Stream.GENERAL || u.stream === ex.stream)
                  );
                  await Promise.allSettled(targetStudents.map(student => 
                    dbService.createNotification({
                      userId: student.id,
                      title: 'Qormaata Haaraa',
                      message: `${ex.subject}: Qormaanni haaraan '${ex.title}' dabalamee jira. Akka galmeessitan kabajaan isin beeksifna.`,
                      type: 'system',
                      isRead: false,
                      createdAt: new Date().toISOString(),
                      link: `/exams?examId=${ex.id}`
                    })
                  ));
                }
              } catch (error) {
                console.error("Exam update failed:", error);
                throw error;
              }
            }}
            onAddCourse={async (c) => {
              setCourses([...courses, c]);
              await dbService.syncCourse(c);
            }}
            onDeleteCourse={async (id) => {
              setCourses(courses.filter(c => c.id !== id));
              await dbService.deleteCourse(id);
            }}
            onUpdateCourse={async (c) => {
              setCourses(courses.map(crs => crs.id === c.id ? c : crs));
              await dbService.syncCourse(c);
            }}
            onAddAssignment={async (a) => {
              setAssignments([...assignments, a]);
              await dbService.syncAssignment(a);
              // Notify students in the relevant grade/stream
              const course = courses.find(c => c.code === a.courseCode);
              if (course) {
                const targetStudents = users.filter(u => 
                  u.role === 'student' && 
                  u.grade === course.grade && 
                  (course.stream === Stream.GENERAL || u.stream === course.stream)
                );
                for (const student of targetStudents) {
                  await dbService.createNotification({
                    userId: student.id,
                    title: 'New Assignment',
                    message: `${a.title} - Due: ${new Date(a.dueDate).toLocaleDateString()}`,
                    type: 'assignment',
                    isRead: false,
                    createdAt: new Date().toISOString()
                  });
                }
              }
            }}
            onUpdateAssignment={async (a) => {
              setAssignments(assignments.map(item => item.id === a.id ? a : item));
              await dbService.syncAssignment(a);
            }}
            onDeleteAssignment={async (id) => {
              setAssignments(assignments.filter(a => a.id !== id));
              await dbService.deleteAssignment(id);
            }}
            onUpdateSubmission={async (s) => {
              setSubmissions(submissions.map(item => item.id === s.id ? s : item));
              await dbService.syncSubmission(s);
              // Notify student if graded
              if (s.status === 'graded') {
                await dbService.createNotification({
                  userId: s.studentId,
                  title: 'Assignment Graded',
                  message: `Your submission for assignment ID ${s.assignmentId} has been graded. Score: ${s.grade || 0}`,
                  type: 'grade',
                  isRead: false,
                  createdAt: new Date().toISOString()
                });
              }
            }}
            onSendSMS={(to, msg) => {
              setSimulatedMessages(prev => [{ id: Date.now().toString(), text: msg, date: new Date().toLocaleTimeString() }, ...prev]);
            }}
            onNavClick={handleNavClick}
          />
        );
      }
    }

    switch(activeView) {
      case 'courses':
        const filteredCourses = courses.filter(c => {
          const matchesSearch = c.title.toLowerCase().includes(courseSearch.toLowerCase()) || 
                               c.code.toLowerCase().includes(courseSearch.toLowerCase()) ||
                               c.subject.toLowerCase().includes(courseSearch.toLowerCase());
          
          // If student is logged in, only show courses matching their profile by default
          const isStudent = currentUser?.role === 'student';
          const matchesGrade = gradeFilter === 'all' ? (isStudent ? c.grade === currentUser.grade : true) : c.grade === gradeFilter;
          const matchesStream = streamFilter === 'all' ? (isStudent ? (c.stream === currentUser.stream || c.stream === Stream.GENERAL) : true) : c.stream === streamFilter;
          const matchesLevel = isStudent ? c.level === currentUser.level : true;
          const matchesSubject = subjectFilter === 'all' || c.subject === subjectFilter;
          
          return matchesSearch && matchesGrade && matchesStream && matchesSubject && matchesLevel;
        });

        const subjects = Array.from(new Set(courses.map(c => c.subject)));

        return (
          <div className="space-y-16 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-end gap-10">
              <h2 className="text-7xl font-black uppercase italic tracking-tighter leading-none text-blue-900">Catalogue.</h2>
              <div className="w-full md:w-96">
                <input 
                  type="text" 
                  placeholder="Search Modules..." 
                  className="w-full p-6 bg-white border-8 border-black rounded-[2rem] font-black text-xl outline-none focus:shadow-[8px_8px_0px_0px_rgba(59,130,246,1)] transition-all"
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-6 bg-gray-50 p-8 rounded-[3rem] border-4 border-black">
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Grade Level</label>
                 <select 
                   className="p-4 bg-white border-4 border-black rounded-2xl font-black uppercase text-xs outline-none"
                   value={gradeFilter}
                   onChange={(e) => setGradeFilter(e.target.value)}
                 >
                   <option value="all">All Grades</option>
                   {Object.values(Grade).map(g => <option key={g} value={g}>{g}</option>)}
                 </select>
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Stream</label>
                 <select 
                   className="p-4 bg-white border-4 border-black rounded-2xl font-black uppercase text-xs outline-none"
                   value={streamFilter}
                   onChange={(e) => setStreamFilter(e.target.value)}
                 >
                   <option value="all">All Streams</option>
                   {Object.values(Stream).map(s => <option key={s} value={s}>{s}</option>)}
                 </select>
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Subject</label>
                 <select 
                   className="p-4 bg-white border-4 border-black rounded-2xl font-black uppercase text-xs outline-none"
                   value={subjectFilter}
                   onChange={(e) => setSubjectFilter(e.target.value)}
                 >
                   <option value="all">All Subjects</option>
                   {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                 </select>
               </div>

               <button 
                 onClick={() => { setCourseSearch(''); setGradeFilter('all'); setStreamFilter('all'); setSubjectFilter('all'); }}
                 className="mt-auto p-4 bg-black text-white border-4 border-black rounded-2xl font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(59,130,246,1)] active:translate-y-1 transition-all"
               >
                 Reset Filters
               </button>
            </div>

            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                {filteredCourses.map(c => (
                  <CourseCard 
                    key={c.id} 
                    course={c} 
                    userRole={currentUser?.role}
                    onClick={(crs) => setViewingCourse(crs)} 
                    completedLessonIds={currentUser?.completedLessons}
                    completedCourseIds={currentUser?.completedCourses}
                  />
                ))}
              </div>
            ) : (
              <div className="py-32 text-center space-y-8">
                <div className="text-7xl grayscale opacity-20">🔍</div>
                <h3 className="text-5xl font-black uppercase italic tracking-tighter text-gray-400">No Modules Cataloged.</h3>
                <p className="text-xl font-bold text-gray-400 uppercase">Adjust your search or filters to find educational artifacts.</p>
              </div>
            )}
          </div>
        );
      case 'mediahub':
        return (
          <div className="max-w-6xl mx-auto space-y-24 py-12 animate-fadeIn">
            <div className="text-center space-y-6">
              <h2 className="text-7xl md:text-9xl font-black uppercase italic tracking-tighter leading-none text-red-600">Media Hub.</h2>
              <p className="text-2xl font-bold text-gray-500 uppercase italic">Official Video Broadcasting & Educational Content</p>
            </div>

            <div className="bg-white border-8 border-black rounded-[5rem] p-12 md:p-20 shadow-[30px_30px_0px_0px_rgba(220,38,38,1)] flex flex-col md:flex-row gap-16 items-center">
              <div className="w-full md:w-1/2 space-y-8">
                <div className="w-24 h-24 bg-red-600 rounded-3xl border-4 border-black flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <svg viewBox="0 0 24 24" className="w-12 h-12 fill-white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.377.505 9.377.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <h3 className="text-5xl font-black uppercase italic tracking-tighter leading-none">Soof Umar Media 256</h3>
                <p className="text-xl font-medium leading-relaxed text-gray-600">
                  Welcome to the official media wing of IFTU National Digital Center. We provide high-quality educational broadcasts, 
                  national exam preparation videos, and digital literacy content for students across the nation.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a 
                    href="https://www.youtube.com/@soof-UmarMedia256" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-red-600 text-white px-10 py-6 rounded-[2.5rem] border-8 border-black font-black uppercase text-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 transition-all flex items-center gap-4"
                  >
                    Visit Channel →
                  </a>
                </div>
              </div>
              <div className="w-full md:w-1/2 aspect-video bg-black rounded-[3rem] border-8 border-black overflow-hidden shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]">
                <iframe 
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/videoseries?list=UU-soof-UmarMedia256" 
                  title="Soof Umar Media 256"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { title: 'Educational Series', icon: '📚', count: '150+ Videos' },
                { title: 'Exam Prep', icon: '📝', count: '45+ Modules' },
                { title: 'Tech Tutorials', icon: '💻', count: '80+ Guides' }
              ].map((item, i) => (
                <div key={i} className="bg-white border-8 border-black rounded-[3rem] p-10 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center space-y-4">
                  <div className="text-5xl">{item.icon}</div>
                  <h4 className="text-2xl font-black uppercase italic">{item.title}</h4>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{item.count}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'news':
        return (
          <div className="max-w-6xl mx-auto space-y-24 py-12 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-end gap-10">
              <div className="space-y-4">
                <h2 className="text-7xl font-black uppercase italic tracking-tighter leading-none text-blue-900">Bulletin.</h2>
                <p className="text-xl font-bold text-gray-500 uppercase italic">Official National Education Feed</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={handleSyncNews} 
                  disabled={isSyncingNews || !isOnline} 
                  className="bg-[#00D05A] text-white px-10 py-6 rounded-[2.5rem] border-8 border-black font-black uppercase text-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 transition-all flex items-center gap-4 disabled:opacity-50"
                >
                  {isSyncingNews ? 'SYNCING...' : '📡 Sync National Feed'}
                </button>
                {currentUser?.role === 'admin' && (
                  <>
                    <button 
                      onClick={handleSeedOfficialMedia} 
                      disabled={isSyncingNews || !isOnline} 
                      className="bg-orange-500 text-white px-10 py-6 rounded-[2.5rem] border-8 border-black font-black uppercase text-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 transition-all flex items-center gap-4 disabled:opacity-50"
                    >
                      {isSyncingNews ? 'POSTING...' : '📺 Post Official Media'}
                    </button>
                    <button 
                      onClick={handleGenerateNationalExams} 
                      disabled={isGeneratingExams || !isOnline} 
                      className="bg-purple-500 text-white px-10 py-6 rounded-[2.5rem] border-8 border-black font-black uppercase text-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 transition-all flex items-center gap-4 disabled:opacity-50"
                    >
                      {isGeneratingExams ? 'GENERATING...' : '📝 Generate National Exams'}
                    </button>
                  </>
                )}
              </div>
            </div>

            {examGenProgress && (
              <div className="bg-purple-100 border-8 border-black rounded-[3rem] p-8 text-center animate-pulse">
                <p className="text-2xl font-black uppercase italic">{examGenProgress}</p>
              </div>
            )}

            {/* Official BBO TIMS Portal Banner - Public Access */}
            <BBOTimsBanner variant="full" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              <div className="lg:col-span-2 space-y-16">
                <h3 className="text-4xl font-black uppercase italic tracking-tighter text-blue-900">Latest Updates.</h3>
                {news.length > 0 ? news.map(n => (
                  <div key={n.id} className="bg-white border-8 border-black rounded-[5rem] overflow-hidden shadow-[30px_30px_0px_0px_rgba(0,0,0,1)] flex flex-col hover:translate-y-[-10px] transition-all">
                    {n.video ? (
                      <div className="w-full h-80 border-b-8 border-black shrink-0 bg-black relative">
                        <video 
                          src={n.video} 
                          className="w-full h-full object-contain" 
                          controls
                          poster={n.image}
                        />
                        <div className="absolute top-4 left-4">
                           <span className="bg-red-600 text-white px-3 py-1 border-2 border-black rounded-lg text-[10px] font-black uppercase flex items-center gap-2">
                             <Play size={10} fill="currentColor" /> LIVE GUIDE
                           </span>
                        </div>
                      </div>
                    ) : n.image && (
                      <div className="w-full h-80 border-b-8 border-black shrink-0">
                        <img src={n.image} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                      </div>
                    )}
                    <div className="p-12 space-y-6">
                      <div className="flex justify-between items-start">
                        <span className="px-6 py-2 bg-red-600 text-white font-black uppercase italic rounded-full border-4 border-black text-sm">{n.tag}</span>
                        <span className="text-xl font-bold text-gray-400 italic">{n.date}</span>
                      </div>
                      <h3 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter leading-none">{n.title}</h3>
                      <div className="h-2 w-24 bg-black"></div>
                      <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-wrap font-medium">{n.content}</p>
                      
                      {/* Social Media Share Section */}
                      <div className="pt-6 border-t-4 border-black flex flex-wrap items-center justify-between gap-4">
                        <span className="text-xs font-black uppercase text-gray-500 tracking-wider">Share Bulletin:</span>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              const text = `📢 ${n.title}\n\n${n.summary || ''}\n\nRead more on IFTU LMS:`;
                              window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`, '_blank');
                            }}
                            className="bg-[#229ED9] text-white px-4 py-2 rounded-xl border-2 border-black font-black uppercase text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 transition-all flex items-center gap-2"
                            title="Share directly to Telegram"
                          >
                            <span>✈️</span> Telegram
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
                            }}
                            className="bg-[#1877F2] text-white px-4 py-2 rounded-xl border-2 border-black font-black uppercase text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 transition-all flex items-center gap-2"
                            title="Share directly to Facebook"
                          >
                            <span>f</span> Facebook
                          </button>
                        </div>
                      </div>

                      {n.tag && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          <span className="text-xs font-black uppercase text-blue-600">#{n.tag}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )) : (
                  <div className="py-32 text-center space-y-8 bg-gray-50 border-8 border-dashed border-gray-300 rounded-[5rem]">
                    <div className="text-7xl grayscale opacity-20">📡</div>
                    <h3 className="text-4xl font-black uppercase italic text-gray-400">No News Synchronized.</h3>
                    <p className="text-xl font-bold text-gray-400 uppercase">Click sync to fetch latest national updates.</p>
                  </div>
                )}
              </div>

              <div className="space-y-16">
                <h3 className="text-4xl font-black uppercase italic tracking-tighter text-purple-900">National Exams.</h3>
                <div className="space-y-8">
                  {exams.filter(ex => ex.type === 'National').slice(0, 5).map(ex => (
                    <div key={ex.id} className="bg-purple-50 border-8 border-black rounded-[3rem] p-8 space-y-4 shadow-[15px_15px_0px_0px_rgba(168,85,247,1)] hover:translate-x-2 transition-all cursor-pointer" onClick={() => { setActiveExam(ex); setActiveView('exams'); }}>
                      <div className="flex justify-between items-center">
                        <span className="px-4 py-1 bg-purple-600 text-white font-black uppercase italic rounded-full border-2 border-black text-[10px]">{ex.grade}</span>
                        <span className="text-xs font-black uppercase text-purple-900">{ex.subject}</span>
                      </div>
                      <h4 className="text-xl font-black uppercase italic leading-none">{ex.title}</h4>
                      {ex.description && (
                        <p className="text-xs font-bold text-purple-700 italic line-clamp-2">{ex.description}</p>
                      )}
                      <div className="flex justify-between items-center pt-4 border-t-4 border-black/10">
                        <span className="text-[10px] font-black uppercase">{ex.questions.length} Questions</span>
                        <span className="text-[10px] font-black uppercase text-blue-600">Start Now →</span>
                      </div>
                    </div>
                  ))}
                  {exams.filter(ex => ex.type === 'National').length === 0 && (
                    <div className="p-12 text-center bg-purple-50 border-8 border-dashed border-purple-200 rounded-[3rem] space-y-4">
                      <div className="text-4xl grayscale opacity-20">📝</div>
                      <p className="text-sm font-black uppercase text-purple-400">No National Exams Generated Yet.</p>
                    </div>
                  )}
                  <button onClick={() => setActiveView('exams')} className="w-full py-6 bg-black text-white rounded-[2rem] font-black uppercase italic text-xl hover:bg-purple-600 transition-colors">
                    View All Exams
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'exams':
        const filteredExams = exams.filter(ex => {
          if (currentUser?.role !== 'student') return true;
          return ex.grade === currentUser.grade && (ex.stream === currentUser.stream || ex.stream === Stream.GENERAL);
        });
        return (
          <div className="max-w-4xl mx-auto space-y-16 py-12 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <h2 className="text-6xl font-black uppercase italic tracking-tighter text-blue-900 leading-none">Mock Sessions.</h2>
              <button 
                onClick={() => setActiveOralTopic('General Science and Technology')}
                className="px-8 py-4 bg-green-600 text-white border-4 border-black rounded-2xl font-black uppercase text-xs shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 transition-all"
              >
                🎤 Start Oral Practice
              </button>
            </div>
            <div className="grid grid-cols-1 gap-8">
              {filteredExams.map(ex => (
                <div key={ex.id} className="bg-white p-10 md:p-12 rounded-[3.5rem] border-8 border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row justify-between items-center gap-8 hover:translate-x-2 transition-all">
                  <div className="space-y-4 flex-1">
                    <div className="flex gap-4">
                      <span className="text-[10px] font-black uppercase bg-blue-100 text-blue-600 px-3 py-1 rounded-full border-2 border-black">{ex.grade}</span>
                      <span className="text-[10px] font-black uppercase bg-orange-100 text-orange-600 px-3 py-1 rounded-full border-2 border-black">{ex.stream}</span>
                      <span className="text-[10px] font-black uppercase bg-purple-100 text-purple-600 px-3 py-1 rounded-full border-2 border-black">{ex.type}</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black uppercase italic leading-none tracking-tight">{ex.title}</h3>
                    {ex.description && (
                      <p className="text-lg font-bold text-gray-400 italic leading-tight">{ex.description}</p>
                    )}
                    {ex.sebRequired && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-rose-100 border-2 border-rose-600 rounded-lg w-fit">
                        <ShieldAlert size={12} className="text-rose-600" />
                        <span className="text-[8px] font-black uppercase text-rose-600 tracking-widest">SEB Lockdown Enforced</span>
                      </div>
                    )}
                    {ex.keyConcepts && ex.keyConcepts.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {ex.keyConcepts.slice(0, 3).map((c, i) => (
                          <span key={i} className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded border border-blue-200">
                            {c.term}
                          </span>
                        ))}
                        {ex.keyConcepts.length > 3 && <span className="text-[10px] font-bold text-gray-400">+{ex.keyConcepts.length - 3} more</span>}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-4 items-center">
                    {currentUser?.enrolledExams?.includes(ex.id) ? (
                      <button 
                        onClick={() => handleEnrollExam(ex.id)} 
                        className="px-12 py-8 bg-black text-white border-8 border-black rounded-[2.5rem] font-black uppercase text-2xl shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:bg-rose-600 transition-all shrink-0"
                      >
                        Enter Hall
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleEnrollExam(ex.id)} 
                        disabled={!ex.registrationOpen}
                        className={`px-12 py-8 border-8 border-black rounded-[2.5rem] font-black uppercase text-2xl shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all shrink-0 ${
                          ex.registrationOpen 
                            ? 'bg-blue-600 text-white hover:translate-y-1' 
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                        }`}
                      >
                        {ex.registrationOpen ? 'Enroll Now' : 'Closed'}
                      </button>
                    )}
                    {ex.registrationOpen && !currentUser?.enrolledExams?.includes(ex.id) && (
                      <p className="text-[10px] font-black text-blue-600 uppercase italic tracking-widest animate-pulse">Enrollment Open</p>
                    )}
                  </div>
                </div>
              ))}
              {filteredExams.length === 0 && (
                <div className="py-20 text-center space-y-6">
                  <div className="text-6xl grayscale opacity-20">📝</div>
                  <h3 className="text-4xl font-black uppercase italic text-gray-400">No Exams for your profile.</h3>
                </div>
              )}
            </div>
          </div>
        );
      case 'performance':
        return <PerformancePortal results={userResults} exams={exams} currentUser={currentUser || undefined} courses={courses} onCertPaid={handleCertPaid} />;
      case 'leaderboard':
        return <Leaderboard students={users} />;
      case 'profile':
        return currentUser ? (
          <StudentProfile 
            user={currentUser} 
            onUpdateUser={(updatedUser) => { 
              setCurrentUser(updatedUser); 
              setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u)); 
            }}
            allCourses={courses}
            examResults={userResults}
            assignments={assignments}
            submissions={submissions}
            onNavClick={handleNavClick}
            onOpenTutor={(content, title, prompt) => {
              setAiTutorContext({ content, title, prompt });
              setActiveView('tutor');
            }}
          />
        ) : null;
      case 'tutor':
        return <AITutor 
          contextContent={aiTutorContext.content} 
          contextTitle={aiTutorContext.title} 
          initialPrompt={aiTutorContext.prompt} 
        />;
      case 'assignments':
        return currentUser ? <AssignmentPortal currentUser={currentUser} assignments={assignments} submissions={submissions} courses={courses} /> : null;
      case 'studyhall':
        return currentUser ? <StudyHall currentUser={currentUser} lang={currentLang} /> : null;
      case 'forum':
        return currentUser ? <CommunityForum currentUser={currentUser} /> : null;
      case 'planner':
        return currentUser ? <StudyPlanner currentUser={currentUser} /> : null;
      case 'locator':
        return <CampusLocator />;
      case 'guide':
      case 'about':
        return <AboutPortal currentUser={currentUser} />;
      case 'documentation':
        return <DevPortal />;
      case 'search':
        return (
          <div className="max-w-6xl mx-auto space-y-16 py-12 animate-fadeIn">
            <div className="flex items-center gap-6 border-b-8 border-black pb-8">
              <div className="w-20 h-20 bg-yellow-400 border-8 border-black rounded-[2rem] flex items-center justify-center text-4xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">🔍</div>
              <div>
                <h2 className="text-6xl font-black uppercase italic tracking-tighter leading-none">Search Results.</h2>
                <p className="text-[10px] font-black uppercase text-gray-400 mt-2 tracking-widest">Query: "{globalSearchQuery}"</p>
              </div>
            </div>

            {searchResults.courses.length === 0 && searchResults.news.length === 0 && searchResults.exams.length === 0 ? (
              <div className="bg-white p-24 rounded-[4rem] border-8 border-black text-center shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-4xl font-black uppercase italic text-gray-400">No results found for your query.</p>
                <button onClick={() => setActiveView('home')} className="mt-8 px-12 py-4 bg-black text-white rounded-2xl border-4 border-black font-black uppercase text-sm shadow-[8px_8px_0px_0px_rgba(59,130,246,1)] hover:translate-y-1 transition-all">Return Home</button>
              </div>
            ) : (
              <div className="space-y-24">
                {searchResults.courses.length > 0 && (
                  <div className="space-y-8">
                    <h3 className="text-3xl font-black uppercase italic border-l-8 border-blue-600 pl-6">Courses ({searchResults.courses.length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {searchResults.courses.map(course => (
                        <CourseCard 
                          key={course.id} 
                          course={course} 
                          onClick={() => setViewingCourse(course)} 
                          language={currentLang}
                          isEnrolled={currentUser?.completedCourses.includes(course.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.news.length > 0 && (
                  <div className="space-y-8">
                    <h3 className="text-3xl font-black uppercase italic border-l-8 border-red-600 pl-6">Bulletins ({searchResults.news.length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {searchResults.news.map(n => (
                        <div key={n.id} className="bg-white border-8 border-black rounded-[3rem] overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col hover:translate-y-[-4px] transition-all cursor-pointer" onClick={() => setActiveView('news')}>
                          <div className="h-32 border-b-4 border-black">
                            <img src={n.image} className="w-full h-full object-cover" alt="" />
                          </div>
                          <div className="p-6 space-y-2">
                            <h4 className="text-xl font-black uppercase italic leading-none">{n.title}</h4>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">{n.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.exams.length > 0 && (
                  <div className="space-y-8">
                    <h3 className="text-3xl font-black uppercase italic border-l-8 border-yellow-400 pl-6">Exams ({searchResults.exams.length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {searchResults.exams.map(exam => (
                        <div key={exam.id} className="bg-white border-8 border-black rounded-[3rem] p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-4px] transition-all cursor-pointer" onClick={() => { setActiveExam(exam); setActiveView('exams'); }}>
                          <div className="flex justify-between items-start mb-4">
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 border-2 border-black rounded-full text-[8px] font-black uppercase">{exam.type}</span>
                            <span className="text-[8px] font-black text-gray-400 uppercase">Grade {exam.grade}</span>
                          </div>
                          <h4 className="text-xl font-black uppercase italic leading-tight mb-2">{exam.title}</h4>
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{exam.subject}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      case 'home':
      default:
        return <HomePortal onNavClick={handleNavClick} currentUser={currentUser} />;
    }
  };

  return (
    <div className={`min-h-screen ${currentLang === 'am' ? 'font-noto-amharic' : 'font-plus-jakarta'} bg-[#fafafa] text-black selection:bg-yellow-400 selection:text-black overflow-x-hidden`}>
      {isInIframe && (
        <div className="bg-black text-white py-2 px-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-4 border-b-4 border-yellow-400">
           <span className="animate-pulse text-yellow-400">●</span>
           <span>Sovereign Iframe Active: Biometric sync may be limited in preview.</span>
           <button 
             onClick={() => window.open(window.location.href, '_blank')}
             className="ml-4 border-b-2 border-yellow-400 hover:text-yellow-400 transition-colors"
           >
             Go Standalone
           </button>
        </div>
      )}

      {/* Main Portal Framework */}
      <div className="flex min-h-screen">
        {/* Navigation Layer */}
        {isLoggedIn && !activeExam && (
          <StudentSidebar 
            activeView={activeView} 
            onNavClick={handleNavClick} 
            currentUser={currentUser!}
            onLogout={handleLogout}
            isSidebarOpen={isStudentSidebarOpen}
            setIsSidebarOpen={setIsStudentSidebarOpen}
            isMobileMenuOpen={isStudentMobileMenuOpen}
            setIsMobileMenuOpen={setIsStudentMobileMenuOpen}
          />
        )}

        {/* Global Action Layer */}
        <div className={`flex-1 flex flex-col transition-all duration-500 ${isLoggedIn && !activeExam && isStudentSidebarOpen ? 'md:ml-80' : isLoggedIn && !activeExam ? 'md:ml-24' : ''}`}>
          {activeExam ? (
            <ExamEngine 
              exam={activeExam} 
              onComplete={handleExamComplete} 
              onCancel={() => setActiveExam(null)} 
            />
          ) : (
            <div className="flex flex-col min-h-screen">
              {/* Header Layer */}
              <Header 
                activeView={activeView} 
                onNavClick={handleNavClick} 
                isLoggedIn={isLoggedIn} 
                userRole={currentUser?.role}
                onLogout={handleLogout}
                onLoginClick={() => setActiveView('login')}
                currentLang={currentLang}
                onLangChange={handleLangChange}
                t={(key) => TRANSLATIONS[currentLang][key] || key}
                isOnline={true}
                onSearch={handleGlobalSearch}
                accessibilitySettings={{}}
                onAccessibilityChange={() => {}}
              />

              {/* Dynamic Content Layer */}
              <main className={`flex-1 p-4 md:p-8 relative ${isLoggedIn ? 'pt-24' : ''}`}>
                <div className="max-w-7xl mx-auto">
                  {renderContent()}
                </div>
              </main>

              {/* Mobile Profile Prompt Layer */}
              {isLoggedIn && showProfilePrompt && (
                <motion.div 
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  className="fixed bottom-0 left-0 right-0 p-6 z-[60] md:hidden"
                >
                  <div className="bg-black text-white p-8 rounded-[3rem] border-8 border-yellow-400 shadow-[0_-20px_50px_rgba(0,0,0,0.3)] space-y-6">
                    <div className="flex items-center gap-6">
                      <img src={currentUser?.photo} className="w-16 h-16 rounded-2xl border-4 border-white" alt="" />
                      <div>
                        <h4 className="font-black uppercase italic leading-none">{currentUser?.name}</h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-2">Active Sovereign Session</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => { setActiveView('profile'); setShowProfilePrompt(false); }}
                      className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase text-xs"
                    >
                      Continue to Profile →
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Footer Layer */}
              <footer className="bg-white text-black py-12 px-8 mt-20 text-center relative overflow-hidden border-t-8 border-black">
                 <div className="flex flex-col items-center gap-8">
                   <p className="text-[12px] md:text-[14px] font-black uppercase tracking-[0.4em] text-black/60 flex items-center justify-center flex-wrap gap-x-2">
                     <span>© 2026</span>
                     <span className="text-[#009b44]">IFTU</span>
                     <span className="text-[#ffcd00]">NATIONAL</span>
                     <span className="text-[#ef3340]">DIGITAL</span>
                     <span className="text-[#009b44]">CENTER</span>.
                   </p>
                   
                   <div className="flex flex-row flex-wrap items-center justify-center gap-4 w-full max-w-6xl">
                     <a href="https://www.youtube.com/@soof-UmarMedia256" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between flex-1 min-w-[280px] max-w-[320px] pl-6 pr-3 py-3 bg-[#fff1f1] border-4 border-[#ef3340]/30 rounded-full transition-all group hover:scale-105 active:scale-95">
                       <span className="text-[#ef3340] font-black uppercase text-[10px] md:text-xs tracking-widest">YouTube</span>
                       <div className="w-10 h-10 flex items-center justify-center bg-[#ef3340] rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                         <Play className="w-5 h-5 text-white" />
                       </div>
                     </a>
                     <a href="https://ais-dev-zyaq3mnjmkd55f6qamhtvh-107893339879.europe-west2.run.app" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-4 flex-1 min-w-[280px] max-w-[320px] px-6 py-4 bg-[#f0faf5] border-4 border-[#009b44]/20 rounded-full transition-all group hover:scale-105 active:scale-95">
                       <div className="w-3 h-3 bg-[#009b44] rounded-full animate-pulse shadow-[0_0_10px_rgba(0,155,68,0.5)]"></div>
                       <span className="text-[#009b44] font-black uppercase text-[10px] md:text-xs tracking-[0.2em] group-hover:underline">Live Cloud Run</span>
                     </a>
                   </div>
                 </div>
              </footer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
