import React, { useState, useRef, useEffect } from 'react';
import { User, Badge, AcademicRecord, Course, ExamResult, Assignment, AssignmentSubmission } from '../types';
import { db, storage } from '../firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { 
  Upload, Save, User as UserIcon, Award, BookOpen, BarChart2, FileText, 
  ChevronRight, Trash2, ExternalLink, Calendar, GraduationCap, MapPin, 
  Mail, Phone, ShieldCheck, Loader2, Brain, Sparkles, ClipboardList, Clock,
  QrCode, Camera, CheckCircle2, XCircle, AlertTriangle, Download, Printer,
  RefreshCw, Copy, Check, Lock, Search, Eye, Maximize, CreditCard,
  ShoppingBag, Gift, Zap, TrendingUp, PieChart, Layers, Star, Unlock,
  Sliders, Flame, Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar, Legend, ReferenceLine 
} from 'recharts';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import { QrReader } from 'react-qr-reader';
import RedemptionShop from './RedemptionShop';
import ProgressPath from './ProgressPath';
import I2LMSLogo from './I2LMSLogo';

interface StudentProfileProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  allCourses: Course[];
  examResults: ExamResult[];
  onOpenTutor?: (content: string, title: string, prompt?: string) => void;
  assignments?: Assignment[];
  submissions?: AssignmentSubmission[];
  onNavClick?: (view: string) => void;
}

interface ScanVerification {
  rawPayload: string;
  parsedData: {
    issuer?: string;
    studentId?: string;
    nid?: string;
    name?: string;
    grade?: string;
    stream?: string;
    sovereignIndex?: number;
    status?: string;
    issuedAt?: string;
    securityHash?: string;
    [key: string]: any;
  } | null;
  isValidSovereignId: boolean;
  isSelfMatch: boolean;
  verifiedAt: string;
  verificationCode: string;
}

export interface KPShopItem {
  id: string;
  title: string;
  category: 'badges' | 'resources' | 'perks';
  kpCost: number;
  description: string;
  icon: string;
  badgeData?: Badge;
  perkKey?: string;
  benefits: string[];
  popular?: boolean;
}

export const KP_SHOP_CATALOG: KPShopItem[] = [
  {
    id: 'kp_badge_scholar',
    title: 'Sovereign Scholar Badge',
    category: 'badges',
    kpCost: 500,
    description: 'Official National Digital Registry badge honoring consistent academic distinction.',
    icon: '🏆',
    badgeData: {
      id: 'badge_sovereign_scholar',
      title: 'Sovereign Scholar',
      icon: '🏆',
      earnedAt: new Date().toISOString(),
      description: 'National Academic Distinction'
    },
    benefits: ['Featured badge on student ID card', 'Public registry distinction', '10% bonus boost on national leaderboards']
  },
  {
    id: 'kp_badge_eaes_master',
    title: 'EAES National Exam Pioneer',
    category: 'badges',
    kpCost: 800,
    description: 'Excellence in mock EAES national examination preparation.',
    icon: '⚡',
    badgeData: {
      id: 'badge_eaes_pioneer',
      title: 'EAES Pioneer',
      icon: '⚡',
      earnedAt: new Date().toISOString(),
      description: 'National Mock Master'
    },
    benefits: ['Special EAES Pioneer title', 'Exclusive mock solution access', 'Priority teacher grading queue'],
    popular: true
  },
  {
    id: 'kp_badge_ai_catalyst',
    title: 'AI Study Catalyst',
    category: 'badges',
    kpCost: 1000,
    description: 'Mastery of AI-guided contextual learning and interactive problem solving.',
    icon: '🤖',
    badgeData: {
      id: 'badge_ai_catalyst',
      title: 'AI Catalyst',
      icon: '🤖',
      earnedAt: new Date().toISOString(),
      description: 'Interactive AI Study Champion'
    },
    benefits: ['Unlocks AI Tutor Advanced Reasoning mode', 'Custom avatar AI halo border', 'Exclusive AI study tools']
  },
  {
    id: 'kp_badge_sovereign_laureate',
    title: 'National Sovereign Laureate',
    category: 'badges',
    kpCost: 1500,
    description: 'The pinnacle academic honor awarded to top national learners.',
    icon: '👑',
    badgeData: {
      id: 'badge_sovereign_laureate',
      title: 'Sovereign Laureate',
      icon: '👑',
      earnedAt: new Date().toISOString(),
      description: 'Top 1% National Academic Elite'
    },
    benefits: ['Permanent Gold Sovereign Halo', 'Direct Ministry Honor Roll', 'Free certificate downloads for life'],
    popular: true
  },
  {
    id: 'kp_res_eaes_masterclass',
    title: 'EAES National Mock Masterclass Pass',
    category: 'resources',
    kpCost: 300,
    description: '30-day VIP access to national exam video walkthroughs and step-by-step solutions.',
    icon: '📚',
    perkKey: 'eaes_masterclass_vip',
    benefits: ['Comprehensive national exam breakdown', 'Step-by-step video solutions', 'Downloadable practice PDF workbooks']
  },
  {
    id: 'kp_res_cheat_sheets',
    title: 'Ministry Exam Formula & Blueprint Pack',
    category: 'resources',
    kpCost: 400,
    description: 'High-yield STEM formula sheets, key term mnemonics, and national exam summaries.',
    icon: '📄',
    perkKey: 'formula_pack_vip',
    benefits: ['All Grade 9-12 STEM subjects', 'Printable high-density cheat sheets', 'Exam time management strategies']
  },
  {
    id: 'kp_res_physics_lab',
    title: 'Advanced Virtual Science Lab VIP Access',
    category: 'resources',
    kpCost: 750,
    description: 'Interactive virtual science experiments, physics motion labs, and chemistry simulations.',
    icon: '🔬',
    perkKey: 'virtual_lab_vip',
    benefits: ['Simulated physics experiments', 'Interactive 3D molecular structures', 'Lab report auto-grader']
  },
  {
    id: 'kp_perk_ai_unlimited',
    title: 'AI Tutor Priority Access (30 Days)',
    category: 'perks',
    kpCost: 600,
    description: 'Instant zero-latency responses from IFTU AI Tutor with deep problem-solving reasoning.',
    icon: '💡',
    perkKey: 'ai_priority_unlimited',
    benefits: ['Zero waiting latency', 'Unlimited multi-step problem solving', 'Custom practice question generator'],
    popular: true
  },
  {
    id: 'kp_perk_cert_pass',
    title: 'Sovereign VIP Digital Certificate Pass',
    category: 'perks',
    kpCost: 1000,
    description: 'Unlock verified digital completion certificates for all enrolled and finished courses.',
    icon: '📜',
    perkKey: 'all_certificates_unlocked',
    benefits: ['Verifiable digital QR certificate', 'High-res printable PDF exports', 'Official Ministry stamp']
  },
  {
    id: 'kp_perk_educator_consult',
    title: 'Senior Educator 1-on-1 Consultation Pass',
    category: 'perks',
    kpCost: 900,
    description: '30-minute private academic advisory session with a senior national educator.',
    icon: '👨‍🏫',
    perkKey: 'educator_consultation',
    benefits: ['1-on-1 personalized feedback', 'University & stream advisory', 'Custom study plan calibration']
  }
];

