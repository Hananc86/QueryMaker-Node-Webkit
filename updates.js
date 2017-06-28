var fs = require("fs");
var cmd = require('node-cmd');
var path = require('path');
var userPath = path.resolve();
var fullPath = userPath;
var relativePath = userPath;
relativePath = relativePath.split('\\');
relativePath.splice(-1, 1);
relativePath = relativePath.join('\\');

var setPATH = "set PATH=%PATH%" +
    ";" + relativePath + "\\QueryMaker\\Accessories\\putty;" +
    ";" + relativePath + "\\QueryMaker\\Accessories\\hosts;" +
    ";C:\\Program Files (x86)\\WinSCP;" +
    ";" + relativePath + "\\QueryMaker\\Accessories\\WinSCP-5.9.3-Portable;" +
    ";" + relativePath + "\\QueryMaker\\Accessories\\node;";
 var updatesJSON = relativePath + "\\QueryMaker\\UPDATES\\update.json";
 var userSetting2, filesArr, version;
 var PATH_TO_UPDATE_FOLDER = userPath + '\\UPDATES';
 var serverName = 'apple';

var USERNAME = "";
var PASSWORD = "";

    var data = fs.readFileSync('setPath.json');
     userSetting = JSON.parse(data);
    USERNAME = userSetting.username;
    PASSWORD = userSetting.password;

getUpdates();
function getUpdates(){
        setTimeout(function(){
   //deleting the files from UPDATES folder on queeryMaker (preparing the folder before the updates)
    var cmd_to_run = userPath + '\\deleteFolderContent.bat';
    cmd.get(cmd_to_run, function(data) {
        console.log('the file is deleted', data)
    });


    //Get The Updates From The Server
    //store the command in varibale for future executing
    var cmdCommand = setPATH +' && (winscp.com /command "open sftp://' + USERNAME + ':' + PASSWORD + '@' + serverIpObj[serverName].ip  + '"  "synchronize local ' + PATH_TO_UPDATE_FOLDER + ' /home/hananc/UPDATES" "exit")';
    //write the command in batch file
    fs.writeFile(relativePath + '\\QueryMaker\\getUpdatesFromServer.bat', cmdCommand, function(err) {
        if (err) {
            return console.error(err);
        }
    //exceute the command that get the updates from the server
    var cmd_to_run = relativePath + '\\QueryMaker\\getUpdatesFromServer.bat';
    cmd.get(cmd_to_run, function(data) {
        console.log('the file has been execute', data);
    });

    

        
    });
    
// setTimeout(function(){

//     alert(userSetting.username);
//     var WriteUserToUpdatesJSON = read("UPDATES\\update.json");
//     var userSetting3 = read('setPath.json');
//     alert(userSetting3.username);

//     if (WriteUserToUpdatesJSON.users.indexOf(userSetting.username) === -1) {
//         WriteUserToUpdatesJSON.users.push(userSetting.username); 
//         // WriteUserToUpdatesJSON = JSON.stringify(WriteUserToUpdatesJSON);
//         alert(WriteUserToUpdatesJSON.Version);
//         write("UPDATES\\update.json", WriteUserToUpdatesJSON);

        
//         var UpdateUsersOnTheServer = setPATH +' && (winscp.com /command "open sftp://' + USERNAME + ':' + PASSWORD + '@apple" "call cd UPDATES && rm -f -r update.json" "put ' + updatesJSON + ' /home/hananc/UPDATES/update.json" "exit")';
//         fs.writeFileSync(relativePath + '\\QueryMaker\\updateServerJSON.bat', UpdateUsersOnTheServer, function(err) {
//         if (err) {
//             return console.error(err);
//         }
//         });
//     }


// },4000);

    },1000);
}

 

function updates(){

        var data = fs.readFileSync(updatesJSON);
        userSetting2 = JSON.parse(data);

     var setPathJson = fs.readFileSync('setPath.json');
        setPathJson = JSON.parse(setPathJson);
        setPathJson.Version = userSetting2.Version;
        write('setPath.json', setPathJson);
         
      
        rootFiles = userSetting2.rootFiles;
        jsFolder = userSetting2.jsFolder;
        cssFolder = userSetting2.cssFolder;
        Version = userSetting2.Version;
        var rootFilesPath = userPath;
        var jsFolderPath = userPath + "\\js";
        var cssFolderPath = userPath + "\\css";

        //adding the commands for delete previus files and the command for adding the new files on the app.
        var resultCopyCommand=[];
        var resultDeleteCommand=[];
        function commandMaker(path, filesArr) {
            
            if (filesArr.length > 0) {
                var copyFilesCmd =[]; 
                var deleteFilesCmd =[];

                for (var i = 0; i < filesArr.length; i++) {
                    copyFilesCmd.push(' xcopy "' + userPath + '\\UPDATES\\' + filesArr[i] + '" "' + path + '" ');
                    deleteFilesCmd.push('Del "'+path+'\\'+filesArr[i]+'"'); 
                }

                    resultDeleteCommand.push(deleteFilesCmd.join(' && '));
                    resultCopyCommand.push(copyFilesCmd.join(' && '));
                    
            } 
            
        }
                 
        commandMaker(rootFilesPath, rootFiles);
        commandMaker(jsFolderPath, jsFolder);
        commandMaker(cssFolderPath, cssFolder);
        
        resultCopyCommand=resultCopyCommand.join(' && ');
        resultDeleteCommand=resultDeleteCommand.join(' && ');
        var copyAndDeleteCmd = ""
        copyAndDeleteCmd=resultDeleteCommand  + " && " + resultCopyCommand;
        


     fs.writeFileSync(relativePath + '\\QueryMaker\\deleteAndCopy.bat', copyAndDeleteCmd, function(err) {
        if (err) {
            return console.error(err);
        }
        });


        var cmd_to_run = userPath + '\\deleteAndCopy.bat';
        cmd.get(cmd_to_run, function(data) {
            console.log('The files has been changed', data)

        });

        // start app command to varibale
        // var startApp = 'timeout 5 && start ' + userPath + '\\queryMaker.exe';

        //writing the batch file that start the app
        // fs.writeFile(userPath + '\\startApp.bat', startApp, function(err) {
        //     if (err) {
        //         return console.error(err);
        //     }

        // });



        //  //executing the batch file that starting the app
        // var cmd_to_run = userPath + '\\startApp.bat';
        // cmd.get(cmd_to_run, function(data) {
        //     console.log('start app', data)

        // });


        
        var killApp ="Taskkill /IM queryMaker.exe /F";
        fs.writeFileSync(userPath + '\\killApp.bat', killApp, function(err) {
            if (err) {
                return console.error(err);
            }

        });

        setTimeout(function(){
         //exceuteing the killApp task
        var cmd_to_run = userPath + '\\killApp.bat';
        cmd.get(cmd_to_run, function(data) {
            console.log('kill app task', data)

        });

        },500);



}


//sami