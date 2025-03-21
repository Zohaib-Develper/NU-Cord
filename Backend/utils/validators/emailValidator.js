function isValidFastNuEmail(email) {
    console.log("Validating Email:", email);
    const campusCodes = ['l', 'i', 'k', 'c', 'p']; 
    const validDomains = ['lhr.nu.edu.pk', 'isb.nu.edu.pk', 'khi.nu.edu.pk', 'cfd.nu.edu.pk', 'pwr.nu.edu.pk'];

    const [localPart, domain] = email.split('@');

    if (!validDomains.includes(domain)) {
        return false;
    }

    const campusCode = localPart.charAt(0);
    if (!campusCodes.includes(campusCode)) {
        return false;
    }

    const studentID = localPart.slice(1);
    if (!/^\d{6}$/.test(studentID)) {
        return false;
    }

    return true;
}

module.exports = isValidFastNuEmail;