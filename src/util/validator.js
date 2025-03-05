export const isEmpty = (namaField, val) => {
    if (!val) {
        throw new Error(namaField + " can't be Empty!!!");
    }
}
export const isPanjangStr = (namaField, str, min = -1, max = -1) => {
    if (min != -1) {
        if (!str) {
            throw new Error(namaField + " can't be Empty!!!");
        }
        if (str.length < min) {
            throw new Error(namaField + " can't be under " + min.toString() + "!!!");
        }
    }
    if (max != -1) {
        if (str.length > max) {
            throw new Error(namaField + " can't be over " + max.toString() + "!!!");
        }
    }
}
export const hasSpace = (namaField, str) => {
    if (str.includes(' ')) {
        throw new Error(namaField + " can't have space!!!");
    };
};

export const isInt = (namaField, str) => {
    if (str === null || str === undefined || str === '') {
        throw new Error(namaField + " can't be Empty!!!");
    }
    const parsed = parseInt(str, 10);
    if (!(!isNaN(parsed) && parsed.toString())) {
        throw new Error(namaField + " must be Integer " + min.toString() + "!!!");
    }
}
export const isMoneyAja = (namaField, str) => {
    if (str === null || str === undefined || str === '') {
        throw new Error(namaField + " can't be Empty!!!");
    }
    const parsed = parseFloat(str);
    if (isNaN(parsed)) {
        throw new Error(namaField + " must be a valid MONEY format!!!");
    }
}
export const isMoney = (namaField, str) => {
    if (str === null || str === undefined || str === '') {
        throw new Error(namaField + " can't be Empty!!!");
    }
    const parsed = parseFloat(str);
    if (isNaN(parsed)) {
        throw new Error(namaField + " must be a valid MONEY format!!!");
    }
    if (parsed < 0) {
        throw new Error(namaField + " must be greater than or equal to 0!!!");
    }
}

export const isIn = (namaField, str, arr) => {
    if (str === null || str === undefined || str === '') {
        throw new Error(namaField + " can't be Empty!!!");
    }
    if (!arr.includes(str)) {
        throw new Error(namaField + " must be in options !!!");
    }
}
export const isInValue = (namaField, str, arr, errText = '') => {
    if (str === null || str === undefined || str === '') {
        if (errText == '') {
            throw new Error(namaField + " can't be Empty!!!");
        }
        throw new Error(errText);
    }
    if (!arr.find(obj => obj.value == str)) {
        if (errText == '') {
            throw new Error(namaField + " must be in options !!!");
        }
        throw new Error(errText);
    }
}
export const isInRegex = (namaField, errText, str, regex) => {
    if (!regex.test(str)) {
        throw new Error(namaField + " invalid, " + errText + "!!!");
    }
}
export const cekValidDate = (sDate) => {
    const date = new Date(sDate);
    const year = date.getFullYear();
    return date instanceof Date && !isNaN(date) && year > 1900 && year <= 2500;
}
export const isValidDate = (namaField, sDate) => {
    if (!cekValidDate(sDate)) {
        throw new Error(namaField + " invalid!!!");
    }
}
export const isValid2Date = (startDate, endDate) => {
    if (!startDate) {
        throw new Error("startDate can't be Empty!!!");
    }
    if (!endDate) {
        throw new Error("endDate can't be Empty!!!");
    }

    if (new Date(startDate) > new Date(endDate)) {
        throw new Error("StartDate must be before EndDate!!!");
    }
}
export const searchArrByLbl = (arr, searchText) => {
    return arr.find(obj => obj.label == searchText) || null;
}
export const searchArrByVal = (arr, searchText) => {
    return arr.find(obj => obj.value == searchText) || null;
}
export const cleanNumber = (text) => {
    let cleanedText = text.replace(/,/g, '').replace(/\.00$/, '');
    return cleanedText;
}
export const cekAdaData = (response, errText) => {
    if (response != 0) {
        throw new Error(errText);
    }
}