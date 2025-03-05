export const vbcrlf = '\n'
export const parseReturnMySQL = (response, errText = '') => {
    if (!Array.isArray(response) || response[0].length === 0) {
        if (errText != '') {
            throw new Error(errText);
        }
        return 0;
    }
    return response[0];
}
export const getStr = (val) => {
    if (!val) {
        return ''
    }
    return val.toString()
}
export const fromOADate = (oaDate) => {
    // OLE Automation date base
    const baseDate = new Date(Date.UTC(1899, 11, 30)); // 30 Desember 1899
    // Tambahkan jumlah hari dalam milidetik
    return new Date(baseDate.getTime() + oaDate * 86400000); // 86400000 ms dalam satu hari
}
export const formatSQLDatetime = (date) => {
  const pad = (num) => (num < 10 ? '0' + num : num); // Menambahkan 0 di depan angka jika kurang dari 10
  const month = pad(date.getMonth() + 1); // Bulan dimulai dari 0
  const day = pad(date.getDate());
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  
  return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
}
export const formatSQLDate = (date) => {
    const pad = (num) => (num < 10 ? '0' + num : num); // Menambahkan 0 di depan jika kurang dari 10
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // Bulan dimulai dari 0
    const day = pad(date.getDate());
    
    return `${year}-${month}-${day}`;
}