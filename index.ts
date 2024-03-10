import admin from "firebase-admin";
import * as emoji from 'node-emoji';
import chalk from "chalk";
import { readFileSync } from "fs";
import { checkJSON, log } from "./utils/utils.js";
import { cert } from "firebase-admin/app";
import { parseData, separateData } from "./utils/parseData.js";
import { sendNotification } from "./utils/sendNotification.js";
import { scheduleTasks } from "./utils/scheduleNotifications.js";
import ora from "ora";
import { api } from "./utils/api.js";

await checkJSON().then(res => {
    admin.initializeApp({
        credential: cert('./' + res)
    })
    let message: string = `[${emoji.get('white_check_mark')}] Logged into ${chalk.red(JSON.parse(readFileSync('./service-account.json', 'utf8'))['project_id'])}`;
    console.log(message);
});

let events = separateData(parseData());

log(emoji.get('alarm_clock')!, `Current date: ${chalk.blue(new Date(Date.now()))}`);

await sendNotification('Info', 'Server (re)started.');


let spinner = ora({
    color: 'gray',
    spinner: 'material',
    text: 'Waiting..'
})

let tasks = await scheduleTasks(events, spinner);

api();
spinner.start();