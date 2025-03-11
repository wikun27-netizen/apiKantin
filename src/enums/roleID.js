export const ROLE_ID = Object.freeze({
    Admin: 0,
    Penjual: 1,
    Pembeli: 2
});

export const ROLE_NAME = Object.freeze(
    Object.fromEntries(Object.entries(ROLE_ID).map(([key, value]) => [value, key]))
);

export const getRoleName = (value) => {
    return Object.keys(ROLE_ID).find(key => ROLE_ID[key] === value) || 'Unknown';
};