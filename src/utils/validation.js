// src\utils\validation.js
export const validateBookForm = (book) => {
  const errors = {};
  
  if (!book.maSach) errors.maSach = 'Mã sách là bắt buộc';
  if (!book.tenSach) errors.tenSach = 'Tên sách là bắt buộc';
  if (!book.maNXB) errors.maNXB = 'Nhà xuất bản là bắt buộc';
  if (!book.donGia || book.donGia <= 0) errors.donGia = 'Đơn giá phải lớn hơn 0';
  if (!book.soQuyen || book.soQuyen < 0) errors.soQuyen = 'Số quyển không hợp lệ';
  if (!book.namXuatBan || book.namXuatBan < 1900) errors.namXuatBan = 'Năm xuất bản không hợp lệ';
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateReaderForm = (reader) => {
  const errors = {};
  
  if (!reader.maDocGia) errors.maDocGia = 'Mã độc giả là bắt buộc';
  if (!reader.hoLot) errors.hoLot = 'Họ lót là bắt buộc';
  if (!reader.ten) errors.ten = 'Tên là bắt buộc';
  if (!reader.email) errors.email = 'Email là bắt buộc';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reader.email)) errors.email = 'Email không hợp lệ';
  if (!reader.password) errors.password = 'Mật khẩu là bắt buộc';
  else if (reader.password.length < 6) errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validatePublisherForm = (publisher) => {
  const errors = {};
  
  if (!publisher.maNXB) errors.maNXB = 'Mã NXB là bắt buộc';
  if (!publisher.tenNXB) errors.tenNXB = 'Tên NXB là bắt buộc';
  if (!publisher.diaChi) errors.diaChi = 'Địa chỉ là bắt buộc';
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateStaffForm = (staff) => {
  const errors = {};
  
  if (!staff.MSNV) errors.MSNV = 'MSNV là bắt buộc';
  if (!staff.hoTenNV) errors.hoTenNV = 'Họ tên là bắt buộc';
  if (!staff.chucVu) errors.chucVu = 'Chức vụ là bắt buộc';
  if (!staff.diaChi) errors.diaChi = 'Địa chỉ là bắt buộc';
  if (!staff.soDienThoai) errors.soDienThoai = 'Số điện thoại là bắt buộc';
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};