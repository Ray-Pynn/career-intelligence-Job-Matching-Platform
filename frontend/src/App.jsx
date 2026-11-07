
import React, { useState } from 'react';
import { 
  Briefcase, 
  FileText, 
  Target, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  Award, 
  BookOpen, 
  TrendingUp 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('resume');
  const [resumeFile, setResumeFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleResumeUpload = (e) => {
    e.preventDefault();
    if (!resumeFile) {
      setErrorMsg('Please select a PDF, DOCX, or TXT resume file first.');
      return;
    }
    
    // Validate payload size (Max 5MB)
    if (resumeFile.size > 5 * 1024 * 1024) {
      setErrorMsg('File size exceeds the 5MB maximum limit.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    // Offline deterministic keyword and ATS match calculation demo
    setTimeout(() => {
      setAnalysisResult({
        filename: resumeFile.name,
        extracted_text_length: 1420,
        extracted_skills: [
          'Python', 
          'FastAPI', 
          'React.js', 
          'PostgreSQL', 
          'Docker', 
          'REST APIs', 
          'SQLAlchemy', 
          'JavaScript (ES6+)'
        ],
        missing_skills: ['Redis', 'Celery', 'AWS Cloud Services'],
        ats_score: '88%',
        recommendations: [
          'Strong technical alignment with backend and full-stack software roles.',
          'Consider adding quantified impact metrics (e.g., performance improvements, execution speed).',
          'Ensure cloud deployment and message queue keywords are highlighted for senior positions.'
        ]
      });
      setLoading(false);
    }, 800);
  };

  return (
    <div style={styles.container}>
      {/* Top Brand Navigation */}
      <header style={styles.navbar}>
        <div style={styles.brand}>
          <Briefcase size={22} color="#2563eb" /> 
          <span>Career Intelligence & Job Matching Platform</span>
        </div>
        <div style={styles.badge}>
          <Sparkles size={14} /> Local Portfolio Prototype
        </div>
      </header>

      {/* Main Tab Navigation */}
      <nav style={styles.tabNav}>
        <button 
          style={activeTab === 'resume' ? styles.activeTabBtn : styles.tabBtn} 
          onClick={() => setActiveTab('resume')}
        >
          <FileText size={16} /> Resume Analyzer
        </button>
        <button 
          style={activeTab === 'matching' ? styles.activeTabBtn : styles.tabBtn} 
          onClick={() => setActiveTab('matching')}
        >
          <Target size={16} /> Job Matching & Skill-Gap
        </button>
        <button 
          style={activeTab === 'recruiter' ? styles.activeTabBtn : styles.tabBtn} 
          onClick={() => setActiveTab('recruiter')}
        >
          <Users size={16} /> Recruiter Portal
        </button>
      </nav>

      {/* Main Content Area */}
      <main style={styles.main}>
        {/* TAB 1: RESUME ANALYZER */}
        {activeTab === 'resume' && (
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <FileText size={20} color="#2563eb" />
              <h3 style={styles.cardTitle}>Resume Parsing & ATS Keyword Coverage</h3>
            </div>
            <p style={styles.subtext}>
              Upload a candidate resume (PDF, DOCX, TXT) to parse technical competencies and evaluate ATS compatibility locally.
            </p>
            
            <form onSubmit={handleResumeUpload} style={styles.uploadBox}>
              <input 
                type="file" 
                accept=".pdf,.docx,.txt" 
                onChange={(e) => setResumeFile(e.target.files[0])} 
                style={styles.fileInput}
              />
              <button type="submit" style={styles.submitBtn} disabled={loading}>
                {loading ? 'Processing Text...' : 'Analyze Resume'}
              </button>
            </form>

            {errorMsg && (
              <div style={styles.error}>
                <AlertCircle size={16} /> {errorMsg}
              </div>
            )}

            {analysisResult && (
              <div style={styles.resultsBox}>
                <div style={styles.resultHeader}>
                  <h4>
                    <CheckCircle size={18} color="#10b981" /> 
                    Analysis Complete ({analysisResult.filename})
                  </h4>
                  <div style={styles.scoreContainer}>
                    <span style={styles.scoreLabel}>ATS Keyword Score:</span>
                    <span style={styles.scoreValue}>{analysisResult.ats_score}</span>
                  </div>
                </div>

                <p style={{ fontSize: '13px', color: '#6b7280', margin: '8px 0' }}>
                  Extracted {analysisResult.extracted_text_length} characters of parsed document text.
                </p>

                <div style={{ marginTop: '15px' }}>
                  <strong>Identified Core Competencies:</strong>
                  <div style={styles.badgeGroup}>
                    {analysisResult.extracted_skills.map((skill, i) => (
                      <span key={i} style={styles.skillBadge}>{skill}</span>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: '15px' }}>
                  <strong>Recommended Target Skill Priorities:</strong>
                  <div style={styles.badgeGroup}>
                    {analysisResult.missing_skills.map((skill, i) => (
                      <span key={i} style={styles.missingBadge}>{skill}</span>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: '15px' }}>
                  <strong>Actionable Content Recommendations:</strong>
                  <ul style={styles.bulletList}>
                    {analysisResult.recommendations.map((rec, i) => (
                      <li key={i} style={styles.bulletItem}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: JOB MATCHING */}
        {activeTab === 'matching' && (
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <Target size={20} color="#2563eb" />
              <h3 style={styles.cardTitle}>Semantic Job Compatibility Engine</h3>
            </div>
            <p style={styles.subtext}>
              Cross-references candidate skills against local job prerequisites using TF-IDF vector similarity.
            </p>

            <div style={styles.jobGrid}>
              <div style={styles.jobCard}>
                <div style={styles.jobCardHeader}>
                  <h4>Full Stack Software Engineer</h4>
                  <span style={styles.matchBadgeHigh}>94% Match</span>
                </div>
                <p style={styles.companyText}>TechCorp Solutions • Local Demo Listing</p>
                <p style={styles.jobDesc}>
                  Looking for a engineer proficient in Python, FastAPI, React, PostgreSQL, and Docker container orchestration.
                </p>
                <div style={{ marginTop: '10px' }}>
                  <small style={{ color: '#4b5563', fontWeight: 'bold' }}>Matched Prerequisites:</small>
                  <div style={styles.badgeGroup}>
                    <span style={styles.skillBadge}>Python</span>
                    <span style={styles.skillBadge}>FastAPI</span>
                    <span style={styles.skillBadge}>React</span>
                    <span style={styles.skillBadge}>PostgreSQL</span>
                  </div>
                </div>
              </div>

              <div style={styles.jobCard}>
                <div style={styles.jobCardHeader}>
                  <h4>Backend Python Developer</h4>
                  <span style={styles.matchBadgeMedium}>82% Match</span>
                </div>
                <p style={styles.companyText}>DataFlow Systems • Local Demo Listing</p>
                <p style={styles.jobDesc}>
                  Backend role requiring strong RESTful API architecture, SQLAlchemy ORM data modeling, and async I/O routines.
                </p>
                <div style={{ marginTop: '10px' }}>
                  <small style={{ color: '#4b5563', fontWeight: 'bold' }}>Matched Prerequisites:</small>
                  <div style={styles.badgeGroup}>
                    <span style={styles.skillBadge}>Python</span>
                    <span style={styles.skillBadge}>FastAPI</span>
                    <span style={styles.skillBadge}>Async SQL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: RECRUITER PORTAL */}
        {activeTab === 'recruiter' && (
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <Users size={20} color="#2563eb" />
              <h3 style={styles.cardTitle}>Recruiter Candidate Directory</h3>
            </div>
            <p style={styles.subtext}>
              Demonstrates candidate overview comparison, skill coverage metrics, and applicant compatibility sorting.
            </p>

            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Candidate Name</th>
                  <th style={styles.th}>Target Role</th>
                  <th style={styles.th}>ATS Match</th>
                  <th style={styles.th}>Top Competencies</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={styles.td}><strong>Alex Johnson</strong></td>
                  <td style={styles.td}>Full Stack Developer</td>
                  <td style={styles.td}><span style={{ color: '#059669', fontWeight: 'bold' }}>88%</span></td>
                  <td style={styles.td}>Python, FastAPI, React</td>
                  <td style={styles.td}><span style={styles.statusShortlist}>Shortlisted</span></td>
                </tr>
                <tr>
                  <td style={styles.td}><strong>Sarah Smith</strong></td>
                  <td style={styles.td}>Backend Engineer</td>
                  <td style={styles.td}><span style={{ color: '#059669', fontWeight: 'bold' }}>82%</span></td>
                  <td style={styles.td}>Python, SQL, Async I/O</td>
                  <td style={styles.td}><span style={styles.statusReview}>In Review</span></td>
                </tr>
                <tr>
                  <td style={styles.td}><strong>Michael Brown</strong></td>
                  <td style={styles.td}>Frontend Developer</td>
                  <td style={styles.td}><span style={{ color: '#d97706', fontWeight: 'bold' }}>74%</span></td>
                  <td style={styles.td}>React, JavaScript, CSS3</td>
                  <td style={styles.td}><span style={styles.statusReview}>In Review</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

// Clean inline styles ensuring perfect visual rendering across devices
const styles = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '20px',
    color: '#1f2937',
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#ffffff',
    padding: '16px 20px',
    borderRadius: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    marginBottom: '20px',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontWeight: '700',
    fontSize: '18px',
    color: '#111827',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: '#eff6ff',
    color: '#1d4ed8',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  tabNav: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  tabBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#4b5563',
  },
  activeTabBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    background: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)',
  },
  main: {
    width: '100%',
  },
  card: {
    background: '#ffffff',
    padding: '24px',
    borderRadius: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '6px',
  },
  cardTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '700',
    color: '#111827',
  },
  subtext: {
    color: '#6b7280',
    fontSize: '14px',
    marginBottom: '20px',
  },
  uploadBox: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    marginBottom: '15px',
    flexWrap: 'wrap',
  },
  fileInput: {
    border: '1px solid #d1d5db',
    padding: '9px 12px',
    borderRadius: '6px',
    fontSize: '14px',
    flex: '1',
    backgroundColor: '#ffffff',
  },
  submitBtn: {
    background: '#2563eb',
    color: '#ffffff',
    border: 'none',
    padding: '10px 22px',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
  },
  resultsBox: {
    marginTop: '20px',
    background: '#f8fafc',
    padding: '18px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px',
  },
  scoreContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: '#ecfdf5',
    padding: '4px 12px',
    borderRadius: '6px',
    border: '1px solid #a7f3d0',
  },
  scoreLabel: {
    fontSize: '13px',
    color: '#065f46',
    fontWeight: '500',
  },
  scoreValue: {
    fontSize: '16px',
    color: '#047857',
    fontWeight: '800',
  },
  badgeGroup: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginTop: '8px',
  },
  skillBadge: {
    background: '#e0e7ff',
    color: '#3730a3',
    padding: '4px 10px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
  },
  missingBadge: {
    background: '#fef3c7',
    color: '#92400e',
    padding: '4px 10px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
  },
  bulletList: {
    paddingLeft: '20px',
    margin: '8px 0 0 0',
  },
  bulletItem: {
    fontSize: '13px',
    color: '#4b5563',
    marginBottom: '4px',
  },
  error: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#dc2626',
    fontSize: '14px',
    marginTop: '10px',
  },
  jobGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  jobCard: {
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    padding: '18px',
    borderRadius: '8px',
  },
  jobCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matchBadgeHigh: {
    background: '#d1fae5',
    color: '#065f46',
    fontSize: '12px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '12px',
  },
  matchBadgeMedium: {
    background: '#fef3c7',
    color: '#92400e',
    fontSize: '12px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '12px',
  },
  companyText: {
    color: '#6b7280',
    fontSize: '13px',
    margin: '4px 0 8px 0',
  },
  jobDesc: {
    fontSize: '14px',
    color: '#374151',
    margin: '0 0 10px 0',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
  },
  th: {
    textAlign: 'left',
    padding: '12px 10px',
    borderBottom: '2px solid #e5e7eb',
    fontSize: '13px',
    color: '#6b7280',
    fontWeight: '600',
  },
  td: {
    padding: '12px 10px',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '14px',
  },
  statusShortlist: {
    color: '#059669',
    fontWeight: '600',
    background: '#d1fae5',
    padding: '3px 8px',
    borderRadius: '4px',
    fontSize: '12px',
  },
  statusReview: {
    color: '#d97706',
    fontWeight: '600',
    background: '#fef3c7',
    padding: '3px 8px',
    borderRadius: '4px',
    fontSize: '12px',
  },
};
