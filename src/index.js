#! /usr/bin/env node

import CMD from 'cmdpp-core';
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import jsonfile from 'jsonfile';
import { getPath, mkdir } from './utils';

var question = {
    type: 'input',
    name: 'command',
    message: 'Data: 0 B | Money: $0 >'
};

var fsCheck = (fileName, cb) => {
    // fs.access(fileName, fs.F_OK | fs.R_OK | fs.W_OK, (err) => {
    //     if (err) {
    //         console.error(err);
    //         process.exit(1);
    //     }
    //     cb();
    // });

    try {
        fs.access(fileName);
    } catch (err) {
        // console.error(err);
        return false;
    }
    return true;
};

const savePath = getPath('.cmdPP', 'save.json');

var cmd = new CMD({
    save: (cmdData) => {
        mkdir('.cmdPP');
        // fs.access(getPath('.cmdPP', 'save.json'), fs.F_OK | fs.R_OK | fs.W_OK, (err) => {
        //     if (err) {
        //         console.error(err);
        //         process.exit(1);
        //     }
        //     jsonfile.writeFileSync(getPath('.cmdPP', 'save.json'), cmdData, { spaces: 2 });
        //
        //     jsonfile.writeFile(getPath('.cmdPP', 'save.json'), cmdData, (err2) => {
        //         if (err) {
        //             console.error(err);
        //             process.exit(1);
        //         }
        //     });
        // });
        // fsCheck(savePath, () => {
        //     jsonfile.writeFileSync(savePath, cmdData, { spaces: 2 });
        // });
        if (fsCheck(savePath)) {
            jsonfile.writeFileSync(savePath, cmdData, { spaces: 2 });
        } else {
            console.error('Cannot access save.');
        }
    },
    load: () => {
        // return jsonfile.readFileSync(getPath('.cmdPP', 'save.json'));
        // fsCheck(savePath, () => {
        //     if (err) {
        //         mkdir('.cmdPP');
        //         var newObj = {
        //             data: 0,
        //             money: 0,
        //             increment: 1,
        //             autoIncrement: 0,
        //             unlocked: []
        //         };
        //         jsonfile.writeFileSync(savePath, newObj, { spaces: 2 });
        //     } else {
        //
        //     }
        // });
        if (fsCheck(savePath)) {
            return jsonfile.readFileSync(savePath);
        } else {
            mkdir('.cmdPP');
            jsonfile.writeFileSync(savePath, {
                data: 0,
                money: 0,
                increment: 1,
                autoIncrement: 0,
                unlocked: []
            }, { spaces: 2 });
            return jsonfile.readFileSync(savePath);
        }
    },
    update: (cmdObj) => {
        // ui.updateBottomBar(`Data: ${cmdObj.formatBytes()}\tMoney: $${cmdObj.money}`);
        question.message = `Data: ${cmdObj.formatBytes()} | Money: $${cmdObj.money} >`;
    }
});



// console.log(questions);



function createInquiry() {
    var inquirerCB = (ans) => {
        // console.log(ans);
        if (ans.command === "quit" || ans.command === "q") {
            cmd.command('save');
            cmd.respond("Now exiting.");
            process.exit(0);
        }
        cmd.command(ans.command);
        createInquiry();
    };
    inquirer.prompt([question], inquirerCB);
}

createInquiry();
