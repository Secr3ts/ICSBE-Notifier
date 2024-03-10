import chalk from 'chalk';
import { log } from './utils.js';
import admin from 'firebase-admin';
import * as emoji from 'node-emoji';

export async function sendNotification(title: string, message: string) {
    let messaging = admin.messaging();

    let notification: SimpleNotification = {
        data: {
            title: title,
            message: message
        },
        topic: "salles"
    };

    await messaging.send(notification).then(response => {
        log(emoji.get('package'), `Success. ${chalk.underline(response.slice(undefined,response.length/2))}${chalk.green('[...]')}`)
    }).catch(err => {
        let error = err.toString();
        log(emoji.get('negative_squared_cross_mark'), `Error. ${error.slice(undefined,error.length/2)}[...]`)
    })
}


type SimpleNotification = {
    data: {
        title: string,
        message: string
    },
    topic: string
}