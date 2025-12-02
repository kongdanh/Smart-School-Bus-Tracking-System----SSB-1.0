import * as XLSX from 'xlsx';
import schoolService from '../services/schoolService';

/**
 * Export dữ liệu ra file Excel
 * @param {Array} data - Mảng dữ liệu cần export
 * @param {String} fileName - Tên file (không có .xlsx)
 * @param {String} sheetName - Tên sheet (mặc định: 'Sheet1')
 */
export const exportToExcel = (data, fileName, sheetName = 'Data') => {
    if (!data || data.length === 0) {
        alert('Không có dữ liệu để export');
        return;
    }

    try {
        // Tạo workbook
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

        // Set độ rộng cột tự động
        const colWidths = Object.keys(data[0]).map(key => ({
            wch: Math.max(
                key.length,
                Math.max(...data.map(row => String(row[key] || '').length))
            )
        }));
        worksheet['!cols'] = colWidths;

        // Download file
        XLSX.writeFile(workbook, `${fileName}_${new Date().getTime()}.xlsx`);
    } catch (error) {
        console.error('Export error:', error);
        alert('Lỗi khi export file');
    }
};

/**
 * Export học sinh
 */
export const exportStudents = async (students) => {
    try {
        // Fetch all parents
        const parentsRes = await schoolService.getAllParents?.();
        const parents = parentsRes?.data || [];
        const parentMap = {};
        parents.forEach(p => {
            parentMap[p.id] = p.hoTen || p.tenPhuHuynh || '';
        });

        const data = students.map((student, index) => ({
            'STT': index + 1,
            'Mã HS': student.maHS || '',
            'Tên Học Sinh': student.hoTen || '',
            'Lớp': student.lop || '',
            'Phụ Huynh': parentMap[student.phuHuynh] || student.phuHuynh || '',
            'Số Điện Thoại': student.soDienThoaiPH || '',
            'Điểm Đón': student.diemDon || '',
            'Điểm Trả': student.diemTra || ''
        }));
        exportToExcel(data, 'DanhSachHocSinh', 'Học Sinh');
    } catch (error) {
        console.error('Error exporting students:', error);
        // Fallback if parent API not available
        const data = students.map((student, index) => ({
            'STT': index + 1,
            'Mã HS': student.maHS || '',
            'Tên Học Sinh': student.hoTen || '',
            'Lớp': student.lop || '',
            'Phụ Huynh': student.phuHuynh || '',
            'Số Điện Thoại': student.soDienThoaiPH || '',
            'Điểm Đón': student.diemDon || '',
            'Điểm Trả': student.diemTra || ''
        }));
        exportToExcel(data, 'DanhSachHocSinh', 'Học Sinh');
    }
};

/**
 * Export tài xế
 */
export const exportDrivers = (drivers) => {
    const data = drivers.map((driver, index) => ({
        'STT': index + 1,
        'Mã Tài Xế': driver.maTX || '',
        'Tên Tài Xế': driver.hoTen || '',
        'Số Điện Thoại': driver.soDienThoai || '',
        'Email': driver.email || '',
        'Biển Số Xe': driver.bienSoXe || '',
        'Giấy Phép': driver.giayPhep || '',
        'Trạng Thái': driver.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'
    }));
    exportToExcel(data, 'DanhSachTaiXe', 'Tài Xế');
};

/**
 * Export xe buýt
 */
export const exportBuses = (buses) => {
    const data = buses.map((bus, index) => ({
        'STT': index + 1,
        'Mã Xe': bus.maBX || '',
        'Tên Xe': bus.tenBX || '',
        'Biển Số': bus.bienSo || '',
        'Số Chỗ Ngồi': bus.soChoNgoi || '',
        'Tài Xế': bus.taiXe || '',
        'Số Điện Thoại': bus.soDienThoaiTaiXe || '',
        'Trạng Thái': bus.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'
    }));
    exportToExcel(data, 'DanhSachXeBus', 'Xe Bus');
};

/**
 * Export tuyến đường
 */
export const exportRoutes = (routes) => {
    const data = routes.map((route, index) => ({
        'STT': index + 1,
        'Mã Tuyến': route.maTuyen || '',
        'Tên Tuyến': route.tenTuyen || '',
        'Điểm Xuất Phát': route.diemXuatPhat || '',
        'Điểm Kết Thúc': route.diemKetThuc || '',
        'Số Điểm Dừng': route.sodiemDung || 0,
        'Số Học Sinh': route.soHocSinh || 0,
        'Tài Xế': route.taiXe || '',
        'Xe Bus': route.xeBus || ''
    }));
    exportToExcel(data, 'DanhSachTuyen', 'Tuyến Đường');
};
