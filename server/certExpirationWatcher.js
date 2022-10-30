import { EventEmitter } from "events";
import { schedule } from "node-cron";

export class CertExpirationWatcher extends EventEmitter {
    
    sources;
    alertsConfig;

    /**
     * 
     * @param {*} sources Cert source
     * @param {number[]} alertsConfig an array of days of notice to send a notification for
     */
    constructor(sources, alertsConfig) {
        super();
        this.sources = sources;
        this.alertsConfig = alertsConfig;

        if (alertsConfig.length === 0) {
            console.warn("[CertExpirationWatcher] Alerts Config doesn't have any alerts configured!");
        }

        schedule("0 0 9 * * * *", this.verify);
    }

    /**
     * Goes through each source and check if we're on the day of expiration
     */
    async verify() {
        for (const source of this.sources) {
            const certs = await source.describeCerts();
            for (const cert of certs) {
                if (cert.expiresIn !== "Expired" && this.alertsConfig.includes(cert.expiresIn)) {
                    this.emit("expiry_alert", cert, cert.expiresIn);
                }
            }
        }
    }


}