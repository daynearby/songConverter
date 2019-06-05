var pt = require("path");
var fs = require('fs')
let CUSTOM_LEVELS_PATH = "Beat Saber_Data/CustomLevels/";
let ROOT_PATH = "CustomSongs/"
/**
  * 1. get CustomSongs folder list
  * 2. make sure exist info.json file exists
  * 3. transform info.json,Easy.json,Normal.json, etc.
  * 4. save config files (ps:info.json,Easy.json,Normal.json, etc) to CUSTOM_LEVELS_PATH
  * 5. copy cover,music to CUSTOM_LEVELS_PATH
  */
function filesList(path) {
    var subFolders = []
    //load files list
    var folders = fs.readdirSync(path)
    for (var i = 0; i < folders.length; i++) {
        var exist = fs.existsSync(path + folders[i] + "/info.json")
        if (exist) {
            var folder;
            if (ROOT_PATH == path) {
                folder = folders[i]
            } else {
                folder = path + folders[i]
                var index = folder.indexOf("/")
                folder = folder.substring(index + 1, folder.length)
            }
            conver(folder)
        } else {
            filesList(path + folders[i] + "/")
        }
    }
}

function conver(path) {
    //info.json target json 
    var infoJson = {
        "_version": "2.0.0",
        "_songName": "",
        "_songSubName": "",
        "_songAuthorName": "",
        "_levelAuthorName": "",
        "_beatsPerMinute": 166.0,
        "_songTimeOffset": 0.0,
        "_shuffle": 0.0,
        "_shufflePeriod": 1.0,
        "_previewStartTime": 0,
        "_previewDuration": 0,
        "_songFilename": "",
        "_coverImageFilename": "",
        "_environmentName": "DefaultEnvironment",
        "_difficultyBeatmapSets": [{
            "_beatmapCharacteristicName": "Standard",
            "_difficultyBeatmaps": []
        },
        {
            "_beatmapCharacteristicName": "OneSaber",
            "_difficultyBeatmaps": []
        },
        {
            "_beatmapCharacteristicName": "NoArrows",
            "_difficultyBeatmaps": []
        }]
    }


    console.log("load " + ROOT_PATH + path)
    //enter directories
    //var path = 'Adventure of a Lifetime';
    //info.json
    fs.readFile(ROOT_PATH + path + '/info.json', function (err, data) {
        if (err) {
            return console.error(err);
        }
        //console.log("read info "+(ROOT_PATH + path + '/info.json'))
        var info = data.toString();
        info = JSON.parse(info);
        //add song file
        infoJson['_songFilename'] = info['difficultyLevels'][0]['audioPath'];
        infoJson['_shuffle'] = info['difficultyLevels'][0]['_shuffle'];
        infoJson['_shufflePeriod'] = info['difficultyLevels'][0]['_shufflePeriod'];
        infoJson['_songName'] = info['songName'];
        infoJson['_songSubName'] = info['songSubName'];
        infoJson['_songAuthorName'] = info['authorName'];
        infoJson['_beatsPerMinute'] = info['beatsPerMinute'];
        infoJson['_previewStartTime'] = info['previewStartTime'];
        infoJson['_previewDuration'] = info['previewDuration'];
        infoJson['_coverImageFilename'] = info['coverImagePath'];
        infoJson['_environmentName'] = info['environmentName'];
        var isOneSaber = info['oneSaber'];
        //TODO:可能后面需要加
        //没看到自定义的歌曲是单手的，数据结构不知道怎么

        transformLevels(path, infoJson, info['difficultyLevels']);

        //console.log(infoJson);
        //copy song.ogg cover
        //_songFilename
        copyFile(path + "/" + infoJson['_songFilename'],
            path + "/" + infoJson['_songFilename'])

        //_coverImageFilename
        copyFile(path + "/" + infoJson['_coverImageFilename'],
            path + "/" + infoJson['_coverImageFilename'])
    })

}

//修改困难度
function transformLevels(path, infoJson, difficultyLevels) {
    //difficulty Levels
    var difficulty = {
        "_difficulty": "",
        "_difficultyRank": 0.0,
        "_beatmapFilename": "",
        "_noteJumpMovementSpeed": 0.0,
        "_noteJumpStartBeatOffset": 0
    }

    for (var i = 0; i < difficultyLevels.length; i++) {
        //Standard，saber
        if ("Standard" == difficultyLevels[i]['characteristic'] ||
            undefined == difficultyLevels[i]['characteristic']) {

            difficulty['_difficulty'] = difficultyLevels[i]['difficulty'];
            difficulty['_difficultyRank'] = difficultyLevels[i]['difficultyRank'];
            difficulty['_beatmapFilename'] = difficultyLevels[i]['jsonPath'].replace('.json', '.dat');

            //modify difficulty json  file
            let filePath = ROOT_PATH + path + "/" + difficulty['_difficulty'] + ".json";
            var data = fs.readFileSync(filePath)
            /*
            fs.readFile(filePath,function(err,data){
                if(err) {
                    console.log(err);
                }
                */
            var level = JSON.parse(data.toString());

            difficulty['_noteJumpStartBeatOffset'] = level['_noteJumpStartBeatOffset'];
            difficulty['_version'] = "2.0.0";
            delete level['_beatsPerMinute'];
            delete level['_beatsPerBar'];
            delete level['_noteJumpSpeed'];
            delete level['_noteJumpStartBeatOffset'];
            delete level['_shuffle'];
            delete level['_shufflePeriod'];

            //console.log("difficulty  = "+difficulty['_difficulty'])
            //save difficulty levels json file,such as: Easy.dat ,ExpertPlus.dat
            saveJSONFiles(path, difficulty['_difficulty'] + ".dat", level);
            /*      });
      */
            var data = fs.readFileSync(filePath)
            infoJson['_difficultyBeatmapSets'][0]['_difficultyBeatmaps'].push(difficulty);
        }
        //TODO:oneSaber,noArrows

    }
    //save info.dat file to target folder
    saveJSONFiles(path, "info.dat", infoJson);
}

//save files
function saveJSONFiles(path, fileName, retJson) {
    var ret = JSON.stringify(retJson);
    var targetPath = CUSTOM_LEVELS_PATH + path;

    //creat song folder
    fs.exists(targetPath, function (exist) {
        if (!exist) {
            mkdirsSync(targetPath)
        }
        //creat file
        var filePath = targetPath + "/" + fileName
        //console.log("filePath = "+filePath)
        fs.writeFile(filePath, ret, function (err) {
            if (err) {
                console.error(err);
            }
            console.log("write json finish " + path);
        })
    });

}

//copy file
function copyFile(fromPath, toPath) {
    fs.readFile(ROOT_PATH + fromPath, function (err, data) {
        if (err) {
            return console.log(err)
        }
        fs.writeFile(CUSTOM_LEVELS_PATH + toPath, data, function (err) {
            if (err) {
                console.error(err);
            }
            console.log("write file finish" + toPath);
        })
    })

}

function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(pt.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}

filesList(ROOT_PATH)