const StudentProfile: React.FC<StudentProfileProps> = ({ 
  user, 
  onUpdateUser, 
  allCourses, 
  examResults, 
  onOpenTutor,
  assignments = [],
  submissions = [],
  onNavClick
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<User>(user);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'progress_path' | 'kp_shop' | 'academics' | 'tasks' | 'achievements' | 'records' | 'identity'>('overview');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // KP Shop & Chart States
  const [chartMetric, setChartMetric] = useState<'score' | 'progress' | 'kp_growth' | 'subjects'>('score');

  // QR Code & Digital ID State
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanVerification | null>(null);
  const [recentScans, setRecentScans] = useState<ScanVerification[]>([]);
  const [scanMode, setScanMode] = useState<'camera' | 'upload'>('camera');
  const [copiedPayload, setCopiedPayload] = useState(false);

  // Campus Event Check-in Pass Generator State
  const [checkInEventType, setCheckInEventType] = useState<string>('Classroom Physical Attendance');
  const [eventQrPassUrl, setEventQrPassUrl] = useState<string | null>(null);
  const [showCheckInModal, setShowCheckInModal] = useState<boolean>(false);
  const [showPrintableIdCardModal, setShowPrintableIdCardModal] = useState<boolean>(false);
  const [checkInPassPayload, setCheckInPassPayload] = useState<string>('');
  const [checkInTimestamp, setCheckInTimestamp] = useState<string>('');
  const [copiedPassPayload, setCopiedPassPayload] = useState(false);

  // Photo Tone & Skin Tone Studio State
  const [showPhotoFilterStudio, setShowPhotoFilterStudio] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>(user.skinTonePreset || 'magaala');
  const [brightness, setBrightness] = useState<number>(102);
  const [contrast, setContrast] = useState<number>(105);
  const [saturation, setSaturation] = useState<number>(88);
  const [hueRotate, setHueRotate] = useState<number>(-6);
  const [sepia, setSepia] = useState<number>(18);
  const [filterSavedToast, setFilterSavedToast] = useState(false);

  const computeFilterString = (b: number, c: number, s: number, h: number, sep: number) => {
    return `brightness(${b}%) contrast(${c}%) saturate(${s}%) hue-rotate(${h}deg) sepia(${sep}%)`;
  };

  const applyPreset = (presetKey: string) => {
    setSelectedPreset(presetKey);
    let b = 100, c = 100, s = 100, h = 0, sep = 0;
    if (presetKey === 'magaala') {
      // Magaala: Ethiopian Warm Tan / Less Redness (Tan/Brown Complexion Balance)
      b = 102; c = 105; s = 88; h = -6; sep = 18;
    } else if (presetKey === 'golden') {
      b = 105; c = 108; s = 115; h = 0; sep = 12;
    } else if (presetKey === 'bronze') {
      b = 95; c = 112; s = 85; h = -4; sep = 28;
    } else if (presetKey === 'studio') {
      b = 104; c = 118; s = 105; h = 0; sep = 0;
    } else if (presetKey === 'natural') {
      b = 100; c = 100; s = 100; h = 0; sep = 0;
    }
    setBrightness(b);
    setContrast(c);
    setSaturation(s);
    setHueRotate(h);
    setSepia(sep);

    const filterStr = presetKey === 'natural' ? 'none' : computeFilterString(b, c, s, h, sep);
    setFormData(prev => ({
      ...prev,
      photoFilter: filterStr,
      skinTonePreset: presetKey
    }));
  };

  const handleSliderChange = (param: 'brightness' | 'contrast' | 'saturation' | 'hueRotate' | 'sepia', val: number) => {
    let b = brightness, c = contrast, s = saturation, h = hueRotate, sep = sepia;
    if (param === 'brightness') b = val;
    if (param === 'contrast') c = val;
    if (param === 'saturation') s = val;
    if (param === 'hueRotate') h = val;
    if (param === 'sepia') sep = val;

    setBrightness(b); setContrast(c); setSaturation(s); setHueRotate(h); setSepia(sep);
    setSelectedPreset('custom');

    const filterStr = computeFilterString(b, c, s, h, sep);
    setFormData(prev => ({
      ...prev,
      photoFilter: filterStr,
      skinTonePreset: 'custom'
    }));
  };

  const savePhotoFilter = async () => {
    try {
      const currentFilter = formData.photoFilter || computeFilterString(brightness, contrast, saturation, hueRotate, sepia);
      const updatedUser = {
        ...user,
        photoFilter: currentFilter,
        skinTonePreset: selectedPreset
      };
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, { 
        photoFilter: currentFilter,
        skinTonePreset: selectedPreset
      });
      onUpdateUser(updatedUser);
      setFilterSavedToast(true);
      setTimeout(() => setFilterSavedToast(false), 3000);
      setShowPhotoFilterStudio(false);
    } catch (err) {
      console.error("Failed to save photo filter:", err);
    }
  };

  const handleGenerateCheckInPass = (eventType: string) => {
    const timestampStr = new Date().toLocaleString('en-US', { timeZone: 'Africa/Addis_Ababa' });
    const payload = JSON.stringify({
      passType: "IFTU-SOVEREIGN-CHECKIN-PASS",
      event: eventType,
      studentName: user.name,
      studentId: user.studentIdNumber || `IFTU-SEC-${user.id.substring(0, 8).toUpperCase()}`,
      grade: user.grade || 'Grade 10',
      stream: user.stream || 'General',
      sovereignIndex: user.sovereignIndex || 1,
      issuedTimestamp: timestampStr,
      hashSignature: `PASS_VERIFIED_${Math.random().toString(36).substring(2, 10).toUpperCase()}`
    }, null, 2);

    setCheckInPassPayload(payload);
    setCheckInEventType(eventType);
    setCheckInTimestamp(timestampStr);

    QRCode.toDataURL(payload, {
      width: 360,
      margin: 2,
      color: { dark: '#000000', light: '#FFFFFF' }
    }).then(url => {
      setEventQrPassUrl(url);
      setShowCheckInModal(true);
    }).catch(err => console.error("Error generating check-in QR pass:", err));
  };

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanIntervalRef = useRef<number | null>(null);
  const qrFileInputRef = useRef<HTMLInputElement>(null);

  const completedCourses = allCourses.filter(c => user.completedCourses?.includes(c.id));

  // Student QR Code Payload Generation
  const studentQrPayload = JSON.stringify({
    issuer: "IFTU-NATIONAL-SOVEREIGN-REGISTRY",
    studentId: user.studentIdNumber || `IFTU-SEC-${user.id.substring(0, 8).toUpperCase()}`,
    nid: user.nid || `ETH-NID-${user.id.substring(0, 6).toUpperCase()}`,
    name: user.name,
    grade: user.grade || 'Grade 10',
    stream: user.stream || 'General',
    sovereignIndex: user.sovereignIndex || 1,
    status: user.status || 'active',
    issuedAt: user.joinedDate || new Date().toISOString().split('T')[0],
    securityHash: `SIG_${user.id.substring(0, 10).toUpperCase()}_SEC`
  }, null, 2);

  // Generate QR Code image when user or component mounts
  useEffect(() => {
    QRCode.toDataURL(studentQrPayload, {
      width: 320,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
    .then(url => setQrCodeDataUrl(url))
    .catch(err => console.error("Error generating QR code:", err));
  }, [user]);

  // Clean up camera stream on unmount or tab switch
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
        // Start frame capture loop
        if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
        scanIntervalRef.current = window.setInterval(processVideoFrame, 300);
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      setCameraError(err.message || "Camera access denied or unavailable. Please use the QR image file upload mode instead.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const processVideoFrame = () => {
    if (!videoRef.current || !canvasRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert'
    });

    if (code && code.data) {
      handleScanSuccess(code.data);
    }
  };

  const handleScanSuccess = (payloadString: string) => {
    let parsed: any = null;
    try {
      parsed = JSON.parse(payloadString);
    } catch (e) {
      parsed = { rawText: payloadString };
    }

    const isSovereignFormat = Boolean(parsed && (parsed.issuer?.includes('IFTU') || parsed.studentId || parsed.rawText?.includes('IFTU')));
    const isSelf = Boolean(parsed?.studentId && user.studentIdNumber && parsed.studentId === user.studentIdNumber);

    const verification: ScanVerification = {
      rawPayload: payloadString,
      parsedData: parsed,
      isValidSovereignId: isSovereignFormat,
      isSelfMatch: isSelf,
      verifiedAt: new Date().toLocaleTimeString() + ' • ' + new Date().toLocaleDateString(),
      verificationCode: `VER_${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    };

    setScanResult(verification);
    setRecentScans(prev => [verification, ...prev.filter(p => p.verificationCode !== verification.verificationCode).slice(0, 4)]);
    stopCamera();
  };

  const handleQrImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code && code.data) {
          handleScanSuccess(code.data);
        } else {
          alert("No readable QR code found in the uploaded image. Please ensure the QR code is clear and unblurred.");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadIdCard = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 800, 500);

    // Border
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#000000';
    ctx.strokeRect(10, 10, 780, 480);

    // Top Header Banner
    ctx.fillStyle = '#009b44'; // Sovereign Green
    ctx.fillRect(15, 15, 770, 75);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('IFTU LMS - NATIONAL DIGITAL SOVEREIGN ID', 35, 55);

    ctx.fillStyle = '#fcd116'; // Gold Accent Line
    ctx.fillRect(15, 90, 770, 8);

    // Photo Box
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(40, 120, 180, 220);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#000000';
    ctx.strokeRect(40, 120, 180, 220);

    // Student Information
    ctx.fillStyle = '#000000';
    ctx.font = 'italic bold 28px sans-serif';
    ctx.fillText(user.name.toUpperCase(), 250, 150);

    ctx.font = 'bold 16px monospace';
    ctx.fillStyle = '#4b5563';
    ctx.fillText(`ID NUMBER: ${user.studentIdNumber || 'IFTU-SEC-UNK'}`, 250, 185);

    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = '#000000';
    ctx.fillText(`EDUCATION LEVEL: ${user.level || 'Secondary'} (${user.grade || 'Grade 10'})`, 250, 220);
    ctx.fillText(`STREAM: ${user.stream || 'General'}`, 250, 250);
    ctx.fillText(`NATIONAL RANK: #${user.sovereignIndex || 1}`, 250, 280);
    ctx.fillText(`NATIONAL NID: ${user.nid || 'ETH-NID-VERIFIED'}`, 250, 310);

    // Verified Stamp
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(250, 335, 230, 40);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.strokeRect(250, 335, 230, 40);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('✓ SOVEREIGN VERIFIED', 265, 360);

    // Render QR Code onto image
    if (qrCodeDataUrl) {
      const qrImg = new Image();
      qrImg.onload = () => {
        ctx.drawImage(qrImg, 570, 120, 190, 190);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.strokeRect(570, 120, 190, 190);

        ctx.fillStyle = '#4b5563';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('SCAN TO VERIFY', 610, 325);

        // Footer Banner
        ctx.fillStyle = '#000000';
        ctx.fillRect(15, 430, 770, 55);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px monospace';
        ctx.fillText(`MINISTRY OF EDUCATION • ISSUED: ${user.joinedDate || '2026-01-01'} • SIG: ${user.id.substring(0, 14).toUpperCase()}`, 35, 462);

        const link = document.createElement('a');
        link.download = `IFTU_Digital_ID_${user.studentIdNumber || user.name}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      };
      qrImg.src = qrCodeDataUrl;
    }
  };

  const copyQrPayload = () => {
    navigator.clipboard.writeText(studentQrPayload);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  // 1. Exam Score Trajectory
  const examTrajectoryData = examResults.length > 0
    ? examResults
        .sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime())
        .map((res, idx) => ({
          date: new Date(res.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
          score: Math.round((res.score / res.totalPoints) * 100),
          benchmark: 75,
          title: res.examId.substring(0, 10),
          kpEarned: Math.round(res.score * 1.5)
        }))
    : [
        { date: 'Jan 10', score: 72, benchmark: 75, title: 'Diagnostic Assessment', kpEarned: 110 },
        { date: 'Feb 14', score: 80, benchmark: 75, title: 'Midterm Exam', kpEarned: 180 },
        { date: 'Mar 22', score: 86, benchmark: 75, title: 'Mock EAES #1', kpEarned: 240 },
        { date: 'Apr 18', score: 92, benchmark: 75, title: 'National Review', kpEarned: 310 },
        { date: 'May 30', score: 89, benchmark: 75, title: 'Final Semester Exam', kpEarned: 290 },
      ];

  // 2. Course & Lesson Progress
  const courseProgressData = [
    { stage: 'Stage 1', coursesCompleted: 0, lessonsFinished: Math.min(2, user.completedLessons?.length || 2), targetLessons: 5 },
    { stage: 'Stage 2', coursesCompleted: Math.min(1, completedCourses.length || 1), lessonsFinished: Math.min(8, user.completedLessons?.length || 6), targetLessons: 12 },
    { stage: 'Stage 3', coursesCompleted: Math.min(2, completedCourses.length || 2), lessonsFinished: Math.min(15, user.completedLessons?.length || 12), targetLessons: 20 },
    { stage: 'Current', coursesCompleted: completedCourses.length || 3, lessonsFinished: user.completedLessons?.length || 18, targetLessons: 25 },
  ];

  // 3. Knowledge Point Growth
  const kpGrowthData = [
    { milestone: 'Enrolled', kpTotal: 100 },
    { milestone: 'First Course', kpTotal: 300 },
    { milestone: 'Midterm Honors', kpTotal: 650 },
    { milestone: 'Assignment Streak', kpTotal: 920 },
    { milestone: 'Current Balance', kpTotal: user.points || 1200 }
  ];

  // 4. Subject Performance Breakdown
  const subjectMasteryData = [
    { subject: 'Physics', avgScore: 88, target: 80, completed: 3 },
    { subject: 'Mathematics', avgScore: 92, target: 85, completed: 4 },
    { subject: 'Chemistry', avgScore: 78, target: 75, completed: 2 },
    { subject: 'English', avgScore: 95, target: 85, completed: 3 },
    { subject: 'Biology', avgScore: 84, target: 80, completed: 2 },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploading(true);
      setUploadProgress(0);
      
      const storageRef = ref(storage, `academic_records/${user.id}/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        }, 
        (error) => {
          console.error("Error uploading record:", error);
          setUploading(false);
          setUploadProgress(0);
        }, 
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          
          const newRecord: AcademicRecord = {
            id: Date.now().toString(),
            name: file.name,
            url,
            type: file.type,
            uploadedAt: new Date().toISOString(),
            size: file.size
          };

          const userRef = doc(db, 'users', user.id);
          await updateDoc(userRef, {
            academicRecords: arrayUnion(newRecord)
          });

          const updatedUser = {
            ...user,
            academicRecords: [...(user.academicRecords || []), newRecord]
          };
          onUpdateUser(updatedUser);
          setFormData(updatedUser);
          setUploading(false);
          setUploadProgress(0);
        }
      );
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    const updatedRecords = user.academicRecords?.filter(r => r.id !== recordId) || [];
    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, { academicRecords: updatedRecords });
      const updatedUser = { ...user, academicRecords: updatedRecords };
      onUpdateUser(updatedUser);
      setFormData(updatedUser);
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  const handleSave = async () => {
    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, { ...formData });
      onUpdateUser(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="space-y-12 animate-fadeIn pb-24">
      {/* Identity Header */}
      <div className="bg-white border-8 border-black rounded-[4rem] p-10 md:p-16 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col md:flex-row gap-12 items-center">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <span className="font-black text-9xl">IF</span>
        </div>
        
        <div className="relative group">
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-[10px] border-black overflow-hidden shadow-[10px_10px_0px_0px_rgba(59,130,246,1)] group-hover:scale-105 transition-transform duration-500 bg-gray-100">
            <img 
              src={formData.photo || user.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} 
              style={{ filter: formData.photoFilter || user.photoFilter || 'none' }}
              className="w-full h-full object-cover transition-all duration-300" 
              alt={user.name} 
            />
          </div>
          <button 
            onClick={() => setShowPhotoFilterStudio(true)}
            className="absolute -bottom-2 -left-2 bg-amber-400 text-black border-4 border-black rounded-2xl px-3.5 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 font-black text-xs uppercase z-10"
            title="Adjust Face Skin Tone Presets & Photo Filters"
          >
            <Sliders size={16} /> Tone Studio
          </button>
          <div className="absolute -bottom-4 right-4 w-16 h-16 bg-yellow-400 border-4 border-black rounded-2xl flex items-center justify-center text-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-bounce-slow" title="Sovereign Verified">
            ⚡
          </div>
        </div>

        <div className="flex-1 space-y-6 text-center md:text-left">
          <div className="space-y-2">
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
              <span className="px-4 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-full">Sovereign Identity</span>
              <span className="px-4 py-1 bg-blue-100 text-blue-600 border-2 border-black text-[10px] font-black uppercase tracking-widest rounded-full">Rank #{user.sovereignIndex || '??'}</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-none">{user.name}</h1>
            <p className="text-2xl font-black text-gray-400 uppercase italic">ID: {user.studentIdNumber || 'IFTU-SEC-UNK'}</p>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-8 pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 border-2 border-black rounded-xl flex items-center justify-center text-xl">🏆</div>
              <div>
                <p className="text-[10px] font-black uppercase text-gray-400">Knowledge Points</p>
                <p className="text-xl font-black">{user.points} KP</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 border-2 border-black rounded-xl flex items-center justify-center text-xl">🎓</div>
              <div>
                <p className="text-[10px] font-black uppercase text-gray-400">Education Level</p>
                <p className="text-xl font-black">{user.level || 'Secondary'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button 
            onClick={() => setActiveTab('kp_shop')}
            className="px-10 py-6 bg-green-500 text-white border-4 border-black rounded-[2rem] font-black uppercase italic text-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 transition-all flex items-center gap-4"
          >
            <ShoppingBag className="w-8 h-8" /> KP BAZAAR & REWARDS
          </button>
          <button 
            onClick={() => setActiveTab('identity')}
            className="px-10 py-6 bg-yellow-400 text-black border-4 border-black rounded-[2rem] font-black uppercase italic text-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 transition-all flex items-center gap-4"
          >
            <QrCode className="w-8 h-8" /> IDENTITY BOARD & QR
          </button>
          <button 
            onClick={() => onOpenTutor?.('', 'General Academic Query', `I am ${user.name}, a Grade ${user.grade} student in the ${user.stream} stream. I need general academic support across my registered subjects.`)}
            className="px-10 py-6 bg-indigo-600 text-white border-4 border-black rounded-[2rem] font-black uppercase italic text-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 transition-all flex items-center gap-4"
          >
            <Brain className="w-8 h-8" /> INTERROGATE AI
          </button>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`px-10 py-6 ${isEditing ? 'bg-rose-600' : 'bg-black'} text-white border-4 border-black rounded-[2rem] font-black uppercase italic text-xl shadow-[8px_8px_0px_0px_rgba(59,130,246,1)] hover:translate-y-1 transition-all flex items-center gap-4`}
          >
            {isEditing ? 'DISCARD CHANGES' : 'UPDATE PROFILE'}
          </button>
          {isEditing && (
            <button 
              onClick={handleSave}
              className="px-10 py-6 bg-green-600 text-white border-4 border-black rounded-[2rem] font-black uppercase italic text-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 transition-all flex items-center gap-4"
            >
              <Save /> COMMIT DATA
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 overflow-x-auto pb-4 custom-scrollbar">
        {[
          { id: 'overview', icon: BarChart2, label: 'Performance Matrix' },
          { id: 'progress_path', icon: Compass, label: 'Sovereign Progress Path' },
          { id: 'kp_shop', icon: ShoppingBag, label: 'KP Bazaar & Perks' },
          { id: 'identity', icon: QrCode, label: 'Identity Board & QR' },
          { id: 'academics', icon: BookOpen, label: 'Knowledge Trace' },
          { id: 'tasks', icon: ClipboardList, label: 'Academic Tasks' },
          { id: 'achievements', icon: Award, label: 'Vault of Medals' },
          { id: 'records', icon: FileText, label: 'Sovereign Records' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              if (activeTab === 'identity' && tab.id !== 'identity') {
                stopCamera();
              }
              setActiveTab(tab.id as any);
            }}
            className={`flex items-center gap-4 px-8 py-5 rounded-[2rem] border-4 border-black font-black uppercase italic transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -translate-y-1' : 'bg-white hover:bg-gray-50'}`}
          >
            <tab.icon size={20} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white border-8 border-black rounded-[5rem] p-10 md:p-16 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]"
        >
          {activeTab === 'identity' && (
            <div className="space-y-16">
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b-4 border-black pb-8">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="px-4 py-1 bg-green-500 text-white border-2 border-black rounded-full font-black text-xs uppercase tracking-widest">
                      AUTHENTICATION CORE
                    </span>
                    <span className="px-4 py-1 bg-yellow-400 text-black border-2 border-black rounded-full font-black text-xs uppercase tracking-widest">
                      QR DECODER V2.6
                    </span>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black uppercase italic mt-2">
                    Sovereign Identity Board
                  </h3>
                  <p className="text-sm font-bold text-gray-500 uppercase italic">
                    Digital ID Card • QR Scanner Verification • Status Validation
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={handleDownloadIdCard}
                    className="px-6 py-4 bg-black text-white border-4 border-black rounded-2xl font-black uppercase italic text-sm shadow-[4px_4px_0px_0px_rgba(59,130,246,1)] hover:translate-y-1 transition-all flex items-center gap-3"
                  >
                    <Download size={18} /> Download Digital ID
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Column: Digital ID Card Display */}
                <div className="lg:col-span-6 space-y-8">
                  <div className="bg-gradient-to-br from-white to-gray-50 border-8 border-black rounded-[3rem] p-8 md:p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden space-y-8">
                    {/* ID Card Top Banner */}
                    <div className="flex justify-between items-center border-b-4 border-black pb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-600 border-2 border-black rounded-xl flex items-center justify-center text-white font-black text-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                          🇪🇹
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">MINISTRY OF EDUCATION</p>
                          <h4 className="text-lg font-black uppercase italic leading-tight">NATIONAL DIGITAL SOVEREIGN ID</h4>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-green-100 text-green-700 border-2 border-black rounded-xl font-black text-[10px] uppercase">
                          ACTIVE
                        </span>
                        <button
                          onClick={() => setShowPrintableIdCardModal(true)}
                          className="px-3 py-1 bg-black text-amber-300 border-2 border-black rounded-xl font-black text-[10px] uppercase flex items-center gap-1.5 hover:bg-amber-400 hover:text-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                          title="Print official Sovereign Student ID Card"
                        >
                          <Printer size={12} /> PRINT ID
                        </button>
                      </div>
                    </div>

                    {/* ID Card Body */}
                    <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                      <div className="w-36 h-36 shrink-0 border-4 border-black rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-gray-100">
                        <img 
                          src={user.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} 
                          style={{ filter: user.photoFilter || formData.photoFilter || 'none' }}
                          className="w-full h-full object-cover transition-all" 
                          alt={user.name} 
                        />
                      </div>
                      <div className="flex-1 space-y-3 text-center sm:text-left">
                        <div>
                          <p className="text-[10px] font-black uppercase text-gray-400">STUDENT FULL NAME</p>
                          <h4 className="text-2xl font-black uppercase italic leading-tight">{user.name}</h4>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase text-gray-400">SOVEREIGN ID NUMBER</p>
                          <p className="text-sm font-black font-mono text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-black inline-block">
                            {user.studentIdNumber || `IFTU-SEC-${user.id.substring(0, 8).toUpperCase()}`}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-left">
                          <div>
                            <p className="text-[9px] font-black uppercase text-gray-400">LEVEL & GRADE</p>
                            <p className="text-xs font-black">{user.grade || 'Grade 10'}</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-black uppercase text-gray-400">NATIONAL RANK</p>
                            <p className="text-xs font-black">#{user.sovereignIndex || 1}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* QR Code Container */}
                    <div className="p-6 bg-white border-4 border-black rounded-3xl flex flex-col sm:flex-row items-center gap-6 justify-between shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                      <div className="space-y-2 text-center sm:text-left">
                        <div className="flex items-center gap-2 justify-center sm:justify-start">
                          <ShieldCheck size={18} className="text-green-600" />
                          <span className="text-xs font-black uppercase">Official QR Credential</span>
                        </div>
                        <p className="text-[11px] font-semibold text-gray-500 max-w-xs">
                          Scan this QR code using the Scanner panel to verify digital ID credentials and sovereign status.
                        </p>
                        <div className="pt-2 flex gap-2">
                          <button 
                            onClick={copyQrPayload}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border-2 border-black rounded-lg text-[10px] font-black uppercase flex items-center gap-1.5 transition-colors"
                          >
                            {copiedPayload ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                            {copiedPayload ? 'Copied Payload!' : 'Copy QR Payload'}
                          </button>
                        </div>
                      </div>

                      <div className="w-32 h-32 shrink-0 border-4 border-black rounded-2xl p-2 bg-white flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        {qrCodeDataUrl ? (
                          <img src={qrCodeDataUrl} className="w-full h-full object-contain" alt="Student QR Code" />
                        ) : (
                          <Loader2 className="animate-spin text-black" size={24} />
                        )}
                      </div>
                    </div>

                    {/* ID Footer metadata */}
                    <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-400 pt-2 border-t-2 border-dashed border-gray-300">
                      <span>ISSUER: MINISTRY OF EDUCATION</span>
                      <span>SIG: {user.id.substring(0, 10).toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Campus Check-in QR Pass Action Bar */}
                  <div className="p-6 bg-gradient-to-br from-amber-50 to-yellow-100 border-4 border-black rounded-3xl space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-center justify-between border-b-2 border-black/10 pb-3">
                      <div className="flex items-center gap-2">
                        <QrCode size={20} className="text-amber-700" />
                        <span className="text-sm font-black uppercase italic text-amber-950">Generate Campus Check-in QR Pass</span>
                      </div>
                      <span className="px-2.5 py-0.5 bg-amber-400 text-black border border-black rounded-md text-[9px] font-black uppercase">
                        Instant Entry
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-gray-700">
                      Generate an authenticated QR code pass to quickly check into physical classrooms, exam centers, or campus laboratories:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        { label: '🏫 Classroom Physical Check-in', value: 'Classroom Physical Attendance' },
                        { label: '🏛️ National Exam Hall Entry Pass', value: 'National Exam Entry Pass' },
                        { label: '🧪 Science & STEM Lab Access', value: 'STEM Video & Science Lab' },
                        { label: '📖 Campus Library Pass', value: 'Campus Sovereign Library' }
                      ].map((evt) => (
                        <button
                          key={evt.value}
                          onClick={() => handleGenerateCheckInPass(evt.value)}
                          className="p-3 bg-white hover:bg-amber-200 border-2 border-black rounded-xl font-black text-[11px] uppercase text-left transition-all flex items-center justify-between shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5"
                        >
                          <span className="truncate">{evt.label}</span>
                          <ChevronRight size={14} className="shrink-0 ml-1 text-black" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: QR Code Scanner & Verification Engine */}
                <div className="lg:col-span-6 space-y-8">
                  <div className="bg-black text-white border-8 border-black rounded-[3rem] p-8 md:p-10 shadow-[12px_12px_0px_0px_rgba(59,130,246,1)] space-y-8">
                    {/* Scanner Mode Switcher */}
                    <div className="flex justify-between items-center border-b-2 border-white/20 pb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-400 text-black border-2 border-white rounded-xl flex items-center justify-center font-black">
                          <QrCode size={20} />
                        </div>
                        <div>
                          <h4 className="text-xl font-black uppercase italic">QR Scanner Engine</h4>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Live Camera & Image File Verification</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setScanMode('camera');
                            if (!isCameraActive) startCamera();
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-black uppercase border-2 transition-all flex items-center gap-2 ${scanMode === 'camera' ? 'bg-blue-600 text-white border-white' : 'bg-gray-800 text-gray-300 border-gray-700'}`}
                        >
                          <Camera size={14} /> Camera
                        </button>
                        <button 
                          onClick={() => {
                            stopCamera();
                            setScanMode('upload');
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-black uppercase border-2 transition-all flex items-center gap-2 ${scanMode === 'upload' ? 'bg-blue-600 text-white border-white' : 'bg-gray-800 text-gray-300 border-gray-700'}`}
                        >
                          <Upload size={14} /> Upload QR
                        </button>
                      </div>
                    </div>

                    {/* Camera Feed Mode */}
                    {scanMode === 'camera' && (
                      <div className="space-y-6">
                        <div className="relative aspect-video w-full bg-gray-900 border-4 border-white rounded-3xl overflow-hidden flex items-center justify-center">
                          {isCameraActive ? (
                            <>
                              <div className="w-full h-full relative">
                                <QrReader
                                  onResult={(result, error) => {
                                    if (result) {
                                      handleScanSuccess(result.getText());
                                    }
                                  }}
                                  constraints={{ facingMode: 'environment' }}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <video 
                                ref={videoRef} 
                                className="hidden" 
                                playsInline 
                                muted 
                              />
                              <canvas ref={canvasRef} className="hidden" />
                              
                              {/* Scanning Reticle & Animation */}
                              <div className="absolute inset-0 border-[40px] border-black/50 flex items-center justify-center pointer-events-none">
                                <div className="w-48 h-48 border-4 border-dashed border-yellow-400 rounded-2xl relative animate-pulse flex items-center justify-center">
                                  <div className="w-full h-1 bg-yellow-400 absolute top-1/2 shadow-[0_0_15px_#fcd116] animate-ping" />
                                </div>
                              </div>
                              <div className="absolute bottom-4 left-4 bg-black/80 px-4 py-2 rounded-xl border border-white/20 text-[10px] font-mono text-green-400 flex items-center gap-2 pointer-events-none z-10">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                                REACT-QR-READER LIVE FEED ACTIVE...
                              </div>
                            </>
                          ) : (
                            <div className="p-8 text-center space-y-4">
                              <Camera size={48} className="mx-auto text-gray-600" />
                              <p className="text-sm font-bold text-gray-400">
                                {cameraError || "Camera feed is currently inactive. Click below to start scanning."}
                              </p>
                              <button 
                                onClick={startCamera}
                                className="px-8 py-4 bg-blue-600 text-white border-2 border-white rounded-2xl font-black uppercase italic text-sm hover:bg-blue-500 transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] flex items-center gap-2 mx-auto"
                              >
                                <Camera size={18} /> Enable Camera Scanner
                              </button>
                            </div>
                          )}
                        </div>

                        {isCameraActive && (
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-mono text-gray-400 uppercase">Align QR Code inside the box</span>
                            <button 
                              onClick={stopCamera}
                              className="px-4 py-2 bg-rose-600 text-white border border-white rounded-xl text-xs font-black uppercase"
                            >
                              Stop Camera
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Upload File Mode */}
                    {scanMode === 'upload' && (
                      <div className="space-y-6">
                        <div 
                          onClick={() => qrFileInputRef.current?.click()}
                          className="aspect-video w-full bg-gray-900 border-4 border-dashed border-gray-600 hover:border-yellow-400 rounded-3xl flex flex-col items-center justify-center p-8 cursor-pointer transition-colors text-center space-y-4 group"
                        >
                          <div className="w-16 h-16 bg-gray-800 border-2 border-white/20 rounded-2xl flex items-center justify-center text-yellow-400 group-hover:scale-110 transition-transform">
                            <Upload size={32} />
                          </div>
                          <div>
                            <p className="font-black text-sm uppercase">Upload Digital ID Card or QR Image</p>
                            <p className="text-xs text-gray-400 mt-1">Supports PNG, JPG, WEBP formats</p>
                          </div>
                        </div>
                        <input 
                          type="file" 
                          ref={qrFileInputRef} 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleQrImageUpload} 
                        />
                      </div>
                    )}

                    {/* Quick Simulation / Test Button */}
                    <div className="pt-4 border-t border-white/10 flex flex-wrap gap-3 items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-gray-400">Quick Test Scan:</span>
                      <button 
                        onClick={() => handleScanSuccess(studentQrPayload)}
                        className="px-4 py-2 bg-yellow-400 text-black border border-white rounded-xl font-black uppercase text-xs hover:bg-yellow-300 transition-colors"
                      >
                        Scan My Digital ID
                      </button>
                    </div>
                  </div>

                  {/* Verification Results Display */}
                  {scanResult && (
                    <div className={`border-8 border-black rounded-[3rem] p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] space-y-6 ${scanResult.isValidSovereignId ? 'bg-green-50' : 'bg-rose-50'}`}>
                      <div className="flex justify-between items-start border-b-4 border-black pb-4">
                        <div className="flex items-center gap-3">
                          {scanResult.isValidSovereignId ? (
                            <div className="w-10 h-10 bg-green-600 text-white border-2 border-black rounded-xl flex items-center justify-center">
                              <CheckCircle2 size={24} />
                            </div>
                          ) : (
                            <div className="w-10 h-10 bg-rose-600 text-white border-2 border-black rounded-xl flex items-center justify-center">
                              <AlertTriangle size={24} />
                            </div>
                          )}
                          <div>
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-black ${scanResult.isValidSovereignId ? 'bg-green-200 text-green-800' : 'bg-rose-200 text-rose-800'}`}>
                              {scanResult.isValidSovereignId ? 'VERIFIED SOVEREIGN ID' : 'UNRECOGNIZED QR PAYLOAD'}
                            </span>
                            <h4 className="text-2xl font-black uppercase italic leading-tight mt-1">
                              {scanResult.parsedData?.name || 'External Digital ID'}
                            </h4>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-gray-500">
                          {scanResult.verifiedAt}
                        </span>
                      </div>

                      {/* Verification Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
                        <div className="p-4 bg-white border-2 border-black rounded-2xl">
                          <p className="text-[9px] uppercase text-gray-400">Student ID</p>
                          <p className="font-mono text-sm font-black">{scanResult.parsedData?.studentId || 'N/A'}</p>
                        </div>
                        <div className="p-4 bg-white border-2 border-black rounded-2xl">
                          <p className="text-[9px] uppercase text-gray-400">Sovereign Index</p>
                          <p className="font-mono text-sm font-black">#{scanResult.parsedData?.sovereignIndex || '??'}</p>
                        </div>
                        <div className="p-4 bg-white border-2 border-black rounded-2xl">
                          <p className="text-[9px] uppercase text-gray-400">Level & Grade</p>
                          <p className="font-black">{scanResult.parsedData?.grade || 'Grade 10'}</p>
                        </div>
                        <div className="p-4 bg-white border-2 border-black rounded-2xl">
                          <p className="text-[9px] uppercase text-gray-400">Self Match Check</p>
                          <p className={`font-black ${scanResult.isSelfMatch ? 'text-green-600' : 'text-blue-600'}`}>
                            {scanResult.isSelfMatch ? '✓ CONFIRMED OWN PROFILE' : 'ℹ️ SCANNED THIRD-PARTY ID'}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-white border-2 border-black rounded-2xl space-y-1">
                        <p className="text-[9px] uppercase text-gray-400">Verification Hash Token</p>
                        <p className="font-mono text-[11px] text-gray-600 break-all">{scanResult.verificationCode}</p>
                      </div>
                    </div>
                  )}

                  {/* Audit History Log */}
                  {recentScans.length > 0 && (
                    <div className="p-6 bg-gray-50 border-4 border-black rounded-3xl space-y-4">
                      <h5 className="text-sm font-black uppercase italic">Recent Verification Audits</h5>
                      <div className="space-y-2">
                        {recentScans.map((scan, i) => (
                          <div key={i} className="p-3 bg-white border-2 border-black rounded-xl flex justify-between items-center text-xs">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${scan.isValidSovereignId ? 'bg-green-500' : 'bg-rose-500'}`} />
                              <span className="font-black">{scan.parsedData?.name || 'Scanned ID'}</span>
                            </div>
                            <span className="font-mono text-[10px] text-gray-400">{scan.verifiedAt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Campus Check-in Pass Modal */}
                  <AnimatePresence>
                    {showCheckInModal && eventQrPassUrl && (
                      <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[9000] p-4">
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.9, opacity: 0 }}
                          className="bg-white border-8 border-black rounded-[3rem] p-8 md:p-10 max-w-md w-full shadow-[24px_24px_0px_0px_rgba(0,0,0,1)] space-y-6 relative text-black"
                        >
                          <button 
                            onClick={() => setShowCheckInModal(false)}
                            className="absolute top-6 right-6 w-10 h-10 bg-black text-white rounded-2xl border-2 border-black font-black text-lg hover:bg-gray-800 transition-colors flex items-center justify-center"
                          >
                            ✕
                          </button>

                          <div className="text-center space-y-2 border-b-4 border-black pb-4">
                            <span className="px-3 py-1 bg-amber-400 text-black border border-black rounded-full text-[10px] font-black uppercase tracking-widest">
                              OFFICIAL CHECK-IN PASS
                            </span>
                            <h3 className="text-2xl font-black uppercase italic text-black">{checkInEventType}</h3>
                            <p className="text-[10px] font-bold text-gray-500 uppercase">
                              Issued: {checkInTimestamp}
                            </p>
                          </div>

                          <div className="bg-amber-50 border-4 border-black rounded-3xl p-6 flex flex-col items-center justify-center space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                            <div className="w-56 h-56 bg-white border-4 border-black rounded-2xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
                              <img src={eventQrPassUrl} className="w-full h-full object-contain" alt="Check-in QR Pass" />
                            </div>
                            <div className="text-center space-y-1">
                              <p className="text-xs font-black uppercase text-black">{user.name}</p>
                              <p className="text-[10px] font-mono font-bold text-blue-600 bg-white px-3 py-0.5 rounded-md border border-black inline-block">
                                ID: {user.studentIdNumber || `IFTU-SEC-${user.id.substring(0, 8).toUpperCase()}`}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(checkInPassPayload);
                                setCopiedPassPayload(true);
                                setTimeout(() => setCopiedPassPayload(false), 2000);
                              }}
                              className="w-full py-3 bg-black text-white border-4 border-black rounded-2xl font-black uppercase italic text-xs shadow-[4px_4px_0px_0px_rgba(59,130,246,1)] hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                            >
                              {copiedPassPayload ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                              {copiedPassPayload ? 'Pass Token Copied!' : 'Copy Pass Payload Token'}
                            </button>

                            <button
                              onClick={() => setShowCheckInModal(false)}
                              className="w-full py-3 bg-gray-200 text-black border-4 border-black rounded-2xl font-black uppercase italic text-xs hover:bg-gray-300 transition-colors"
                            >
                              Done & Close
                            </button>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-12">
              {/* Sovereign Progress Path Banner */}
              <div 
                onClick={() => setActiveTab('progress_path')}
                className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 border-8 border-black rounded-[3rem] p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden group"
              >
                <div className="flex items-center gap-6 z-10">
                  <div className="w-16 h-16 bg-black text-amber-300 border-4 border-black rounded-3xl flex items-center justify-center text-3xl shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] group-hover:scale-110 transition-transform">
                    <Compass size={36} className="animate-spin-slow text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-0.5 bg-black text-amber-300 border border-black rounded-md text-[9px] font-black uppercase tracking-wider">
                        ADUU GANAMA ROADMAP
                      </span>
                      <span className="px-3 py-0.5 bg-white text-black border border-black rounded-md text-[9px] font-black uppercase tracking-wider">
                        SOVEREIGN INDEX
                      </span>
                    </div>
                    <h4 className="text-2xl md:text-3xl font-black uppercase italic text-black mt-1">
                      View Sovereign Progress Path
                    </h4>
                    <p className="text-xs font-bold text-black/80 uppercase">
                      Track your level milestones, knowledge points, and regional academic roadmap
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 z-10">
                  <button className="px-6 py-3 bg-black text-white border-4 border-black rounded-2xl font-black uppercase italic text-xs shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] group-hover:bg-amber-950 flex items-center gap-2">
                    Open Roadmap <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b-4 border-black pb-8">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="px-4 py-1 bg-blue-600 text-white border-2 border-black rounded-full font-black text-xs uppercase tracking-widest">
                      SOVEREIGN ANALYTICS
                    </span>
                    <span className="px-4 py-1 bg-green-100 text-green-700 border-2 border-black rounded-full font-black text-xs uppercase tracking-widest">
                      RECHARTS V2.8
                    </span>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black uppercase italic mt-2">
                    Dynamic Study Progress
                  </h3>
                  <p className="text-sm font-bold text-gray-500 uppercase italic">
                    Real-time tracking of completed courses, exam scores, and knowledge milestones
                  </p>
                </div>

                {/* Top Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
                  <div className="p-4 bg-blue-50 border-2 border-black rounded-2xl text-center">
                    <p className="text-[9px] font-black uppercase text-gray-400">Avg Exam Score</p>
                    <p className="text-2xl font-black text-blue-600">
                      {examResults.length > 0 
                        ? Math.round(examResults.reduce((acc, curr) => acc + (curr.score / curr.totalPoints) * 100, 0) / examResults.length)
                        : 86}%
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 border-2 border-black rounded-2xl text-center">
                    <p className="text-[9px] font-black uppercase text-gray-400">Courses Finished</p>
                    <p className="text-2xl font-black text-green-600">{completedCourses.length} / {allCourses.length}</p>
                  </div>
                  <div className="p-4 bg-amber-50 border-2 border-black rounded-2xl text-center">
                    <p className="text-[9px] font-black uppercase text-gray-400">Knowledge Points</p>
                    <p className="text-2xl font-black text-amber-600">{user.points} KP</p>
                  </div>
                  <div className="p-4 bg-purple-50 border-2 border-black rounded-2xl text-center">
                    <p className="text-[9px] font-black uppercase text-gray-400">Lessons Finished</p>
                    <p className="text-2xl font-black text-purple-600">{user.completedLessons?.length || 0}</p>
                  </div>
                </div>
              </div>

              {/* Chart View Metric Switchers */}
              <div className="flex flex-wrap gap-3 bg-gray-100 p-2 border-4 border-black rounded-2xl">
                {[
                  { id: 'score', label: '📈 Exam Score Trajectory (%)', icon: TrendingUp },
                  { id: 'progress', label: '📚 Course & Lesson Progress', icon: Layers },
                  { id: 'kp_growth', label: '⚡ Knowledge Point Milestones', icon: Zap },
                  { id: 'subjects', label: '🎯 Subject Mastery Breakdown', icon: PieChart },
                ].map(metric => (
                  <button
                    key={metric.id}
                    onClick={() => setChartMetric(metric.id as any)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-black uppercase italic text-xs border-2 transition-all ${
                      chartMetric === metric.id 
                        ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(59,130,246,1)]' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    <metric.icon size={16} />
                    {metric.label}
                  </button>
                ))}
              </div>

              {/* Dynamic Recharts Visualization Container */}
              <div className="bg-white border-8 border-black rounded-[3rem] p-6 md:p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] space-y-6">
                <div className="flex justify-between items-center border-b-2 border-gray-100 pb-4">
                  <div>
                    <h4 className="text-2xl font-black uppercase italic">
                      {chartMetric === 'score' && 'Exam Score Trajectory over Time'}
                      {chartMetric === 'progress' && 'Cumulative Course & Lesson Completion'}
                      {chartMetric === 'kp_growth' && 'Knowledge Point (KP) Accumulation Curve'}
                      {chartMetric === 'subjects' && 'Subject Average Performance vs Benchmarks'}
                    </h4>
                    <p className="text-xs font-bold text-gray-400 uppercase">
                      {chartMetric === 'score' && 'Comparing completed assessment scores against national 75% threshold target'}
                      {chartMetric === 'progress' && 'Tracking completed courses & lessons over study stages'}
                      {chartMetric === 'kp_growth' && 'Milestone KP accumulated through assignments, exams, and courses'}
                      {chartMetric === 'subjects' && 'Aggregated STEM and language performance metrics'}
                    </p>
                  </div>
                </div>

                <div className="h-[380px] w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartMetric === 'score' ? (
                      <AreaChart data={examTrajectoryData}>
                        <defs>
                          <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="date" stroke="#000" fontSize={12} fontWeight="bold" />
                        <YAxis stroke="#000" fontSize={12} fontWeight="bold" domain={[0, 100]} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#fff', 
                            border: '4px solid black', 
                            borderRadius: '1.2rem',
                            fontWeight: 'bold',
                            boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)'
                          }}
                          formatter={(val: any) => [`${val}%`, 'Score']}
                        />
                        <ReferenceLine y={75} stroke="#f59e0b" strokeWidth={3} strokeDasharray="5 5" label={{ value: 'National Target (75%)', fill: '#d97706', fontWeight: 'bold', fontSize: 10 }} />
                        <Area type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={5} fillOpacity={1} fill="url(#scoreGradient)" />
                      </AreaChart>
                    ) : chartMetric === 'progress' ? (
                      <BarChart data={courseProgressData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="stage" stroke="#000" fontSize={12} fontWeight="bold" />
                        <YAxis stroke="#000" fontSize={12} fontWeight="bold" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#fff', 
                            border: '4px solid black', 
                            borderRadius: '1.2rem',
                            fontWeight: 'bold',
                            boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)'
                          }}
                        />
                        <Bar dataKey="lessonsFinished" name="Lessons Completed" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="coursesCompleted" name="Courses Completed" fill="#10b981" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    ) : chartMetric === 'kp_growth' ? (
                      <AreaChart data={kpGrowthData}>
                        <defs>
                          <linearGradient id="kpGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="milestone" stroke="#000" fontSize={12} fontWeight="bold" />
                        <YAxis stroke="#000" fontSize={12} fontWeight="bold" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#fff', 
                            border: '4px solid black', 
                            borderRadius: '1.2rem',
                            fontWeight: 'bold',
                            boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)'
                          }}
                          formatter={(val: any) => [`${val} KP`, 'Knowledge Points']}
                        />
                        <Area type="monotone" dataKey="kpTotal" stroke="#d97706" strokeWidth={5} fillOpacity={1} fill="url(#kpGradient)" />
                      </AreaChart>
                    ) : (
                      <BarChart data={subjectMasteryData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="subject" stroke="#000" fontSize={12} fontWeight="bold" />
                        <YAxis stroke="#000" fontSize={12} fontWeight="bold" domain={[0, 100]} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#fff', 
                            border: '4px solid black', 
                            borderRadius: '1.2rem',
                            fontWeight: 'bold',
                            boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)'
                          }}
                          formatter={(val: any) => [`${val}%`, 'Score']}
                        />
                        <Bar dataKey="avgScore" name="Student Avg %" fill="#4f46e5" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="target" name="Target Benchmark %" fill="#cbd5e1" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Grid with AI Learning Hub and Verification info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-indigo-50 border-4 border-black rounded-[3rem] space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl border-2 border-black flex items-center justify-center text-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">🤖</div>
                      <h4 className="text-xl font-black uppercase italic tracking-tighter">AI Learning Hub</h4>
                    </div>
                    <Sparkles size={24} className="text-indigo-600 animate-pulse" />
                  </div>
                  
                  <div className="space-y-4">
                    {allCourses.filter(c => user.enrolledExams?.includes(c.id) || user.completedCourses?.includes(c.id)).length > 0 ? (
                      <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase text-gray-400">Launch Contextual Session</p>
                        <div className="grid grid-cols-1 gap-3">
                          {allCourses
                            .filter(c => user.enrolledExams?.includes(c.id) || user.completedCourses?.includes(c.id))
                            .slice(0, 3)
                            .map(course => (
                              <button 
                                key={course.id}
                                onClick={() => onOpenTutor?.(`Course Content for ${course.title} (${course.code}). Subject: ${course.subject}. Grade: ${course.grade}.`, `AI Tutor: ${course.title}`, `I want to deep dive into ${course.title}. Please provide a comprehensive overview and prepare some interactive challenges for me.`)}
                                className="w-full p-4 bg-white border-4 border-black rounded-2xl flex items-center justify-between group hover:border-indigo-600 transition-all text-left"
                              >
                                <div>
                                  <p className="text-[8px] font-black text-indigo-600 uppercase">{course.code}</p>
                                  <h5 className="font-black text-xs uppercase truncate max-w-[150px]">{course.title}</h5>
                                </div>
                                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                              </button>
                            ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 bg-white border-4 border-black rounded-[2.5rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                          <Brain size={48} />
                        </div>
                        <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">General AI Session</p>
                        <h5 className="text-xl font-black uppercase italic leading-tight mt-1">Sovereign Foundation Help</h5>
                        <p className="text-xs font-medium text-gray-500 mt-3 leading-relaxed">Engage with IFTU AI for general study guidance and academic roadmap planning.</p>
                        <button 
                          onClick={() => onOpenTutor?.('IFTU Sovereign LMS is a digital education platform.', 'IFTU AI Support', 'Help me plan my study roadmap for this semester.')}
                          className="w-full mt-6 py-4 bg-indigo-600 text-white rounded-2xl border-4 border-black font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-3"
                        >
                          <Sparkles size={16} /> Launch Session →
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-8 bg-blue-50 border-4 border-black rounded-[3rem] space-y-4">
                  <h4 className="text-xl font-black uppercase italic">Identity Verification</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { icon: Mail, label: 'Primary Email', value: user.email },
                      { icon: Phone, label: 'Contact Node', value: user.phoneNumber || 'NOT_CONNECTED' },
                      { icon: MapPin, label: 'Locality', value: user.address || user.school || 'Unmapped' },
                      { icon: Calendar, label: 'Date of Birth', value: user.dob || 'Unknown' },
                      { icon: UserIcon, label: 'Gender', value: user.gender || 'Unknown' },
                      { icon: ShieldCheck, label: 'Security State', value: 'REGISTRY_LOCKED' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <item.icon size={18} className="text-blue-500" />
                        <div>
                          <p className="text-[8px] font-black uppercase text-gray-400">{item.label}</p>
                          <p className="font-black italic">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {isEditing && (
                  <div className="p-8 bg-yellow-50 border-4 border-black rounded-[3rem] space-y-4">
                    <h4 className="text-xl font-black uppercase italic">Mutation Core</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Display Name</label>
                        <input name="name" value={formData.name} onChange={handleInputChange} className="w-full p-4 border-4 border-black rounded-2xl font-black text-sm" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Student ID Number</label>
                        <input name="studentIdNumber" value={formData.studentIdNumber || ''} onChange={handleInputChange} className="w-full p-4 border-4 border-black rounded-2xl font-black text-sm" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Date of Birth</label>
                        <input type="date" name="dob" value={formData.dob || ''} onChange={handleInputChange} className="w-full p-4 border-4 border-black rounded-2xl font-black text-sm" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Gender</label>
                        <select name="gender" value={formData.gender || ''} onChange={handleInputChange} className="w-full p-4 border-4 border-black rounded-2xl font-black text-sm">
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Phone Link</label>
                        <input name="phoneNumber" value={formData.phoneNumber || ''} onChange={handleInputChange} className="w-full p-4 border-4 border-black rounded-2xl font-black text-sm" />
                      </div>
                    </div>

                    {/* Skin Tone & Photo Filter Presets in Form */}
                    <div className="pt-4 border-t-2 border-black/10 space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-[11px] font-black uppercase text-gray-700 flex items-center gap-2">
                          <Sliders size={14} className="text-amber-600" /> Skin Tone Intensity & Photo Filter Preset
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowPhotoFilterStudio(true)}
                          className="px-3 py-1 bg-amber-400 text-black border-2 border-black rounded-lg text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                        >
                          Open Photo Studio Studio →
                        </button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <button
                          type="button"
                          onClick={() => applyPreset('magaala')}
                          className={`p-2.5 rounded-xl border-2 border-black font-black text-[10px] uppercase transition-all text-center ${selectedPreset === 'magaala' ? 'bg-amber-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white hover:bg-amber-50 text-gray-800'}`}
                        >
                          🏽 Magaala (Less Red)
                        </button>
                        <button
                          type="button"
                          onClick={() => applyPreset('golden')}
                          className={`p-2.5 rounded-xl border-2 border-black font-black text-[10px] uppercase transition-all text-center ${selectedPreset === 'golden' ? 'bg-yellow-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white hover:bg-yellow-50 text-gray-800'}`}
                        >
                          ☀️ Aduu Ganama
                        </button>
                        <button
                          type="button"
                          onClick={() => applyPreset('bronze')}
                          className={`p-2.5 rounded-xl border-2 border-black font-black text-[10px] uppercase transition-all text-center ${selectedPreset === 'bronze' ? 'bg-orange-300 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white hover:bg-orange-50 text-gray-800'}`}
                        >
                          🌙 Deep Bronze
                        </button>
                        <button
                          type="button"
                          onClick={() => applyPreset('natural')}
                          className={`p-2.5 rounded-xl border-2 border-black font-black text-[10px] uppercase transition-all text-center ${selectedPreset === 'natural' ? 'bg-emerald-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white hover:bg-emerald-50 text-gray-800'}`}
                        >
                          🌿 Natural Reset
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'progress_path' && (
            <ProgressPath 
              user={user} 
              courses={allCourses}
              onNavigateToCourse={(cId) => onNavClick?.('courses')}
              onNavigateToExams={() => onNavClick?.('exams')}
              onNavigateToShop={() => setActiveTab('kp_shop')}
            />
          )}

          {activeTab === 'kp_shop' && (
            <RedemptionShop 
              user={user} 
              onUpdateUser={onUpdateUser} 
              allCourses={allCourses}
              onNavigateToCourse={(cId) => onNavClick?.('courses')}
            />
          )}

          {activeTab === 'academics' && (
            <div className="space-y-12">
              <div className="flex justify-between items-center border-b-4 border-black pb-8">
                <h3 className="text-4xl font-black uppercase italic">Completed Curricula</h3>
                <span className="px-4 py-2 bg-black text-white rounded-xl text-xs font-black">{completedCourses.length} Artifacts Collected</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {completedCourses.map(course => (
                  <div key={course.id} className="p-8 bg-gray-50 border-4 border-black rounded-[3rem] flex gap-6 hover:translate-x-2 transition-all">
                    <div className="w-24 h-24 shrink-0 border-4 border-black rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <img src={course.thumbnail} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h4 className="text-2xl font-black uppercase italic leading-none">{course.title}</h4>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{course.code} • {course.subject}</p>
                      <div className="flex items-center gap-2 pt-2">
                        <div className="h-2 flex-1 bg-gray-200 border-2 border-black rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 w-full"></div>
                        </div>
                        <span className="text-[10px] font-black uppercase">100%</span>
                      </div>
                    </div>
                  </div>
                ))}
                {completedCourses.length === 0 && (
                   <div className="md:col-span-2 py-32 text-center bg-slate-50 border-4 border-dashed border-slate-200 rounded-[3rem] space-y-6">
                     <BookOpen size={48} className="mx-auto text-slate-300" />
                     <p className="text-2xl font-black uppercase italic text-slate-400">No Courses Completed Yet</p>
                   </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-12">
              <div className="flex justify-between items-center border-b-4 border-black pb-8">
                <h3 className="text-4xl font-black uppercase italic">Pending Deliverables</h3>
                <button 
                  onClick={() => onNavClick?.('assignments')}
                  className="px-6 py-3 bg-black text-white rounded-xl text-xs font-black hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <ExternalLink size={14} /> Full Assignment Portal
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {assignments
                  .filter(a => {
                    const course = allCourses.find(c => c.code === a.courseCode);
                    return course && course.grade === user.grade;
                  })
                  .map(assignment => {
                    const submission = submissions.find(s => s.assignmentId === assignment.id && s.studentId === user.id);
                    const isOverdue = new Date(assignment.dueDate) < new Date() && !submission;
                    
                    return (
                      <div key={assignment.id} className="p-8 bg-gray-50 border-4 border-black rounded-[3rem] flex flex-col md:flex-row justify-between items-center gap-8 group hover:bg-white transition-all shadow-[10px_10px_0px_0px_rgba(0,0,0,0.05)] hover:shadow-[10px_10px_0px_0px_rgba(59,130,246,1)]">
                        <div className="flex items-center gap-6">
                          <div className={`w-16 h-16 rounded-2xl border-4 border-black flex items-center justify-center text-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${submission?.status === 'graded' ? 'bg-green-100' : 'bg-white'}`}>
                            {submission?.status === 'graded' ? '✅' : '📝'}
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-2xl font-black italic">{assignment.title}</h4>
                            <div className="flex flex-wrap gap-4 items-center">
                              <span className="px-2 py-1 bg-blue-100 border-2 border-black rounded-lg text-[8px] font-black uppercase">{assignment.courseCode}</span>
                              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                                <Clock size={12} /> Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                {isOverdue && <span className="text-rose-600 ml-2">⚠️ OVERDUE</span>}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-4 w-full md:w-auto">
                          <button 
                            onClick={() => onNavClick?.('assignments')}
                            className={`flex-1 md:flex-none px-8 py-4 border-4 border-black rounded-2xl font-black uppercase italic text-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 transition-all flex items-center gap-4 ${submission ? 'bg-green-100 text-green-700' : 'bg-yellow-400 text-black'}`}
                          >
                            {submission ? (submission.status === 'graded' ? 'View Grade' : 'Update Deployment') : 'Submit Work'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                {assignments.filter(a => {
                    const course = allCourses.find(c => c.code === a.courseCode);
                    return course && course.grade === user.grade;
                  }).length === 0 && (
                   <div className="py-40 text-center bg-slate-50 border-4 border-dashed border-slate-200 rounded-[5rem] space-y-6">
                     <ClipboardList size={48} className="mx-auto text-slate-300" />
                     <p className="text-2xl font-black uppercase italic text-slate-400">No Assignments Found</p>
                   </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-12">
              <div className="flex justify-between items-center border-b-4 border-black pb-8">
                <h3 className="text-4xl font-black uppercase italic">Vault of Achievements</h3>
                <span className="px-4 py-2 bg-yellow-400 border-2 border-black rounded-xl text-xs font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">GLORY TRACE</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                {user.badges?.map(badge => (
                  <div key={badge.id} className="group aspect-square p-8 bg-white border-8 border-black rounded-[3rem] flex flex-col items-center justify-center text-center shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-yellow-50 hover:-translate-y-2 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-yellow-400"></div>
                    <span className="text-6xl mb-4 group-hover:scale-125 transition-transform duration-500">{badge.icon}</span>
                    <h4 className="text-sm font-black uppercase italic leading-tight">{badge.title}</h4>
                    <p className="text-[8px] font-black text-gray-400 uppercase mt-2">{new Date(badge.earnedAt).getFullYear()}</p>
                  </div>
                ))}
                {(!user.badges || user.badges.length === 0) && (
                   <div className="col-span-full py-32 text-center bg-slate-50 border-4 border-dashed border-slate-200 rounded-[3rem] space-y-6">
                     <Award size={48} className="mx-auto text-slate-300" />
                     <p className="text-2xl font-black uppercase italic text-slate-400">Vault Currently Empty</p>
                   </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'records' && (
            <div className="space-y-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b-4 border-black pb-8">
                <div>
                  <h3 className="text-4xl font-black uppercase italic">Sovereign Registry</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Permanent Academic Archiving System</p>
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-10 py-5 bg-blue-600 text-white border-4 border-black rounded-2xl font-black uppercase italic text-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 transition-all flex items-center gap-4 disabled:opacity-50"
                >
                  {uploading ? <Loader2 className="animate-spin" /> : <Upload />} {uploading ? `DEPLOYING (${Math.round(uploadProgress)}%)...` : 'DEPLOY NEW RECORD'}
                </button>
                {uploading && (
                  <div className="w-full max-w-md mt-4">
                    <div className="h-4 bg-gray-100 border-4 border-black rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        className="h-full bg-blue-600"
                      />
                    </div>
                  </div>
                )}
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
              </div>

              <div className="grid grid-cols-1 gap-6">
                {(user.academicRecords || []).map(record => (
                  <div key={record.id} className="p-8 bg-gray-50 border-4 border-black rounded-[3rem] flex flex-col md:flex-row justify-between items-center gap-8 group hover:bg-white transition-all shadow-[10px_10px_0px_0px_rgba(0,0,0,0.05)] hover:shadow-[10px_10px_0px_0px_rgba(59,130,246,1)]">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white border-4 border-black rounded-2xl flex items-center justify-center text-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <FileText />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-2xl font-black italic">{record.name}</h4>
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                          {new Date(record.uploadedAt).toLocaleString()} • {(record.size || 0) / 1024 < 1024 ? `${((record.size || 0)/1024).toFixed(1)} KB` : `${((record.size || 0)/(1024*1024)).toFixed(1)} MB`}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <a 
                        href={record.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-5 bg-white border-4 border-black rounded-2xl hover:bg-blue-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1"
                        title="Decipher/View Record"
                      >
                        <ExternalLink size={24} />
                      </a>
                      <button 
                        onClick={() => handleDeleteRecord(record.id)}
                        className="p-5 bg-rose-50 border-4 border-black text-rose-600 rounded-2xl hover:bg-rose-100 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1"
                        title="Purge Artifact"
                      >
                        <Trash2 size={24} />
                      </button>
                    </div>
                  </div>
                ))}
                
                {(!user.academicRecords || user.academicRecords.length === 0) && (
                   <div className="py-40 text-center bg-slate-50 border-4 border-dashed border-slate-200 rounded-[5rem] space-y-6">
                     <FileText size={48} className="mx-auto text-slate-300" />
                     <p className="text-2xl font-black uppercase italic text-slate-400">No Records Salvaged</p>
                     <p className="text-xs font-black uppercase text-slate-300 max-w-md mx-auto">Upload diplomas, transcripts, or certificates to secure your academic footprint.</p>
                   </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Photo Processing & Skin Tone Studio Modal Overlay */}
      {showPhotoFilterStudio && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-8 animate-fadeIn">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white border-8 border-black rounded-[3.5rem] p-6 md:p-10 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-[24px_24px_0px_0px_rgba(0,0,0,1)] space-y-8"
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b-4 border-black pb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-amber-400 border-4 border-black rounded-2xl flex items-center justify-center text-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  🎨
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-0.5 bg-black text-amber-300 border border-black rounded-md text-[9px] font-black uppercase tracking-widest">
                      SUURAA & FUULA STUDIO
                    </span>
                    <span className="px-3 py-0.5 bg-green-100 text-green-700 border border-black rounded-md text-[9px] font-black uppercase tracking-widest">
                      Real-time Processing
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-4xl font-black uppercase italic text-black leading-tight">
                    Photo Processing & Skin Tone Studio
                  </h3>
                </div>
              </div>
              <button 
                onClick={() => setShowPhotoFilterStudio(false)}
                className="w-12 h-12 bg-gray-100 hover:bg-rose-500 hover:text-white border-4 border-black rounded-2xl flex items-center justify-center font-black text-xl transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                ✕
              </button>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Left Column: Live Avatar Preview */}
              <div className="md:col-span-5 bg-gradient-to-br from-amber-50 to-orange-50 border-4 border-black rounded-[2.5rem] p-6 text-center space-y-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <span className="px-4 py-1 bg-black text-amber-300 border border-black rounded-full text-[10px] font-black uppercase tracking-widest inline-block">
                  LIVE PHOTO PREVIEW
                </span>
                <div className="relative mx-auto w-48 h-48 md:w-56 md:h-56 rounded-full border-[8px] border-black overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gray-200">
                  <img 
                    src={formData.photo || user.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} 
                    style={{ filter: computeFilterString(brightness, contrast, saturation, hueRotate, sepia) }}
                    className="w-full h-full object-cover transition-all duration-300" 
                    alt="Live Photo Tone Preview" 
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black uppercase tracking-wider text-black">
                    Preset Mode: <span className="text-blue-700 underline font-black">{selectedPreset.toUpperCase()}</span>
                  </p>
                  <p className="text-[10px] font-bold text-gray-600 italic">
                    {selectedPreset === 'magaala' && '🏽 Magaala: Redness reduced, warm tan Ethiopian brown balance'}
                    {selectedPreset === 'golden' && '☀️ Aduu Ganama: Golden warm sunburst brightness'}
                    {selectedPreset === 'natural' && '🌿 Sovereign Natural: Original unedited photo capture'}
                    {selectedPreset === 'bronze' && '🌙 Deep Bronze: Deep rich bronze brown tone'}
                    {selectedPreset === 'studio' && '⚡ High Contrast Studio: Sharp contrast & clarity'}
                    {selectedPreset === 'custom' && '🎨 Custom Fine-Tuned Settings'}
                  </p>
                </div>
              </div>

              {/* Right Column: Presets & Controls */}
              <div className="md:col-span-7 space-y-6">
                {/* Skin Tone Presets */}
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center justify-between">
                    <span>Skin Tone Presets</span>
                    <span className="text-[10px] text-amber-800 bg-amber-200 px-2 py-0.5 rounded border border-black font-black">Recommended: Magaala</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => applyPreset('magaala')}
                      className={`p-3.5 rounded-2xl border-4 border-black font-black text-left text-xs uppercase transition-all flex items-center justify-between ${selectedPreset === 'magaala' ? 'bg-amber-400 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-gray-50 hover:bg-amber-50 text-gray-800'}`}
                    >
                      <div>
                        <div className="font-black">🏽 Magaala Tone</div>
                        <div className="text-[9px] font-bold opacity-80 normal-case">Warm Tan • Less Red</div>
                      </div>
                      {selectedPreset === 'magaala' && <Check size={18} className="shrink-0" />}
                    </button>

                    <button
                      onClick={() => applyPreset('golden')}
                      className={`p-3.5 rounded-2xl border-4 border-black font-black text-left text-xs uppercase transition-all flex items-center justify-between ${selectedPreset === 'golden' ? 'bg-yellow-400 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-gray-50 hover:bg-yellow-50 text-gray-800'}`}
                    >
                      <div>
                        <div className="font-black">☀️ Aduu Ganama</div>
                        <div className="text-[9px] font-bold opacity-80 normal-case">Golden Sunburst</div>
                      </div>
                      {selectedPreset === 'golden' && <Check size={18} className="shrink-0" />}
                    </button>

                    <button
                      onClick={() => applyPreset('bronze')}
                      className={`p-3.5 rounded-2xl border-4 border-black font-black text-left text-xs uppercase transition-all flex items-center justify-between ${selectedPreset === 'bronze' ? 'bg-orange-300 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-gray-50 hover:bg-orange-50 text-gray-800'}`}
                    >
                      <div>
                        <div className="font-black">🌙 Deep Bronze</div>
                        <div className="text-[9px] font-bold opacity-80 normal-case">Rich Brown Tone</div>
                      </div>
                      {selectedPreset === 'bronze' && <Check size={18} className="shrink-0" />}
                    </button>

                    <button
                      onClick={() => applyPreset('natural')}
                      className={`p-3.5 rounded-2xl border-4 border-black font-black text-left text-xs uppercase transition-all flex items-center justify-between ${selectedPreset === 'natural' ? 'bg-emerald-400 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-gray-50 hover:bg-emerald-50 text-gray-800'}`}
                    >
                      <div>
                        <div className="font-black">🌿 Natural Reset</div>
                        <div className="text-[9px] font-bold opacity-80 normal-case">Original Photo</div>
                      </div>
                      {selectedPreset === 'natural' && <Check size={18} className="shrink-0" />}
                    </button>
                  </div>
                </div>

                {/* Fine-Tuning Sliders */}
                <div className="p-5 bg-gray-50 border-4 border-black rounded-3xl space-y-4">
                  <div className="flex justify-between items-center border-b-2 border-gray-200 pb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-2">
                      <Sliders size={14} /> Color & Filter Controls
                    </span>
                    <button 
                      onClick={() => applyPreset('natural')}
                      className="text-[10px] font-black uppercase text-gray-500 hover:text-black underline"
                    >
                      Reset Sliders
                    </button>
                  </div>

                  {/* Redness Shift */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-black uppercase">
                      <span>Redness Reduction (Hue Shift)</span>
                      <span className="text-blue-600 font-mono">{hueRotate}°</span>
                    </div>
                    <input 
                      type="range" 
                      min="-20" 
                      max="20" 
                      value={hueRotate}
                      onChange={e => handleSliderChange('hueRotate', Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[8px] text-gray-400 font-bold uppercase">
                      <span>Cooler (Less Red)</span>
                      <span>Neutral</span>
                      <span>Warmer</span>
                    </div>
                  </div>

                  {/* Warm Tan / Sepia Balance */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-black uppercase">
                      <span>Warm Tan Intensity (Sepia)</span>
                      <span className="text-blue-600 font-mono">{sepia}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="50" 
                      value={sepia}
                      onChange={e => handleSliderChange('sepia', Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  {/* Brightness */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-black uppercase">
                      <span>Brightness</span>
                      <span className="text-blue-600 font-mono">{brightness}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="70" 
                      max="140" 
                      value={brightness}
                      onChange={e => handleSliderChange('brightness', Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  {/* Contrast */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-black uppercase">
                      <span>Contrast</span>
                      <span className="text-blue-600 font-mono">{contrast}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="70" 
                      max="150" 
                      value={contrast}
                      onChange={e => handleSliderChange('contrast', Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  {/* Saturation */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-black uppercase">
                      <span>Color Saturation</span>
                      <span className="text-blue-600 font-mono">{saturation}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="40" 
                      max="160" 
                      value={saturation}
                      onChange={e => handleSliderChange('saturation', Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Toast alert if saved */}
                {filterSavedToast && (
                  <div className="p-4 bg-green-50 border-2 border-green-600 rounded-2xl text-green-800 text-xs font-black uppercase flex items-center gap-2 animate-bounce">
                    <CheckCircle2 size={16} /> Skin Tone Filter Saved Successfully!
                  </div>
                )}

                {/* Footer Buttons */}
                <div className="flex gap-4 pt-2">
                  <button
                    onClick={() => setShowPhotoFilterStudio(false)}
                    className="flex-1 py-4 bg-gray-200 hover:bg-gray-300 text-black border-4 border-black rounded-2xl font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={savePhotoFilter}
                    className="flex-[2] py-4 bg-green-500 hover:bg-green-600 text-white border-4 border-black rounded-2xl font-black uppercase text-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-y-1 transition-all flex items-center justify-center gap-2"
                  >
                    <Save size={18} /> Save & Apply Skin Tone Filter
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Printable Sovereign ID Card Modal Overlay */}
      {showPrintableIdCardModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[120] flex items-center justify-center p-4 md:p-8 animate-fadeIn print:p-0 print:bg-white print:static">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white border-8 border-black rounded-[3rem] p-6 md:p-8 max-w-xl w-full shadow-[24px_24px_0px_0px_rgba(0,0,0,1)] space-y-6 relative print:border-4 print:shadow-none print:rounded-none"
          >
            {/* Modal Header Actions (Hidden when printing) */}
            <div className="flex justify-between items-center border-b-4 border-black pb-4 print:hidden">
              <div className="flex items-center gap-3">
                <Printer size={24} className="text-blue-600" />
                <h3 className="text-xl font-black uppercase italic">Printable Sovereign ID Card</h3>
              </div>
              <button 
                onClick={() => setShowPrintableIdCardModal(false)}
                className="w-10 h-10 bg-gray-100 hover:bg-rose-500 hover:text-white border-4 border-black rounded-xl flex items-center justify-center font-black text-lg transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Official Sovereign ID Physical Card Layout (Print Target) */}
            <div id="sovereign-printable-id-card" className="border-4 border-black rounded-3xl p-6 bg-gradient-to-br from-amber-50 via-white to-blue-50 space-y-5 relative overflow-hidden">
              {/* Sovereign Watermark */}
              <div className="absolute right-4 bottom-4 text-9xl font-black text-black/5 select-none pointer-events-none">
                🇪🇹
              </div>

              {/* ID Header */}
              <div className="flex justify-between items-center border-b-4 border-black pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-600 border-2 border-black rounded-lg flex items-center justify-center text-white font-black text-lg">
                    🇪🇹
                  </div>
                  <div>
                    <p className="text-[8px] font-black tracking-widest uppercase text-gray-500">FDRE MINISTRY OF EDUCATION</p>
                    <h4 className="text-sm font-black uppercase italic tracking-tight">NATIONAL DIGITAL SOVEREIGN ID</h4>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 bg-green-500 text-white border border-black rounded text-[8px] font-black uppercase">
                    VERIFIED
                  </span>
                  <p className="text-[8px] font-mono font-bold text-gray-500 mt-1">NO. {user.sovereignIndex || 'ETH-8809'}</p>
                </div>
              </div>

              {/* ID Content Grid */}
              <div className="flex gap-5 items-center">
                <div className="w-28 h-28 shrink-0 border-4 border-black rounded-2xl overflow-hidden bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <img 
                    src={user.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} 
                    style={{ filter: user.photoFilter || formData.photoFilter || 'none' }}
                    className="w-full h-full object-cover" 
                    alt={user.name} 
                  />
                </div>
                <div className="space-y-2 flex-1">
                  <div>
                    <p className="text-[8px] font-black uppercase text-gray-400">FULL NAME</p>
                    <h5 className="text-base font-black uppercase italic leading-tight text-black">{user.name}</h5>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <p className="text-[7px] font-black uppercase text-gray-400">ROLE / LEVEL</p>
                      <p className="font-black uppercase text-blue-700">{user.role} ({user.grade || 'Gr-12'})</p>
                    </div>
                    <div>
                      <p className="text-[7px] font-black uppercase text-gray-400">GENDER</p>
                      <p className="font-black uppercase text-black">{user.gender || 'Not Specified'}</p>
                    </div>
                    <div>
                      <p className="text-[7px] font-black uppercase text-gray-400">SOVEREIGN INDEX</p>
                      <p className="font-mono font-black text-emerald-700">{user.sovereignIndex || 'SOV-ETH-992'}</p>
                    </div>
                    <div>
                      <p className="text-[7px] font-black uppercase text-gray-400">VALID UNTIL</p>
                      <p className="font-mono font-bold text-gray-700">2030-12-31</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer QR & Official Stamp */}
              <div className="flex justify-between items-center pt-3 border-t-2 border-black/20">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 border-2 border-black rounded-lg p-1 bg-white shrink-0">
                    {qrCodeDataUrl && <img src={qrCodeDataUrl} className="w-full h-full object-contain" alt="QR" />}
                  </div>
                  <div>
                    <p className="text-[8px] font-black uppercase text-gray-500">DIGITAL CREDENTIAL PASS</p>
                    <p className="text-[7px] font-mono text-gray-400 truncate max-w-[200px]">{user.id}</p>
                  </div>
                </div>

                <div className="text-center border-2 border-dashed border-red-600 rounded-full w-14 h-14 flex flex-col items-center justify-center rotate-[-12deg] bg-red-50/50">
                  <span className="text-[6px] font-black uppercase text-red-700">IFTU LMS</span>
                  <span className="text-[5px] font-bold text-red-600">SEALED</span>
                </div>
              </div>
            </div>

            {/* Print Trigger Button */}
            <div className="flex gap-3 print:hidden pt-2">
              <button
                onClick={() => setShowPrintableIdCardModal(false)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-black border-4 border-black rounded-2xl font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="flex-[2] py-3 bg-blue-600 hover:bg-blue-700 text-white border-4 border-black rounded-2xl font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <Printer size={16} /> Print / Export PDF Card
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;

