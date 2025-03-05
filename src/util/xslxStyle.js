export const addCell = (row, style, value, type = 's', format = '', formula = '') => {
    const val = (value == null ? '': value);
    
    row.push({ v: val, s: style, t: type, z: format, f: formula });
    return row;
}
export const XLSXSTYLE = {
    BoldS9: {
        font: { bold: true, sz: 9 }
    },
    BoldS9BottomRight: {
        font: { bold: true, sz: 9 },
        alignment: {
            horizontal: "right",
            vertical: "bottom",
        }
    },
    S9BorderHair: {
        font: { sz: 9 },
        border: { 
            top: {style: "hair"},
            bottom: {style: "hair"},
            left: {style: "hair"},
            right: {style: "hair"},
        }
    },
    S9BottomRightBorderHair: {
        font: { sz: 9 },
        alignment: {
            horizontal: "right",
            vertical: "bottom",
        },
        border: { 
            top: {style: "hair"},
            bottom: {style: "hair"},
            left: {style: "hair"},
            right: {style: "hair"},
        }
    },
    BoldS9CenterBorderHair: {
        font: { bold: true, sz: 9 },
        alignment: { horizontal: "center" },
        border: { 
            top: {style: "hair"},
            bottom: {style: "hair"},
            left: {style: "hair"},
            right: {style: "hair"},
        }
    },
    BoldS10: {
        font: { bold: true, sz: 10 }
    },
    BoldS10Center: {
        font: { bold: true, sz: 10 },
        alignment: { horizontal: "center" }
    },
}
export const thousandSeparator = (num) => {
    let rounded = (Math.round(num * 10 ** 0) / 10 ** 0).toFixed(0);
    return rounded.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}