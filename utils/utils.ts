import { readFileSync, readdirSync } from "fs";
import path from "path";
import { exit } from "process";
import * as emoji from 'node-emoji';
import inquirer from 'inquirer';

export async function checkJSON(): Promise<string> {
    let files = readdirSync('./');
    let res: string = '';
    let jsonFiles = files.filter(file => path.extname(file) === '.json');
    let len: number = jsonFiles.length;

    let cleanedJSONFiles = checkJSONContent(jsonFiles);

    if (len === 0 || cleanedJSONFiles.length === 0) {
        log(emoji.get('negative_squared_cross_mark'), 'No service account / JSON detected !');
        exit(0);
    } else if (len > 1) {
        res = await listPrompt("choose a .json file", jsonFiles, cleanedJSONFiles[0]);
    }

    return res;
}


export function log(e: string | undefined, m: string) {
    let message: string = `[${e}] ${m}`;
    console.log(message);
}

export function checkJSONContent(jsonFiles: string[]) {
    let cleanedJSONFiles: string[] = [];

    jsonFiles.forEach(value => {
        let data = readFileSync(value, 'utf8');
        if (data.includes("project_id")) {
            cleanedJSONFiles.push(value);
        }
    });
    return cleanedJSONFiles;
}

export async function listPrompt(message: string, choices: string[], defaultChoice?: string): Promise<string> {
    let type: string = "list";
    let name: string = "q";

    let answer = choices[0]!;

    await inquirer.prompt([{
        type: type,
        name: name,
        message: message,
        choices: choices,
        default: defaultChoice,
    }]).then(answers => {
        answer = answers.q;
    })

    return answer;
}