import { inspect } from "util";
import { resolve } from "path";

import express from 'express';
import cors from "cors";
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';

import { FSCertManager } from './certManager.js';
import { CertExpirationWatcher } from "./certExpirationWatcher.js";

dotenv.config();

const alertsEnv = process.env["ALERT_NOTICE"];
let alerts = [14, 7, 5, 3, 2, 1];
if (alertsEnv) {
    alerts = alertsEnv.split(" ").map(it => parseInt(it));
}

const certManager = new FSCertManager();
const watcher = new CertExpirationWatcher([certManager], alerts);

watcher.on("expiry_alert", (cert, expiredIn) => {
    const gotify_url = process.env["GOTIFY_URL"];
    const gotify_token = process.env["GOTIFY_TOKEN"];
    if (gotify_url && gotify_token) {
        const message = {
            title: `${cert.website} Certificate Expiring in ${expiredIn} days`,
            message: `Renew ${cert.website}`,
            priority: 5
        }
        fetch(`${gotify_url}/message?token=${gotify_token}`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(message)
        })
    }
});

// watcher.verify();

// Express Code
const app = express();
const port = 3000;

app.use(cors());
const router = express.Router();

router.get("/", async (req, res) => {
    const certs = await certManager.describeCerts();
    console.log(inspect(certs, undefined, null, true));
    res.json(certs);
});

app.use("/certs", router);

app.use(express.static("public"));

app.get("/", (req, res) => {
    console.log("Sending index");
    res.sendFile(resolve("public", "index.html"));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
