
import { db, auth } from '../firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, query, where, updateDoc, onSnapshot, Unsubscribe, addDoc, orderBy, limit, getDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { User, ExamResult, Course, Exam, News, Assignment, AssignmentSubmission, AppNotification, VideoLabItem, Question, Grade, Stream, Enrollment, SystemSettings } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null, isListener: boolean = false) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };

  const errStr = errInfo.error.toLowerCase();
  if (
    errStr.includes('client is offline') || 
    errStr.includes('internal assertion failed') || 
    errStr.includes('unexpected state') ||
    errStr.includes('could not reach cloud firestore backend') ||
    errStr.includes('unavailable') ||
    errStr.includes('failed to get document')
  ) {
    console.warn(`Firestore SDK Warning (${path}): ${errInfo.error}. Operating in safe offline fallback mode.`);
    return;
  }

  if (isListener) {
    if (path?.startsWith('system/') && errInfo.error.includes('Missing or insufficient permissions')) {
      // Suppress unauthenticated system settings listener errors as this is expected before logic starts
      return;
    }
    // Don't throw in listeners to avoid crashing the app, but log it clearly
    console.warn(`Firestore Listener Warning: Restricted access to ${path}.`, errInfo.error);
    return;
  }

  console.error(`Firestore Operation Error: `, JSON.stringify(errInfo, null, 2));

  throw new Error(JSON.stringify(errInfo));
}

