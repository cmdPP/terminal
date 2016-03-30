#! /usr/bin/env node
import { Name } from 'charlatan';
import Moniker from 'moniker';
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

var createNewSave = () => {
    fs.closeSync(fs.openSync(savePath, 'w'));
    jsonfile.writeFileSync(savePath, {
        data: 0,
        money: 0,
        increment: 1,
        autoIncrement: 1,
        storage: "selectronTube",
        unlocked: []
    }, { spaces: 2 });
};

console.log('Save dir:', saveDir);
console.log('Save path:', savePath);
if (!fsCheck(saveDir)) {
    console.warn(`Save directory does not exist. Creating now at ${saveDir}`);
    fs.mkdirSync(saveDir);
}
if (!fsCheck(savePath)) {
    console.warn(`Save file does not exist. Creating now at ${savePath}`);
    createNewSave();
}

var cmd = new CMD(
    (...txt) => txt.forEach((l) => console.log(l)),
    (cmdData) => jsonfile.writeFileSync(savePath, cmdData, { spaces: 2 }),
    () => {
        try {
            return jsonfile.readFileSync(savePath);
        } catch (e) {
            console.error('There seems to be a problem with your save file.');
            console.error('A new save file will be created.');
            createNewSave();
            return jsonfile.readFileSync(savePath);
        }
    },
    (cmdObj) => question.message = `Data: ${cmdObj.formatBytes()} | Money: $${cmdObj.money} >`,
    function() {
        return {
            quit: {
                func: () => {
                    this.command('save');
                    this.respond('Now exiting.');
                    process.exit(0);
                },
                desc: "Saves and exits game."
            },
            sampleData: {
                func: () => {
                    if (this.data > 0) {
                        var name = Name.firstName();
                        var verb = (Math.random() < 0.5 ? 'likes' : 'dislikes');
                        var sub = Moniker.generator([Moniker.noun]).choose();
                        this.respond(`${name} ${verb} ${sub}`);
                    } else {
                        this.respond("You do not have enough data to use this command.");
                    }
                },
                desc: "Prints a read-out sampling some collected data."
            }
        };
    }
);

function createInquiry() {
    var inquirerCB = (ans) => {
        cmd.command(ans.command);
        createInquiry();
    };
    inquirer.prompt([question], inquirerCB);
}

createInquiry();
