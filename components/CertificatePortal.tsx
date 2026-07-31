
import React from 'react';
import { User, Course, Grade } from '../types';

interface CertificatePortalProps {
  user: User;
  course?: Course;
  examTitle?: string;
  onClose: () => void;
}

const CertificatePortal: React.FC<CertificatePortalProps> = ({ user, course, examTitle, onClose }) => {
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const title = course?.title || examTitle || 'Academic Achievement';
  const stream = user.stream || 'NATURAL SCIENCES STREAM';
  const isSocial = stream.toUpperCase().includes('SOCIAL');
  
  // Grade 12 takes the National EAES Certificate style. Grades 9, 10, 11 take the School Transcript style.
  const isEAES = user.grade === Grade.G12;
  
  // Generating realistic mock scores
  const getSimulatedScores = (baseScore: number) => {
    // For school transcript: Assignment (20%), Project (30%), Exam (50%)
    const assignment = Math.round((baseScore / 100) * 20) - Math.floor(Math.random() * 2);
    const project = Math.round((baseScore / 100) * 30) - Math.floor(Math.random() * 3);
    const exam = baseScore - assignment - project;
    return { assignment, project, exam, total: baseScore };
  };

  const commonSubjects = [
    { name: 'English', score: getSimulatedScores(88) },
    { name: 'Mathematics', score: getSimulatedScores(95) },
    { name: 'Information Technology (IT)', score: getSimulatedScores(96) },
    { name: 'Civics & Ethical Education', score: getSimulatedScores(91) },
  ];

  const socialSubjects = [
    { name: 'Geography', score: getSimulatedScores(87) },
    { name: 'Economics', score: getSimulatedScores(90) },
    { name: 'History', score: getSimulatedScores(85) },
  ];

  const naturalSubjects = [
    { name: 'Physics', score: getSimulatedScores(92) },
    { name: 'Chemistry', score: getSimulatedScores(89) },
    { name: 'Biology', score: getSimulatedScores(94) },
  ];

  const subjects = isSocial ? [...commonSubjects, ...socialSubjects] : [...commonSubjects, ...naturalSubjects];

  const totalScore = subjects.reduce((sum, subj) => sum + subj.score.total, 0);

  return (
    <div className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 overflow-y-auto animate-fadeIn">
      <div className="printable-transcript w-full max-w-5xl">
        <div className="bg-white border-[1px] border-gray-200 p-8 md:p-12 relative overflow-hidden shadow-2xl font-serif text-gray-800">
          {/* Borders */}
          <div className="absolute top-4 left-4 right-4 h-[2px] bg-green-700"></div>
          <div className="absolute top-6 left-4 right-4 h-[2px] bg-blue-700"></div>
          <div className="absolute top-8 left-4 right-4 h-[2px] bg-red-700"></div>
          
          <div className="absolute bottom-4 left-4 right-4 h-[2px] bg-red-700"></div>
          <div className="absolute bottom-6 left-4 right-4 h-[2px] bg-blue-700"></div>
          <div className="absolute bottom-8 left-4 right-4 h-[2px] bg-green-700"></div>

          <div className="border-[1px] border-gray-100 p-4 md:p-8 flex flex-col items-center mt-6">
            
            {/* Header Text */}
            <div className="text-center space-y-2 mb-8">
              {isEAES ? (
                <>
                  <h1 className="text-xl md:text-2xl font-black tracking-widest uppercase">
                    FEDERAL DEMOCRATIC REPUBLIC OF ETHIOPIA
                  </h1>
                  <h2 className="text-lg md:text-xl font-bold tracking-wider uppercase">
                    MINISTRY OF EDUCATION
                  </h2>
                  <h3 className="text-2xl md:text-3xl font-black text-blue-800 uppercase tracking-tight py-2">
                    ETHIOPIAN UNIVERSITY ENTRANCE EXAMINATION CERTIFICATE
                  </h3>
                </>
              ) : (
                <>
                  <h1 className="text-xl md:text-2xl font-black tracking-widest uppercase">
                    OROMIYA EDUCATION BUREAU | BIIROO BARNOOTA OROMIYAA
                  </h1>
                  <h2 className="text-lg md:text-xl font-bold tracking-wider uppercase">
                    WEST ARSI ZONE | KORE WOREDA
                  </h2>
                  <h2 className="text-2xl md:text-3xl font-black text-blue-800 uppercase tracking-tight py-2">
                    IFTU SECONDARY SCHOOL
                  </h2>
                  <h3 className="text-xl font-black text-red-700 uppercase tracking-widest">
                    OFFICIAL STUDENT TRANSCRIPT
                  </h3>
                </>
              )}
            </div>

            <div className="w-full flex flex-col md:flex-row justify-between text-sm md:text-base mb-8 gap-4 px-4 font-bold uppercase">
              <div className="space-y-2 text-left">
                <p>NAME: <span className="border-b border-black border-dashed min-w-[250px] inline-block px-2 text-xl font-black text-blue-900">{user.name}</span></p>
                <p>SEX: <span className="border-b border-black border-dashed min-w-[100px] inline-block px-2 text-xl font-black text-blue-900">{user.gender || 'M'}</span></p>
                {!isEAES && <p>GRADE: <span className="border-b border-black border-dashed min-w-[150px] inline-block px-2 text-xl font-black text-blue-900">{user.grade || 'GRADE 9'}</span></p>}
                {isEAES && <p>CITIZENSHIP: <span className="border-b border-black border-dashed min-w-[150px] inline-block px-2 text-xl font-black text-blue-900">ETHIOPIAN</span></p>}
              </div>
              <div className="space-y-2 text-right">
                <p>REGISTRATION NO: <span className="border-b border-black border-dashed min-w-[150px] inline-block px-2 text-xl font-black text-blue-900">{user.sovereignIndex || 'REG-0000X'}</span></p>
                <p>STREAM: <span className="border-b border-black border-dashed min-w-[200px] inline-block px-2 text-xl font-black text-blue-900">{stream}</span></p>
                {isEAES && <p>SCHOOL: <span className="border-b border-black border-dashed min-w-[200px] inline-block px-2 text-xl font-black text-blue-900">IFTU SECONDARY SCHOOL</span></p>}
                {!isEAES && <p>ACADEMIC YEAR: <span className="border-b border-black border-dashed min-w-[200px] inline-block px-2 text-xl font-black text-blue-900">2016 E.C / 2024 G.C</span></p>}
              </div>
            </div>

            <div className="w-full border-t border-black mb-6"></div>

            <p className="text-center italic mb-6 font-bold text-lg">
              {isEAES ? "Has taken the Ethiopian University Entrance Examination (Grade 12) with the following results:" : "Has completed the academic requirements with the following continuous assessment and examination results:"}
            </p>

            <table className="w-full max-w-4xl mx-auto border-collapse border border-black text-left mb-8">
              <thead>
                {isEAES ? (
                  <tr className="bg-gray-100">
                    <th className="border border-black p-3 font-bold uppercase text-center w-16">No.</th>
                    <th className="border border-black p-3 font-bold uppercase w-1/2">Subject / Gosa Barnootaa</th>
                    <th className="border border-black p-3 font-bold uppercase text-center w-32">Weight</th>
                    <th className="border border-black p-3 font-bold uppercase text-center">Results / Qabxii</th>
                  </tr>
                ) : (
                  <tr className="bg-gray-100 text-xs md:text-sm">
                    <th className="border border-black p-2 font-bold uppercase text-center w-12">No.</th>
                    <th className="border border-black p-2 font-bold uppercase w-1/3">Subject / Gosa Barnootaa</th>
                    <th className="border border-black p-2 font-bold uppercase text-center">Assignment<br/><span className="text-[10px]">(20%)</span></th>
                    <th className="border border-black p-2 font-bold uppercase text-center">Project<br/><span className="text-[10px]">(30%)</span></th>
                    <th className="border border-black p-2 font-bold uppercase text-center">Exam<br/><span className="text-[10px]">(50%)</span></th>
                    <th className="border border-black p-2 font-bold uppercase text-center bg-blue-50">Total<br/><span className="text-[10px]">(100%)</span></th>
                  </tr>
                )}
              </thead>
              <tbody>
                {subjects.map((subj, idx) => (
                  <tr key={idx}>
                    <td className="border border-black p-2 text-center font-bold text-gray-700">{idx + 1}</td>
                    <td className="border border-black p-2 uppercase font-bold text-black">{subj.name}</td>
                    {isEAES ? (
                      <>
                        <td className="border border-black p-2 text-center font-bold text-gray-700">100</td>
                        <td className="border border-black p-2 text-center font-black text-xl text-blue-900">{subj.score.total}</td>
                      </>
                    ) : (
                      <>
                         <td className="border border-black p-2 text-center font-bold text-gray-700">{subj.score.assignment}</td>
                         <td className="border border-black p-2 text-center font-bold text-gray-700">{subj.score.project}</td>
                         <td className="border border-black p-2 text-center font-bold text-gray-700">{subj.score.exam}</td>
                         <td className="border border-black p-2 text-center font-black text-lg text-blue-900 bg-blue-50">{subj.score.total}</td>
                      </>
                    )}
                  </tr>
                ))}
                <tr className="bg-gray-100 border-t-4 border-black">
                  <td colSpan={isEAES ? 2 : 5} className="border border-black p-3 text-right font-black uppercase text-xl">Total Score (Ida'ama)</td>
                  {isEAES && <td className="border border-black p-3 text-center font-bold text-xl">{subjects.length * 100}</td>}
                  <td className="border border-black p-3 text-center font-black text-2xl text-red-600">{totalScore}</td>
                </tr>
              </tbody>
            </table>

            {/* Footer / Seals */}
            <div className="w-full flex justify-between items-end mt-12 px-8">
              <div className="text-left space-y-1">
                <p className="text-sm font-bold uppercase">Date of Issue: {dateStr}</p>
                <p className="text-sm font-bold uppercase">Prepared By: IFTU-LMS DIGITAL HUB</p>
              </div>

              <div className="relative">
                {isEAES ? (
                  <div className="w-32 h-32 border-4 border-blue-600 rounded-full flex items-center justify-center p-2 opacity-90 relative">
                    <div className="absolute inset-0 border-[3px] border-blue-600 rounded-full m-[4px] flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="absolute w-full h-full text-blue-600">
                        <path id="seal-curve" fill="transparent" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" />
                        <text className="text-[10px] font-black uppercase tracking-widest fill-current">
                          <textPath href="#seal-curve" startOffset="5%">
                            IFTU LMS OFFICIAL • IFTU LMS OFFICIAL • 
                          </textPath>
                        </text>
                      </svg>
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-3xl">🔵</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-32 h-32 border-4 border-red-700 rounded-full flex items-center justify-center p-2 opacity-90 relative">
                    <div className="absolute inset-0 border-[3px] border-red-700 rounded-full m-[4px] flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="absolute w-full h-full text-red-700">
                        <path id="seal-curve-school" fill="transparent" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" />
                        <text className="text-[10px] font-black uppercase tracking-widest fill-current">
                          <textPath href="#seal-curve-school" startOffset="5%">
                            IFTU SECONDARY SCHOOL • KORE • 
                          </textPath>
                        </text>
                      </svg>
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-3xl">🦁</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-center space-y-2">
                <div className="relative inline-block mt-4">
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-70">
                    <img src="https://api.dicebear.com/7.x/initials/svg?seed=JFH" className="w-24 h-12" alt="signature" />
                  </div>
                  <p className="text-2xl font-bold border-b-2 border-black px-6 pb-1 italic font-serif text-blue-900">Eng. Jemal Fano Haji</p>
                  <p className="text-sm font-black mt-1 uppercase text-gray-700">{isEAES ? 'Director General' : 'School Principal'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Print / Actions */}
        <div className="no-print mt-12 flex flex-col sm:flex-row gap-8">
           <button onClick={() => window.print()} className="flex-1 py-10 bg-black text-white rounded-[3rem] border-8 border-black font-black uppercase text-3xl shadow-[10px_10px_0px_0px_rgba(34,197,94,1)] hover:translate-y-2 transition-all">Export Official PDF</button>
           <button onClick={onClose} className="flex-1 py-10 bg-white text-black rounded-[3rem] border-8 border-black font-black uppercase text-3xl shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-y-2 transition-all">Close {isEAES ? 'Certificate' : 'Transcript'} View</button>
        </div>
      </div>
    </div>
  );
};

export default CertificatePortal;
