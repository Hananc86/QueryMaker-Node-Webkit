/***********************************************************************************************************************************/
// HKEY_CURRENT_USER\SOFTWARE\QueryMaker
// C:\users\%USERNAME%\QueryMakerNodeWebKit\setHost.bat
var ws = require('windows-shortcuts');
var fs = require('fs');
var path = require('path');
var userPath = path.resolve();
var regedit = require('node-reg');
var Registry = require('winreg');
var USERNAME = "";
var PASSWORD = "";


var data = fs.readFileSync('setPath.json');
var userSetting = JSON.parse(data);
USERNAME = userSetting.username;
PASSWORD = userSetting.password;


checkUpdates();
setInterval(function() {
    checkUpdates();
}, 300000);


function checkUpdates() {
    getUpdates();
    
    setTimeout(function() {
        var userSetting2 = read("UPDATES\\update.json");
        var userSetting = read('setPath.json');
        
        $('#title').replaceWith("<h1 class = \"version\" id=\"title\">Query Maker " + userSetting.Version + "</h1>");
        $('#menuVersion').replaceWith("<a1 id = \"menuVersion\" href=\"#\">Query Maker " + userSetting.Version + "</a>");

        if (userSetting.Version < userSetting2.Version || userSetting2.appUpdate === true) {
            $('#updatesContainer').attr('style', "display:block");
            window.resizeTo(1189, 900);
            $('#updatesHeader').replaceWith('<h1 id="updatesHeader">Updates Are Available (' + userSetting2.updatesCounter + ') </h1>');


        } else if (userSetting2.criticalUpdate) {
            updates();
        } else if (userSetting2.popupMessage===userSetting.username) {
            $('#popupMessageContentHeader').replaceWith('<h1 id="popupMessageConetentHeader" >'+userSetting2.popupMessageContentHeader+'</h1>');        
            $('#paragraphPopupMessage').replaceWith('<p id="paragraphPopupMessage" >'+userSetting2.popupMessageContentBody+'</p>');        
            $('#popupMessage').attr('style', "display:block");

        } else {
            $('#updatesContainer').attr('style', "display:none");
            window.resizeTo(1189, 850);
        }

    }, 6000);

}




// var userSetting = {
// username:USERNAME,
// password:PASSWORD,
// path:userPath
// }




// //read file




function check() {

    window.resizeTo(1189, 859);
    userSetting.username = $('#username').val();
    userSetting.password = $('#password').val();
    $('.modal-bg').attr('style', "display:none");
    $('#wrapper').attr('style', "display:block");
    userSetting.setPATH=setPATH;

    userSetting = JSON.stringify(userSetting, null, 2);
    var userData = fs.writeFileSync('setPath.json', userSetting, 'utf8');
}



var relativePath = userPath;
var fullPath = userPath;
relativePath = relativePath.split('\\');
relativePath.splice(-1, 1);
relativePath = relativePath.join('\\');

var PATH_TO_LOCAL_BATFILE = '"' + relativePath + '\\QueryMaker\\WinScpCommands.bat"';
var PATH_TO_LOCAL_BATFILE2 = '"' + relativePath + '\\QueryMaker\\confPropBrandsValues.bat"';
var PATH_TO_LOCAL_BATFILE3 = '"' + relativePath + '\\QueryMaker\\InatecIssueCommand.bat"';
var sendBonusesUpload = '"' + relativePath + '\\QueryMaker\\sendBonusesUpload.bat"';
var PATH_TO_CMD_COMMAND1 = '"' + relativePath + '\\QueryMaker\\CmdCommands1.bat"';
var PATH_TO_CMD_COMMAND2 = '"' + relativePath + '\\QueryMaker\\CmdCommands2.bat"';
var PATH_TO_CMD_COMMAND3 = '"' + relativePath + '\\QueryMaker\\CmdCommands3.bat"';
var PATH_TO_CMD_COMMAND4 = '"' + relativePath + '\\QueryMaker\\CmdCommands4.bat"';
var PATH_TO_CMD_COMMAND5 = '"' + relativePath + '\\QueryMaker\\CmdCommands5.bat"';
var bugsFixes = '"' + relativePath + '\\QueryMaker\\bugsFixes.bat"';
var PATH_TO_SET_HOST_BAT_FILE = '"' + relativePath + '\\QueryMaker\\setHostAdministrator.lnk"';


var setPATH = "set PATH=%PATH%" +
    ";" + relativePath + "\\QueryMaker\\Accessories\\putty;" +
    ";" + relativePath + "\\QueryMaker\\Accessories\\hosts;" +
    ";C:\\Program Files (x86)\\WinSCP;" +
    ";" + relativePath + "\\QueryMaker\\Accessories\\WinSCP-5.9.3-Portable;" +
    ";" + relativePath + "\\QueryMaker\\Accessories\\node;";




regedit.addKey({
    target: 'HKCU\\Software\\QueryMaker',
    name: 'path',
    value: fullPath,
    type: 'REG_SZ'
});



regedit.getKey({
    target: 'HKCU\\Software\\QueryMaker'
});



var regKey = new Registry({
    hive: Registry.HKCU,
    key: '\\Software\\QueryMaker'
});




regKey.values(function(err, items) {
    if (err)
        console.log('ERROR: ' + err);
    else
        for (var i = 0; i < items.length; i++)
            console.log('ITEM: ' + items[i].name + '\t' + items[i].type + '\t' + items[i].value);
});




// ws.edit("setHostAdministrator.lnk", {
//     target : relativePath + "\\QueryMaker\\setHost.bat",
//     // args : '2 "baz quux"',
//     runStyle : ws.MIN,
//     desc : "Does cool stuff.",
//     workingDir:relativePath + "\\QueryMaker",
//     action:"E"
// }, function(err) {
//     if (err)
//         throw Error(err);
//     else
//         console.log("Shortcut created!");
// });




// var setVaribale = 'set hanan=%hanan% '+fullPath;




// $(document).ready(function () {
//     $.getJSON("words-small.json", function (result) {
//         html = ''
//         for (i = 0; i < results.length; i++) {
//             html += "<option value=" + result[i] + ">" + result[i] + "</option>";
//         };
//         document.getElementById("brandsList").innerHTML = html;
//     });
// });