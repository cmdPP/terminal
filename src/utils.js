import path from 'path';
import mkdirp from 'mkdirp';

function getUserHome() {
    return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
}

const userHome = getUserHome();

function _absPath(rel_path) {
    var abs_path = null;
    if ('string' == typeof rel_path) {
        var str_arr = [];
        var for_slash = rel_path.indexOf('/');
        var back_slash = rel_path.indexOf('\\');
        if (for_slash !== -1) {
            str_arr = rel_path.split('/');
        } else if (back_slash !== -1) {
            str_arr = rel_path.split('\\');
        } else {
            str_arr = [rel_path];
        }

        abs_path = path.join(userHome, ...str_arr);
    } else if (Array.isArray(rel_path)) {
        abs_path = path.join(userHome, ...rel_path);
    }
    return abs_path;
}

function getPath(...rel_path) {
    var abs_path = null;
    if (rel_path.length === 1) {
        abs_path = _absPath(rel_path[0]);
    } else if (rel_path.length > 1) {
        var allStrings = true;
        for (var str of rel_path) {
            if ('string' != typeof str) {
                allStrings = false;
                break;
            }
        }
        if (allStrings) {
            abs_path = path.join(userHome, ...rel_path);
        }
    }
    return abs_path;
}

function mkdir(...rel_path) {
    var abs_path = getPath(...rel_path);
    mkdirp.sync(abs_path);
}

export { getUserHome, getPath, mkdir };