export const dbService = {
  // AUTH
  async signIn(email: string, password?: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password || 'demo');
      return { user: { id: userCredential.user.uid } };
    } catch (error) {
      return { error };
    }
  },

  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      return { user: { id: userCredential.user.uid, email: userCredential.user.email, name: userCredential.user.displayName, photo: userCredential.user.photoURL } };
    } catch (error) {
      return { error };
    }
  },

  async signUp(email: string, password: string, user: User) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userRef = doc(db, 'users', userCredential.user.uid);
    await setDoc(userRef, { ...user, id: userCredential.user.uid });
  },

  /**
   * Special creation method for Admins to create new users 
   * without being automatically signed out and logged in as the new user.
   */
  async signUpByAdmin(email: string, password: string, userData: User) {
    const { initializeApp, deleteApp } = await import('firebase/app');
    const { getAuth, createUserWithEmailAndPassword, signOut, setPersistence, inMemoryPersistence } = await import('firebase/auth');
    const { getFirestore, doc, setDoc } = await import('firebase/firestore');
    const { default: firebaseConfig } = await import('../firebase-applet-config.json');
    
    // Create a temporary secondary app instance
    const tempAppName = `temp-admin-create-${Date.now()}`;
    const tempApp = initializeApp(firebaseConfig, tempAppName);
    const tempAuth = getAuth(tempApp);
    
    // CRITICAL: Set persistence to inMemory to prevent overwriting the main app's session
    await setPersistence(tempAuth, inMemoryPersistence);
    
    const tempDb = getFirestore(tempApp, firebaseConfig.firestoreDatabaseId);

    try {
      // 1. Create the Auth account via temp instance
      const userCredential = await createUserWithEmailAndPassword(tempAuth, email, password);
      const newUid = userCredential.user.uid;

      // 2. Create the Firestore document using primary DB (admin has permission)
      const userRef = doc(db, 'users', newUid);
      await setDoc(userRef, { ...userData, id: newUid });

      // 3. Cleanup temp auth
      await signOut(tempAuth);
      
      return { success: true, uid: newUid };
    } catch (error: any) {
      console.error("Admin User Creation Failure:", error);
      throw error;
    } finally {
      // Always cleanup the temporary app
      await deleteApp(tempApp);
    }
  },

  async sendPasswordReset(email: string) {
    const { sendPasswordResetEmail } = await import('firebase/auth');
    await sendPasswordResetEmail(auth, email);
  },

  // REAL-TIME LISTENERS
  subscribeToExams(callback: (exams: Exam[]) => void, onError?: (error: any) => void): Unsubscribe {
    const path = 'exams';
    const q = collection(db, path);
    return onSnapshot(q, (snapshot) => {
      const exams = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Exam));
      callback(exams);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path, true);
      if (onError) onError(error);
    });
  },

  subscribeToCourses(callback: (courses: Course[]) => void, onError?: (error: any) => void): Unsubscribe {
    const path = 'courses';
    const q = collection(db, path);
    return onSnapshot(q, (snapshot) => {
      const courses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
      callback(courses);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path, true);
      if (onError) onError(error);
    });
  },

  subscribeToNews(callback: (news: News[]) => void, onError?: (error: any) => void): Unsubscribe {
    const path = 'news';
    const q = collection(db, path);
    return onSnapshot(q, (snapshot) => {
      const news = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as News));
      callback(news);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path, true);
      if (onError) onError(error);
    });
  },

  subscribeToUsers(callback: (users: User[]) => void, onError?: (error: any) => void): Unsubscribe {
    const path = 'users';
    const q = collection(db, path);
    return onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
      callback(users);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path, true);
      if (onError) onError(error);
    });
  },

  subscribeToAssignments(callback: (assignments: Assignment[]) => void, onError?: (error: any) => void): Unsubscribe {
    const path = 'assignments';
    const q = collection(db, path);
    return onSnapshot(q, (snapshot) => {
      const assignments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Assignment));
      callback(assignments);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path, true);
      if (onError) onError(error);
    });
  },

  subscribeToSubmissions(callback: (submissions: AssignmentSubmission[]) => void, onError?: (error: any) => void): Unsubscribe {
    const path = 'submissions';
    const q = collection(db, path);
    return onSnapshot(q, (snapshot) => {
      const submissions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AssignmentSubmission));
      callback(submissions);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path, true);
      if (onError) onError(error);
    });
  },

  subscribeToExamResults(callback: (results: ExamResult[]) => void, onError?: (error: any) => void): Unsubscribe {
    const path = 'exam_results';
    const q = collection(db, path);
    return onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map(doc => ({ ...doc.data() } as ExamResult));
      callback(results);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path, true);
      if (onError) onError(error);
    });
  },

  // FETCH NOTIFICATIONS
  async fetchNotifications(userId: string): Promise<AppNotification[]> {
    const path = 'notifications';
    try {
      const notifsCol = collection(db, path);
      const q = query(notifsCol, where('userId', '==', userId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AppNotification));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  // CREATE NOTIFICATION
  async createNotification(notification: Omit<AppNotification, 'id'>) {
    const path = 'notifications';
    try {
      await addDoc(collection(db, path), notification);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // MARK NOTIFICATION AS READ
  async markNotificationRead(notificationId: string) {
    if (!auth.currentUser) return;
    const path = 'notifications';
    try {
      const notifRef = doc(db, path, notificationId);
      await updateDoc(notifRef, { isRead: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  // QUESTION BANK
  subscribeToQuestionBank(callback: (questions: Question[]) => void, onError?: (error: any) => void): Unsubscribe {
    const path = 'question_bank';
    const q = collection(db, path);
    return onSnapshot(q, (snapshot) => {
      const questions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Question));
      callback(questions);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path, true);
      if (onError) onError(error);
    });
  },

  async syncQuestionInBank(question: Question) {
    if (!auth.currentUser) return;
    const path = 'question_bank';
    try {
      const questionRef = doc(db, path, question.id);
      await setDoc(questionRef, question, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteQuestionFromBank(id: string) {
    if (!auth.currentUser) return;
    const path = 'question_bank';
    try {
      const questionRef = doc(db, path, id);
      await deleteDoc(questionRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  // FETCH ALL USERS (Admin)
  async fetchAllUsers(): Promise<User[]> {
    const path = 'users';
    try {
      const usersCol = collection(db, path);
      const snapshot = await getDocs(usersCol);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  // FETCH COURSES
  async fetchCourses(): Promise<Course[]> {
    const path = 'courses';
    try {
      const coursesCol = collection(db, path);
      const snapshot = await getDocs(coursesCol);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  // FETCH EXAMS
  async fetchExams(): Promise<Exam[]> {
    const path = 'exams';
    try {
      const examsCol = collection(db, path);
      const snapshot = await getDocs(examsCol);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Exam));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  // FETCH NEWS
  async fetchNews(): Promise<News[]> {
    const path = 'news';
    try {
      const newsCol = collection(db, path);
      const snapshot = await getDocs(newsCol);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as News));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  // FETCH ASSIGNMENTS
  async fetchAssignments(): Promise<Assignment[]> {
    const path = 'assignments';
    try {
      const assignmentsCol = collection(db, path);
      const snapshot = await getDocs(assignmentsCol);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Assignment));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  // FETCH SUBMISSIONS
  async fetchSubmissions(assignmentId: string): Promise<AssignmentSubmission[]> {
    const path = 'submissions';
    try {
      const submissionsCol = collection(db, path);
      const q = query(submissionsCol, where('assignmentId', '==', assignmentId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AssignmentSubmission));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  // FETCH USER SUBMISSION
  async fetchUserSubmission(assignmentId: string, studentId: string): Promise<AssignmentSubmission | null> {
    const path = 'submissions';
    try {
      const submissionsCol = collection(db, path);
      const q = query(submissionsCol, where('assignmentId', '==', assignmentId), where('studentId', '==', studentId));
      const snapshot = await getDocs(q);
      return snapshot.empty ? null : ({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as AssignmentSubmission);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
    }
  },

  // FETCH ALL SUBMISSIONS (Admin)
  async fetchAllSubmissions(): Promise<AssignmentSubmission[]> {
    const path = 'submissions';
    try {
      const submissionsCol = collection(db, path);
      const snapshot = await getDocs(submissionsCol);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AssignmentSubmission));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  // SYNC SUBMISSION
  async syncSubmission(submission: AssignmentSubmission) {
    if (!auth.currentUser) return;
    const path = 'submissions';
    try {
      const submissionRef = doc(db, path, submission.id);
      await setDoc(submissionRef, submission, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // UPLOAD SUBMISSION FILE
  async uploadSubmissionFile(assignmentId: string, studentId: string, file: File): Promise<string> {
    const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
    const { storage } = await import('../firebase');
    
    // Path: submissions/{assignmentId}/{studentId}_{fileName}
    const storagePath = `submissions/${assignmentId}/${studentId}_${file.name}`;
    const storageRef = ref(storage, storagePath);
    
    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Storage Upload Error:", error);
      throw error;
    }
  },

  // DELETE SUBMISSION
  async deleteSubmission(id: string) {
    if (!auth.currentUser) return;
    const path = 'submissions';
    try {
      const submissionRef = doc(db, path, id);
      await deleteDoc(submissionRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  // FETCH RESULTS
  async fetchResults(studentId: string): Promise<ExamResult[]> {
    const path = 'exam_results';
    try {
      const resultsCol = collection(db, path);
      const q = query(resultsCol, where('studentId', '==', studentId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ ...doc.data() } as ExamResult));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  // FETCH ALL RESULTS (Admin)
  async fetchAllResults(): Promise<ExamResult[]> {
    const path = 'exam_results';
    try {
      const resultsCol = collection(db, path);
      const snapshot = await getDocs(resultsCol);
      return snapshot.docs.map(doc => ({ ...doc.data() } as ExamResult));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  // SYNC ASSIGNMENT DATA
  async syncAssignment(assignment: Assignment) {
    if (!auth.currentUser) return;
    const path = 'assignments';
    try {
      const assignmentRef = doc(db, path, assignment.id);
      await setDoc(assignmentRef, assignment, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // DELETE ASSIGNMENT
  async deleteAssignment(id: string) {
    if (!auth.currentUser) return;
    const path = 'assignments';
    try {
      const assignmentRef = doc(db, path, id);
      await deleteDoc(assignmentRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  // RESTORED FUNCTIONS
  async fetchTopStudents(): Promise<User[]> {
    const path = 'users';
    try {
      const usersCol = collection(db, path);
      const snapshot = await getDocs(usersCol);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User)).sort((a, b) => b.points - a.points).slice(0, 5);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  async fetchUserProfile(id: string): Promise<User | null> {
    const path = 'users';
    try {
      if (!id) return null;
      
      // Wait for auth token to be fully propagated to Firestore before querying
      if (auth.currentUser) {
        try {
          await auth.currentUser.getIdToken(false);
          // Add a tiny buffer for internal SDK propagation
          await new Promise(r => setTimeout(r, 250));
        } catch(e) {}
      }
      
      const userRef = doc(db, path, id);
      const { getDocFromServer, getDocFromCache } = await import('firebase/firestore');
      
      // Multi-stage fetch strategy:
      // 1. Try server first for absolute truth
      // 2. If offline, try to reconnect and retry server once
      // 3. If STILL offline, try cache as last resort
      
      let attempt = 0;
      const maxAttempts = 2;
      
      while (attempt <= maxAttempts) {
        try {
          // Use a timeout for the server fetch to prevent "infinite" verification
          const serverPromise = import('firebase/firestore').then(m => m.getDoc(userRef));
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Server timeout')), 2000)
          );
          
          const snapshot = await Promise.race([serverPromise, timeoutPromise]) as any;
          return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as User) : null;
        } catch (error: any) {
          const errorMsg = error?.message || String(error);
          const isOfflineOrTransient = errorMsg.includes('offline') || errorMsg.includes('unavailable') || errorMsg.includes('timeout');
          
          if (isOfflineOrTransient && attempt < maxAttempts) {
            const { reconnectDb } = await import('../firebase');
            await reconnectDb();
            // Minimal wait before retry to let auth token sync
            await new Promise(resolve => setTimeout(resolve, 500));
            attempt++;
            continue;
          }
          
          // If we reached here and it's offline, try cache
          if (errorMsg.includes('offline') || errorMsg.includes('unavailable') || errorMsg.includes('timeout')) {
            try {
              // Now that we have persistent cache enabled, this should work
              const cachedSnapshot = await getDocFromCache(userRef);
              if (cachedSnapshot.exists()) {
                return { id: cachedSnapshot.id, ...cachedSnapshot.data() } as User;
              }
            } catch (cacheError) {
              return null; // Return null instead of throwing to prevent application crash
            }
          }
          
          // Return null for other errors instead of throwing
          console.error("Sovereign DB: Fetch failed:", errorMsg);
          return null;
        }
      }
      return null;
    } catch (criticalError) {
      console.error("Sovereign Registry: Critical Access Failure:", criticalError);
      return null;
    }
  },

  async syncUser(user: User) {
    if (!auth.currentUser) return;
    
    const path = 'users';
    try {
      const userRef = doc(db, path, user.id);
      await setDoc(userRef, user, { merge: true });
    } catch (error: any) {
      const errorMsg = error?.message || String(error);
      if (errorMsg.includes('offline') || errorMsg.includes('unavailable')) {
        const { reconnectDb } = await import('../firebase');
        const success = await reconnectDb();
        if (success) {
          try {
            const userRef = doc(db, path, user.id);
            await setDoc(userRef, user, { merge: true });
            return;
          } catch (retryError) {
            handleFirestoreError(retryError, OperationType.WRITE, path);
          }
        }
      }
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteUser(id: string) {
    if (!auth.currentUser) return;
    const path = 'users';
    try {
      const userRef = doc(db, path, id);
      await deleteDoc(userRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  async syncCourse(course: Course) {
    if (!auth.currentUser) return;
    const path = 'courses';
    try {
      const courseRef = doc(db, path, course.id);
      await setDoc(courseRef, course, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteCourse(id: string) {
    if (!auth.currentUser) return;
    const path = 'courses';
    try {
      const courseRef = doc(db, path, id);
      await deleteDoc(courseRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  async syncNews(news: News) {
    if (!auth.currentUser) return;
    const path = 'news';
    try {
      const newsRef = doc(db, path, news.id);
      await setDoc(newsRef, news, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteNews(id: string) {
    if (!auth.currentUser) return;
    const path = 'news';
    try {
      const newsRef = doc(db, path, id);
      await deleteDoc(newsRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  async syncExam(exam: Exam) {
    if (!auth.currentUser) return;
    const path = 'exams';
    try {
      const examRef = doc(db, path, exam.id);
      await setDoc(examRef, exam, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteExam(id: string) {
    if (!auth.currentUser) return;
    const path = 'exams';
    try {
      const examRef = doc(db, path, id);
      await deleteDoc(examRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  async saveExamResult(result: ExamResult) {
    if (!auth.currentUser) return;
    const path = 'exam_results';
    try {
      const resultRef = doc(db, path, `${result.examId}_${result.studentId}`);
      await setDoc(resultRef, result, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async submitFeedback(feedback: any) {
    if (!auth.currentUser) return;
    const path = 'feedback';
    try {
      const feedbackRef = doc(db, path, `${Date.now()}`);
      await setDoc(feedbackRef, feedback);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // Study Hall (Chat & Notes)
  async updatePresence(hallId: string, user: User) {
    const path = `study_halls/${hallId}/presence/${user.id}`;
    try {
      await setDoc(doc(db, path), {
        userId: user.id,
        userName: user.name,
        userPhoto: user.photo,
        lastSeen: Date.now()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  subscribeToPresence(hallId: string, callback: (users: any[]) => void) {
    const path = `study_halls/${hallId}/presence`;
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    const q = query(collection(db, path), where('lastSeen', '>', fiveMinutesAgo));
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, path, true));
  },

  subscribeToChat(hallId: string, callback: (messages: any[]) => void) {
    const path = `study_halls/${hallId}/messages`;
    const q = query(collection(db, path), orderBy('timestamp', 'asc'), limit(100));
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, path, true));
  },

  async sendChatMessage(hallId: string, message: any) {
    const path = `study_halls/${hallId}/messages`;
    try {
      await addDoc(collection(db, path), message);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  subscribeToNotes(hallId: string, callback: (notes: any[]) => void) {
    const path = `study_halls/${hallId}/notes`;
    const q = query(collection(db, path), orderBy('lastModifiedAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, path, true));
  },

  async createNote(hallId: string, note: any) {
    const path = `study_halls/${hallId}/notes`;
    try {
      await addDoc(collection(db, path), note);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async updateNote(hallId: string, noteId: string, updates: any) {
    const path = `study_halls/${hallId}/notes`;
    try {
      await updateDoc(doc(db, path, noteId), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  async deleteNote(hallId: string, noteId: string) {
    const path = `study_halls/${hallId}/notes`;
    try {
      await deleteDoc(doc(db, path, noteId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  async getUsers(): Promise<User[]> {
    const path = 'users';
    try {
      const snapshot = await getDocs(collection(db, path));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  subscribeToNotifications(userId: string, callback: (notifications: AppNotification[]) => void) {
    const path = 'notifications';
    const q = query(
      collection(db, path),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AppNotification));
      callback(notifications);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path, true);
    });
  },

  async addNews(news: News) {
    const path = 'news';
    try {
      await setDoc(doc(db, path, news.id), news);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async addExam(exam: Exam) {
    const path = 'exams';
    try {
      await setDoc(doc(db, path, exam.id), exam);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async updateExam(exam: Exam) {
    const path = 'exams';
    try {
      await updateDoc(doc(db, path, exam.id), { ...exam });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  // VIDEOS
  subscribeToVideos(callback: (videos: VideoLabItem[]) => void, onError?: (error: any) => void): Unsubscribe {
    const path = 'videos';
    const q = collection(db, path);
    return onSnapshot(q, (snapshot) => {
      const videos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VideoLabItem));
      callback(videos);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path, true);
      if (onError) onError(error);
    });
  },

  async addVideo(video: VideoLabItem) {
    const path = 'videos';
    try {
      await setDoc(doc(db, path, video.id), video);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteVideo(id: string) {
    const path = 'videos';
    try {
      await deleteDoc(doc(db, path, id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  // Subject Registry Management
  async fetchSovereignSubjects(): Promise<Record<string, string[]>> {
    const path = 'system';
    try {
      const docRef = doc(db, path, 'subject_registry');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as Record<string, string[]>;
      }
      return {};
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `${path}/subject_registry`);
      return {};
    }
  },

  async updateSovereignSubjects(subjects: Record<string, string[]>): Promise<void> {
    const path = 'system';
    try {
      const docRef = doc(db, path, 'subject_registry');
      await setDoc(docRef, subjects);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${path}/subject_registry`);
    }
  },

  async fetchSystemSettings(): Promise<SystemSettings> {
    const path = 'system';
    try {
      const docRef = doc(db, path, 'settings');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as SystemSettings;
      }
      return { 
        maintenanceMode: false, 
        siteNotice: '', 
        allowPublicRegistration: true, 
        activeNationalExams: [],
        systemVersion: '1.0.4-SOVEREIGN',
        lastBackupDate: new Date().toISOString()
      };
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `${path}/settings`);
      return { 
        maintenanceMode: false, 
        siteNotice: '', 
        allowPublicRegistration: true, 
        activeNationalExams: [],
        systemVersion: '1.0.0',
        lastBackupDate: ''
      };
    }
  },

  subscribeToSystemSettings(callback: (settings: SystemSettings) => void): Unsubscribe {
    const path = 'system';
    const docRef = doc(db, path, 'settings');
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as SystemSettings);
      } else {
        // Provide defaults if the document is literally missing
        callback({
          maintenanceMode: false,
          siteNotice: '',
          allowPublicRegistration: true,
          activeNationalExams: [],
          systemVersion: '1.0.4-SOVEREIGN',
          lastBackupDate: ''
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `${path}/settings`, true);
      // Fallback
      callback({
        maintenanceMode: false,
        siteNotice: '',
        allowPublicRegistration: true,
        activeNationalExams: [],
        systemVersion: '1.0.4-SOVEREIGN',
        lastBackupDate: ''
      });
    });
  },

  async updateSystemSettings(settings: Partial<SystemSettings>): Promise<void> {
    const path = 'system';
    try {
      const docRef = doc(db, path, 'settings');
      await setDoc(docRef, settings, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${path}/settings`);
    }
  },

  async broadcastNotification(notification: Omit<AppNotification, 'id' | 'userId'>) {
    try {
      const users = await this.fetchAllUsers();
      const promises = users.map(user => 
        this.createNotification({
          ...notification,
          userId: user.id,
        } as AppNotification)
      );
      await Promise.all(promises);
    } catch (error) {
       console.error("Broadcast failed:", error);
    }
  },

  // DISCUSSIONS
  subscribeToDiscussions(callback: (discussions: any[]) => void) {
    const path = 'discussions';
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, path, true));
  },

  async createDiscussion(discussion: any) {
    const path = 'discussions';
    try {
      await setDoc(doc(db, path, discussion.id), discussion);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // STUDY PLANS
  async saveStudyPlan(userId: string, plan: any) {
    const path = 'study_plans';
    try {
      await setDoc(doc(db, path, userId), { ...plan, userId, generatedAt: new Date().toISOString() });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async fetchStudyPlan(userId: string): Promise<any | null> {
    const path = 'study_plans';
    try {
      const docSnap = await getDoc(doc(db, path, userId));
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
    }
  },

  async measureLatency(): Promise<number> {
    const start = performance.now();
    try {
      // Small read/write test to simulate real load
      const testRef = doc(db, 'system_health', 'latency_test');
      await setDoc(testRef, { timestamp: Date.now(), agent: 'Sovereign_Monitor' });
      await getDoc(testRef);
      const end = performance.now();
      return Math.round(end - start);
    } catch (error) {
      console.error("Latency check failed:", error);
      return -1;
    }
  },

  async notifyRelevantStudents(notification: Omit<AppNotification, 'id' | 'userId'>, grade: Grade, stream: Stream) {
    try {
      const users = await this.fetchAllUsers();
      const targets = users.filter(user => 
        user.role === 'student' && 
        user.grade === grade && 
        user.stream === stream
      );
      const promises = targets.map(user => 
        this.createNotification({
          ...notification,
          userId: user.id,
        } as AppNotification)
      );
      await Promise.all(promises);
    } catch (error) {
      console.error("Targeted notification failed:", error);
    }
  },

  // QUESTION BANK
  async fetchQuestionBank(): Promise<Question[]> {
    const path = 'question_bank';
    try {
      const qCol = collection(db, path);
      const snapshot = await getDocs(qCol);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Question));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  // ENROLLMENTS
  async enrollStudent(userId: string, courseId: string) {
    const path = 'enrollments';
    const enrollmentId = `${userId}_${courseId}`;
    const enrollment: Enrollment = {
      id: enrollmentId,
      userId,
      courseId,
      enrolledAt: new Date().toISOString(),
      status: 'active'
    };
    try {
      await setDoc(doc(db, path, enrollmentId), enrollment);
      
      // Also update user's enrolledCourses
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data() as User;
        const enrolledCourses = Array.from(new Set([...(userData.enrolledCourses || []), courseId]));
        await updateDoc(userRef, { enrolledCourses });
      }

      // Update course's enrolledCount
      const courseRef = doc(db, 'courses', courseId);
      const courseSnap = await getDoc(courseRef);
      if (courseSnap.exists()) {
        const courseData = courseSnap.data() as Course;
        await updateDoc(courseRef, { enrolledCount: (courseData.enrolledCount || 0) + 1 });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async unenrollStudent(userId: string, courseId: string) {
    const path = 'enrollments';
    const enrollmentId = `${userId}_${courseId}`;
    try {
      await deleteDoc(doc(db, path, enrollmentId));
      
      // Update user's enrolledCourses
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data() as User;
        const enrolledCourses = (userData.enrolledCourses || []).filter(id => id !== courseId);
        await updateDoc(userRef, { enrolledCourses });
      }

      // Update course's enrolledCount
      const courseRef = doc(db, 'courses', courseId);
      const courseSnap = await getDoc(courseRef);
      if (courseSnap.exists()) {
        const courseData = courseSnap.data() as Course;
        await updateDoc(courseRef, { enrolledCount: Math.max(0, (courseData.enrolledCount || 0) - 1) });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  async fetchCourseEnrollments(courseId: string): Promise<Enrollment[]> {
    const path = 'enrollments';
    try {
      const q = query(collection(db, path), where('courseId', '==', courseId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Enrollment));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  subscribeToEnrollments(callback: (enrollments: Enrollment[]) => void): Unsubscribe {
    const path = 'enrollments';
    const q = collection(db, path);
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Enrollment)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, path, true));
  },

  async syncNationalNews() {
    const nationalFeed: News[] = [
      {
        id: 'news_nat_001',
        title: 'Ministry Launches Sovereign Digital Infrastructure',
        summary: 'The Ministry of Education has inaugurated a new high-speed server cluster dedicated to the National Sovereign Education Network.',
        content: 'This infrastructure will power region-specific learning modules and secure student registries across the country.',
        category: 'announcement',
        tag: 'SOVEREIGN',
        date: new Date().toISOString().split('T')[0],
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800'
      },
      {
        id: 'news_nat_002',
        title: 'National Grade 12 Verification Protocol Updated',
        summary: 'New blockchain-based verification system for national exam results to be deployed for the 2026 academic cycle.',
        content: 'Students can now verify their certificates instantly using the unified registry portal, ensuring absolute document integrity.',
        category: 'exam',
        tag: 'EXAMS',
        date: new Date().toISOString().split('T')[0],
        image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800'
      },
      {
        id: 'news_nat_003',
        title: 'Expansion of National Open University Satellite Hubs',
        summary: '50 new satellite campuses launched to reach remote sovereign educational zones.',
        content: 'The expansion focuses on bridging the digital divide by providing localized access to advanced tertiary education modules.',
        category: 'academic',
        tag: 'ACADEMIC',
        date: new Date().toISOString().split('T')[0],
        image: 'https://images.unsplash.com/photo-1541339907198-e08756eaa539?auto=format&fit=crop&q=80&w=800'
      }
    ];

    for (const news of nationalFeed) {
      await this.addNews(news);
    }
    return nationalFeed.length;
  }
};
