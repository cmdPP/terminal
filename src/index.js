#! /usr/bin/env node

// TODO: Fix save issues

import CMD from 'cmdpp-core';
import inquirer from 'inquirer';
import fs from 'fs';
import jsonfile from 'jsonfile';
import { getPath } from './utils';

var question = {
    type: 'input',
    name: 'command',
    message: 'Data: 0 B | Money: $0 >'
};

var fsCheck = (fileName) => {
    try {
        fs.accessSync(fileName);
    } catch (err) {
        return false;
    }
    return true;
};

const saveDir = getPath('.cmdPP');
const savePath = getPath('.cmdPP', 'save.json');

if (!fsCheck(saveDir)) {
    console.warn(`Save directory does not exist. Creating now at ${saveDir}`);
    fs.mkdirSync(saveDir);
}
if (!fsCheck(savePath)) {
    console.warn(`Save file does not exist. Creating now at ${savePath}`);
    fs.closeSync(fs.openSync(savePath, 'w'));
}

var cmd = new CMD({
    debug: false,
    funcs: {
        save: (cmdData) => {
            jsonfile.writeFileSync(savePath, cmdData, { spaces: 2 });
        },
        load: () => {
            return jsonfile.readFileSync(savePath);
        },
        update: (cmdObj) => {
            question.message = `Data: ${cmdObj.formatBytes()} | Money: $${cmdObj.money} >`;
        },
        reset: () => {
            fs.unlinkSync(savePath);
        }
    },
    commandProvider: function() {
        return {
            quit: {
                func: () => {
                    this.command('save');
                    this.respond('Now exiting.');
                    process.exit(0);
                },
                desc: "Saves and exits game.",
                unlocked: true
            }
        };
    }
});

function createInquiry() {
    var inquirerCB = (ans) => {
        // if (ans.command === "quit" || ans.command === "q") {
        //     cmd.command('save');
        //     cmd.respond("Now exiting.");
        //     process.exit(0);
        // }
        cmd.command(ans.command);
        createInquiry();
    };
    inquirer.prompt([question], inquirerCB);
}

createInquiry();
