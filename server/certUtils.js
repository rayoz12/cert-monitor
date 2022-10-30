
export function dateDiffInDays(a, b) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

export function subjectParser(subjectString) {
    const parts = subjectString.split("\n");
    const parsed = {};
    for (const field of parts) {
        const fieldSplit = field.split("=");
        parsed[fieldSplit[0]] = fieldSplit[1];
    }
    return parsed;
}

export function isCertValid(expiry) {
    const now = new Date();
    return (new Date(expiry)) > now;
}