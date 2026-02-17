import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import MainPage from './components/MainPage';
import { distributeStudents } from './utils/distributionAlgo';
import { socketManager } from './utils/socketManager';
import * as XLSX from 'xlsx';

function App() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [classCount, setClassCount] = useState(3);
  const [currentClassCount, setCurrentClassCount] = useState(3);
  const [currentView, setCurrentView] = useState('input'); // 'input', 'result', 'usage'

  // Real-time Collaboration State
  const [inviteCode, setInviteCode] = useState(null);
  const [isHost, setIsHost] = useState(false);

  const handleDataLoaded = (data) => {
    setStudents(data);
    setCurrentView('input');
  };

  // Sync Callback from Socket
  const onRemoteUpdate = (newClasses) => {
    console.log("Remote update received");
    setClasses(newClasses);
  };

  const startHosting = (initialData) => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setInviteCode(code);
    setIsHost(true);
    socketManager.joinRoom(code, true, onRemoteUpdate);
    // Initial sync with provided data
    setTimeout(() => socketManager.sendUpdate(initialData), 500);
  };

  const handleJoin = (code) => {
    if (!code || code.length !== 6) {
      alert("올바른 초대코드 6자리를 입력해주세요.");
      return;
    }
    setInviteCode(code);
    setIsHost(false);
    socketManager.joinRoom(code, false, (data) => {
      console.log("Joined and received data:", data);
      onRemoteUpdate(data);
      setCurrentView('result'); // Switch to view results upon joining
    });
  };

  const handleDistribute = (options) => {
    if (students.length === 0) {
      alert("먼저 학생 데이터를 입력해주세요.");
      return;
    }

    // Check if any option is selected
    // options might be undefined if called without args (though OptionsPanel always sends it)
    const isAutoMode = options && Object.values(options).some(value => value === true);
    let newClasses = [];

    if (isAutoMode) {
      // 1. Distribute students (Target Classes)
      const distributed = distributeStudents(students, classCount, options);

      // 2. Create Empty Source Classes (for Unified Layout)
      //    We scan students to find all original classes ('currentClass')
      const uniqueCurrentClasses = [...new Set(students.map(s => String(s.currentClass || '기타')))]
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

      const emptySourceClasses = uniqueCurrentClasses.map((clsName, index) => ({
        id: `source-${index}`,
        name: clsName,
        type: 'source',
        students: [], // Empty because valid Auto Mode implies everyone moved
        stats: {
          male: 0,
          female: 0,
          total: 0,
          initialTotal: students.filter(s => String(s.currentClass || '기타') === clsName).length,
          scoreSum: 0
        }
      }));

      newClasses = [...emptySourceClasses, ...distributed];
    } else {
      // Manual Mode

      // 1. Group students by current class
      const studentsByClass = {};
      students.forEach(student => {
        // student.currentClass comes from fileHandler parsing 
        // (which sets it to '현재학년반' or sheet name)
        const clsName = student.currentClass || '기타';
        if (!studentsByClass[clsName]) {
          studentsByClass[clsName] = [];
        }
        studentsByClass[clsName].push(student);
      });

      // 2. Create Source Classes
      //    Sort keys numerically (Natural Sort)
      const sourceClassNames = Object.keys(studentsByClass)
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

      const sourceClasses = sourceClassNames.map((clsName, index) => ({
        id: `source-${index}`,
        name: clsName,
        type: 'source',
        students: studentsByClass[clsName],
        stats: {
          male: studentsByClass[clsName].filter(s => s.gender === 'Male').length,
          female: studentsByClass[clsName].filter(s => s.gender === 'Female').length,
          total: studentsByClass[clsName].length,
          initialTotal: studentsByClass[clsName].length,
          scoreSum: studentsByClass[clsName].reduce((sum, s) => sum + s.score, 0)
        }
      }));

      // 3. Create Target Classes
      const targetClasses = Array.from({ length: classCount }, (_, i) => ({
        id: `class-${i + 1}`, // Use same ID format as auto-distribute for consistency
        name: `${i + 1}반`,
        type: 'target',
        students: [],
        stats: {
          male: 0,
          female: 0,
          total: 0,
          scoreSum: 0,
        }
      }));

      newClasses = [...sourceClasses, ...targetClasses];
    }

    setClasses(newClasses);
    setCurrentView('result');

    // Auto-start hosting if result generated
    if (!inviteCode) {
      startHosting(newClasses);
    } else {
      // If already hosting, send update
      socketManager.sendUpdate(newClasses);
    }
  };

  const handleExport = (sortType = 'name') => {
    const wb = XLSX.utils.book_new();

    // Filter only Target Classes (ignore Source Classes)
    const targetClasses = classes.filter(cls => cls.type === 'target');

    targetClasses.forEach(cls => {
      // 1. First, create a list sorted by NAME to determine "Official Number"
      const studentsForNumbering = [...cls.students].sort((a, b) => a.name.localeCompare(b.name));

      // Assign official number
      const studentsWithNumber = studentsForNumbering.map((student, index) => ({
        ...student,
        officialNumber: index + 1
      }));

      // 2. Sort Logic for Display (Gender or Name)
      const sortedStudents = [...studentsWithNumber].sort((a, b) => {
        if (sortType === 'gender') {
          // Male first
          if (a.gender !== b.gender) return a.gender === 'Male' ? -1 : 1;
          return a.name.localeCompare(b.name);
        } else {
          return a.name.localeCompare(b.name);
        }
      });

      // 3. Map to Export Format
      const exportData = sortedStudents.map(student => ({
        '새학년반': cls.name,
        '번호': student.officialNumber, // Always Name-based Number
        '이름': student.name,
        '성별': student.gender === 'Male' ? '남' : '여',
        '성적': student.score,
        '같은반요청': student.sameClassRequest,
        '분리요청': student.separationRequest,
        '주의 학생': student.caution || '',
        '비고': student.remarks || ''
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);

      // Adjust Column Widths (Optional for better view)
      const wscols = [
        { wch: 10 }, // 새학년반
        { wch: 6 },  // 번호
        { wch: 10 }, // 이름
        { wch: 6 },  // 성별
        { wch: 8 }, // 성적
        { wch: 20 }, // 같은반요청
        { wch: 20 }, // 분리요청
        { wch: 10 }, // 주의 학생
        { wch: 20 }  // 비고
      ];
      ws['!cols'] = wscols;

      XLSX.utils.book_append_sheet(wb, ws, cls.name);
    });

    const fileName = sortType === 'gender' ? "반배정_완료_성별정렬.xlsx" : "반배정_완료_이름정렬.xlsx";
    XLSX.writeFile(wb, fileName);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const moveStudent = (studentId, sourceClassId, targetClassId) => {
    if (!studentId || !sourceClassId || !targetClassId) return;
    if (sourceClassId === targetClassId) return;

    setClasses(prevClasses => {
      // Find source and target classes first to validate and get student
      const sourceCls = prevClasses.find(c => c.id === sourceClassId);
      const targetCls = prevClasses.find(c => c.id === targetClassId);

      if (!sourceCls || !targetCls) return prevClasses;

      const studentToMove = sourceCls.students.find(s => s.id === studentId);
      if (!studentToMove) return prevClasses;

      // Create new classes array with immutable updates
      const newClasses = prevClasses.map(cls => {
        if (cls.id === sourceClassId) {
          // Update source class: remove student and update stats
          const updatedStudents = cls.students.filter(s => s.id !== studentId);
          return {
            ...cls,
            students: updatedStudents,
            stats: {
              ...cls.stats,
              male: updatedStudents.filter(s => s.gender === 'Male').length,
              female: updatedStudents.filter(s => s.gender === 'Female').length,
              total: updatedStudents.length,
              scoreSum: updatedStudents.reduce((sum, s) => sum + s.score, 0)
            }
          };
        } else if (cls.id === targetClassId) {
          // Update target class: add student and update stats
          const updatedStudents = [...cls.students, studentToMove];
          return {
            ...cls,
            students: updatedStudents,
            stats: {
              ...cls.stats,
              male: updatedStudents.filter(s => s.gender === 'Male').length,
              female: updatedStudents.filter(s => s.gender === 'Female').length,
              total: updatedStudents.length,
              scoreSum: updatedStudents.reduce((sum, s) => sum + s.score, 0)
            }
          };
        }
        return cls;
      });

      // Broadcast update
      socketManager.sendUpdate(newClasses);

      return newClasses;
    });
  };

  const onDrop = (e, targetClassId) => {
    e.preventDefault();
    const studentId = e.dataTransfer.getData("studentId");
    const sourceClassId = e.dataTransfer.getData("sourceClassId");
    moveStudent(studentId, sourceClassId, targetClassId);
  };

  const handleGoHome = () => {
    // ... confirm exit if in room?
    if (currentView !== 'input') {
      // Optional: Disconnect socket?
      // socketManager.disconnect(); 
      // setInviteCode(null);
      setCurrentView('input');
    } else {
      window.location.reload();
    }
  };

  // ... (handleGoUsage, handleGoFeedback unchanged)
  const handleGoUsage = () => setCurrentView('usage');
  const handleGoFeedback = () => setCurrentView('feedback');

  return (
    <div className="min-h-screen bg-[#F0FDF4] text-gray-900 font-sans flex flex-col">
      <Header onGoHome={handleGoHome} onGoUsage={handleGoUsage} onGoFeedback={handleGoFeedback} />

      <MainPage
        students={students}
        classes={classes}
        classCount={classCount}
        currentClassCount={currentClassCount}
        currentView={currentView}
        setClassCount={setClassCount}
        setCurrentClassCount={setCurrentClassCount}
        onDataLoaded={handleDataLoaded}
        onDistribute={handleDistribute}
        onExport={handleExport}
        onReset={() => setCurrentView('input')}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onMoveStudent={moveStudent}

        // Collaboration Props
        onJoin={handleJoin}
        inviteCode={inviteCode}
      />

      <Footer />
    </div>
  );
}

export default App;
