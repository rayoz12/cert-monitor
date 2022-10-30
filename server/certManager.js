import { X509Certificate } from "crypto";
import { readdir, readFile } from "fs/promises";
import { resolve } from "path";
import { isCertValid, subjectParser, dateDiffInDays } from "./certUtils.js";


/**
 * Extremely simple class that reads from the file system
 */
export class FSCertManager {

    dir = process.env["CERT_DIR"] || "certs";

    constructor() {
        
    }

    async describeCerts() {
        const certs = await this.getCerts();
        // console.log(certs);
        const now = new Date();
        return certs.map(it => {
            const difference = dateDiffInDays(now, new Date(it.validTo));
            let website = "unknown";
            let issuer = "unknown";
            if (it.subject) {
                const parsed = subjectParser(it.subject);
                website = parsed["CN"] || "unknown"
            }

            if (it.issuer) {
                const parsed = subjectParser(it.issuer);
                issuer = parsed["O"] || "unknown"
            }


            return {
                cert: {
                    subject: it.subject ? subjectParser(it.subject) : undefined,
                    issuer: it.issuer ? subjectParser(it.issuer) : undefined,
                    subjectAltName: it.subjectAltName,
                    infoAccess: it.infoAccess,
                    validFrom: it.validFrom,
                    validTo: it.validTo,
                    fingerprint256: it.fingerprint256
                },
                website,
                issuer,
                expiry: new Date(it.validTo),
                expiresIn: difference > 0 ? difference : "Expired",
                status: isCertValid(it.validTo),
            }
        });
    }

    async getCerts() {
        // Read the certs from the file system
        const fileNames = await readdir(this.dir);
        // console.log(fileNames);
        const paths = fileNames.map(file => resolve(this.dir, file));
        const certsRaw = await Promise.all(paths.map(it => readFile(it)));
        const certs = certsRaw.map(it => new X509Certificate(it));
        return certs;
    }


}