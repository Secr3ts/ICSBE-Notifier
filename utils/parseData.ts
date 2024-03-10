import * as fs from 'fs';
import * as path from 'path';
import ical from 'ical';
import * as emoji from 'node-emoji';
import chalk from 'chalk';

export function parseData(): Map<string,any> {
    const files: string[] = fs.readdirSync("./ics/");
    const icsFiles: string[] = files.filter(file => path.extname(file) === '.ics');

    let data: Map<string, any> = new Map<string, any>();

    icsFiles.forEach((value, index, array) => {
        let name: string = value.split('.')[0]!;
        let icsData: string = fs.readFileSync(path.join('./ics/' + value), "utf8");
        
        let parsedIcsData = ical.parseICS(icsData)!;
        let parsedEvents = [];

        for (let vevent in parsedIcsData) {
            if (parsedIcsData.hasOwnProperty(vevent)) {
                let event = parsedIcsData[vevent]!;

                let fullDate: string[] = event.end!.toISOString().split('T');
                let date = fullDate[0];
                let hour = parseInt(fullDate[1]?.split(':')[0]! + 1);

                let parsedEvent: SimpleEvent = {
                    endTime: `${date} + ${hour}`,
                    location: event.location!
                }

                if (hour !== 17 && hour !== 12) { continue;}

                parsedEvents.push(parsedEvent);
            }
        }
        data.set(name, parsedEvents)
    });

    const message = `[${emoji.get('memo')}] Reading & Parsing ${chalk.red(icsFiles.toString())}`;
    console.log(message);

    return data;
};

export function separateData(data: Map<string, SimpleEvent[]>): Map<string, SimpleEvent[]>[] {
    let m = new Map<string, any>();
    let a = new Map<string, any>();

    let midday: SimpleEvent[] = [];
    let afternoon: SimpleEvent[] = [];

    data.forEach((value, key) => {
        for (let ev of value) {
            let time = ev.endTime.split('')[0]!;
            ev.endTime = time;

            if (time === '12') {
                midday.push(ev);
            } else {
                afternoon.push(ev);       
            }
        }
        m.set(key, midday);
        a.set(key, afternoon);
    });

    const message = `[${emoji.get('rocket')}] Separated ${chalk.red('12pm')}/${chalk.red('5pm')}`;
    console.log(message);

    return [m, a];
};

export type SimpleEvent = {
    endTime: string,
    location: string
}