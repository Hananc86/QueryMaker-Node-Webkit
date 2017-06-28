/***********************************************************************************************************************************/
// HKEY_CURRENT_USER\SOFTWARE\QueryMaker
// C:\users\%USERNAME%\QueryMakerNodeWebKit\setHost.bat
var ws = require('windows-shortcuts');
var fs =require ('fs');
var path = require ('path');
var userPath = path.resolve();
var regedit = require('node-reg');
var Registry = require('winreg');



//read file
var data = fs.readFileSync('setPath.json');
var userSetting = JSON.parse(data);

var USERNAME = userSetting.username;
var PASSWORD = userSetting.password;

function check() {
	$('.modal-bg').attr('style',"display:none");
	$('#wrapper').attr('style',"display:block");
	
}
var relativePath = userPath;
var fullPath = userPath
relativePath = relativePath.split('\\');
relativePath.splice(-1,1);
relativePath = relativePath.join('\\');

var PATH_TO_LOCAL_BATFILE     =  '"'+relativePath+'\\QueryMaker\\WinScpCommands.bat"'; 
var PATH_TO_LOCAL_BATFILE2    =  '"'+relativePath+'\\QueryMaker\\confPropBrandsValues.bat"'; 
var PATH_TO_CMD_COMMAND1      =  '"'+relativePath+'\\QueryMaker\\CmdCommands1.bat"'; 
var PATH_TO_CMD_COMMAND2      =  '"'+relativePath+'\\QueryMaker\\CmdCommands2.bat"'; 
var PATH_TO_CMD_COMMAND3      =  '"'+relativePath+'\\QueryMaker\\CmdCommands3.bat"'; 
var PATH_TO_CMD_COMMAND4      =  '"'+relativePath+'\\QueryMaker\\CmdCommands4.bat"'; 
var PATH_TO_CMD_COMMAND5      =  '"'+relativePath+'\\QueryMaker\\CmdCommands5.bat"'; 
var PATH_TO_SET_HOST_BAT_FILE =  '"'+relativePath+'\\QueryMaker\\setHostAdministrator.lnk"'; 


var setPATH = "set PATH=%PATH%"+
";"+relativePath+"\\QueryMaker\\Accessories\\putty;"+
";"+relativePath+"\\QueryMaker\\Accessories\\hosts;"+
";C:\\Program Files (x86)\\WinSCP;"+
";"+relativePath+"\\QueryMaker\\Accessories\\WinSCP-5.9.3-Portable;"+
";"+relativePath+"\\QueryMaker\\Accessories\\node;";




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