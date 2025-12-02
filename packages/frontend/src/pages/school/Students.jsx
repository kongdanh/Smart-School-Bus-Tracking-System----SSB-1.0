import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import schoolService from '../../services/schoolService';
import { exportStudents } from '../../utils/exportUtils';
import { toast } from 'react-toastify';
import '../../styles/school-styles/school-students.css';

const Students = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await schoolService.getAllStudents();

      if (response.success) {
        setStudents(response.data || []);
      } else {
        toast.warning("Không thể tải danh sách học sinh");
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error("Lỗi khi tải danh sách học sinh");
    } finally {
      setLoading(false);
    }
  };

  const classes = ['all', '3A', '4B', '5A'];
  const filteredStudents = students.filter(s => {
    const search = searchTerm.toLowerCase();
    return (s.hoTen?.toLowerCase().includes(search) || s.maHS?.toLowerCase().includes(search)) &&
      (filterClass === 'all' || s.lop === filterClass);
  });

  return (
    <>
      <div className="school-students-container">

        {/* Header */}
        <div className="students-header">
          <div className="header-content">
            <h1>Students Management</h1>
            <p className="header-subtitle">Manage and monitor all students in the system</p>
          </div>
          <button className="btn-add-student" onClick={() => navigate('/school/students/add')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add New Student
          </button>
        </div>

        {/* Stats */}
        <div className="students-stats">
          <div className="stat-box total">
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{students.length}</div>
              <div className="stat-label">Total Students</div>
            </div>
          </div>
          <div className="stat-box classes">
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{classes.length - 1}</div>
              <div className="stat-label">Classes</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="students-filters">
          <div className="search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input type="text" placeholder="Search by name or student ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>

          <div className="filter-group">
            <select value={filterClass} onChange={e => setFilterClass(e.target.value)} className="filter-select">
              <option value="all">All Classes</option>
              {classes.filter(c => c !== 'all').map(cls => <option key={cls} value={cls}>Class {cls}</option>)}
            </select>

            <button className="btn-export-old" onClick={() => exportStudents(filteredStudents)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export Excel
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="students-table-container">
          <table className="students-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Class</th>
                <th>Route</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.hocSinhId}>
                  <td><div className="student-id">{student.maHS}</div></td>
                  <td>
                    <div className="student-info">
                      <div className="student-avatar">{student.avatar}</div>
                      <div>
                        <div className="student-name">{student.hoTen}</div>
                        <div className="parent-name">{student.phuHuynh}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="class-badge">{student.lop}</span></td>
                  <td><span className="route-badge">{student.route}</span></td>
                  <td>
                    <div className="contact-cell">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      <span>{student.soDienThoaiPH}</span>
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-action view" onClick={() => setSelectedStudent(student)} title="View Details">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                      <button className="btn-action edit" onClick={() => navigate(`/school/students/${student.id}/edit`)} title="Edit">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button className="btn-action delete" title="Delete">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {selectedStudent && (
          <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Student Details</h2>
                <button className="modal-close" onClick={() => setSelectedStudent(null)}>✕</button>
              </div>
              <div className="modal-body">
                <div className="modal-avatar-large">{selectedStudent.avatar}</div>
                <h3>{selectedStudent.hoTen}</h3>
                <p className="modal-id">{selectedStudent.maHS} • Class {selectedStudent.lop}</p>

                <div className="modal-info-grid">
                  <div><strong>Parent:</strong> {selectedStudent.phuHuynh}</div>
                  <div><strong>Contact:</strong> {selectedStudent.soDienThoaiPH}</div>
                  <div><strong>Route:</strong> <span className="route-badge">{selectedStudent.route}</span></div>
                  <div className="full-width">
                    <strong>Pickup Point:</strong><br />
                    <span className="location-detail">{selectedStudent.diemDon}</span>
                  </div>
                  <div className="full-width">
                    <strong>Drop Point:</strong><br />
                    <span className="location-detail">{selectedStudent.diemTra}</span>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-close-modal-final" onClick={() => setSelectedStudent(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Students;