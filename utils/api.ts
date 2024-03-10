import express from 'express';
import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import { log } from './utils.js';
import * as emoji from 'node-emoji';
import chalk from 'chalk';
import admin from 'firebase-admin';

export function api() {
    let app = express();


    const appCheckVerification = async (req: Request, res: Response, next: NextFunction) => {
        const appCheckToken = req.header("X-Firebase-AppCheck");

        if (!appCheckToken) {
            res.status(401);
            return next("Unauthorized");
        }

        try {
            const appCheckClaims = await admin.appCheck().verifyToken(appCheckToken);

            // If verifyToken() succeeds, continue with the next middleware
            // function in the stack.
            return next();
        } catch (err) {
            res.status(401);
            return next("Unauthorized");
        }
    }


    app.get('/', (req, res) => {
        res.send('test');
    })

    app.post('/upload-ics', [appCheckVerification], (req: Request, res: Response) => {
        // verify token

        // Store the file under the ics/ directory
        const file = req.body;
        const filePath = './ics/' + file.name;

        fs.writeFile(filePath, file.data, (err) => {
            if (err) {
                log(emoji.get('negative_squared_cross_mark'), err.code!);
                res.status(500).send('success');
            } else {
                res.send('error');
            }
        });
    });

    app.listen(3000);

    log(emoji.get('office'), `API ${chalk.green('started')}`);
}