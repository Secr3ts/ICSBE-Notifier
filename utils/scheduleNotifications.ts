import cron from 'node-cron';
import { SimpleEvent } from './parseData.js';
import { sendNotification } from './sendNotification.js';
import { log } from './utils.js';
import * as emoji from 'node-emoji';
import chalk from 'chalk';
import { Ora } from 'ora';

export async function scheduleTasks(events: Map<string,SimpleEvent[]>[], spinner: Ora) {
    const twelfth = events[0];
    const fifth = events[1];

    let midday = cron.schedule('0 12 * * *', async () => {
        spinner.stop().clear();
        console.log()
        let formattedDate = new Date().toISOString().split('T')[0];

        twelfth?.forEach(async (value, key) => {
            for (const event of value) {
                if (event.endTime === formattedDate) {
                    await sendNotification(key, event.location).then(() => spinner.start());
                }
            }
        })
        spinner.start();
    });

    let afternoon = cron.schedule('0 17 * * *', () => {
        spinner.stop().clear();
        console.log();
        let formattedDate = new Date().toISOString().split('T')[0];

        fifth ?.forEach(async (value, key) => {
            for (const event of value) {
                if (event.endTime === formattedDate) {
                    await sendNotification(key, event.location).then(() => spinner.start());
                }
            }
        })
        spinner.start();
    })

    log(emoji.get('earth_africa'), `Cron tasks: ${chalk.underline.green('scheduled')}`)
    return [midday, afternoon];
};