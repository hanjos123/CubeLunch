/**
 * Format số (3000 => 3,000)
 * @param number Số muốn forat
 * @param string chuỗi muốn ngăn cách
 * @returns Number số sau khi format
 */
export const formatNumber = (number, comma = ",") => {
  if(!number) {
    return '-';
  }
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, comma);
}

/**
 * Lấy ra id mới
 * @returns String trả về Id
 */
export const generateId = () => {
  const date = new Date();

  const year = date.getFullYear(); // Năm
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng (phải thêm 1 vì tháng trong JavaScript bắt đầu từ 0)
  const day = String(date.getDate()).padStart(2, "0"); // Ngày
  const hours = String(date.getHours()).padStart(2, "0"); // Giờ
  const minutes = String(date.getMinutes()).padStart(2, "0"); // Phút
  const seconds = String(date.getSeconds()).padStart(2, "0"); // Giây

  const formattedDate = `${year}${month}${day}${hours}${minutes}${seconds}`;
  return formattedDate;
};
