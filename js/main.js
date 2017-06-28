var fs = require("fs");
var cmd = require('node-cmd');
var path = require('path');
var Promise = require('bluebird');
var userPath = path.resolve();
var fullPath = userPath;
var relativePath = userPath;
relativePath = relativePath.split('\\');
relativePath.splice(-1, 1);
relativePath = relativePath.join('\\');
var PATH_TO_LOCAL_BATFILE3 = '"' + relativePath + '\\QueryMaker\\InatecIssueCommand.bat"';
var PATH_TO_GET_INFORMATION_FROM_SERVER_BATFILE = '"' + relativePath + '\\QueryMaker\\getInformationFromServer.bat"';
PATH_TO_GET_INFORMATION_FROM_SERVER_BATFILE
var BonusUser = '"' + relativePath + '\\QueryMaker\\addBonusesScript\\AddBonusToUser.bat"';
var removeBonuses = '"' + relativePath + '\\QueryMaker\\addBonusesScript\\RemoveBonusToUser.bat"';
var setPATH = "set PATH=%PATH%" +
    ";" + relativePath + "\\QueryMaker\\Accessories\\putty;" +
    ";" + relativePath + "\\QueryMaker\\Accessories\\hosts;" +
    ";C:\\Program Files (x86)\\WinSCP;" +
    ";" + relativePath + "\\QueryMaker\\Accessories\\WinSCP-5.9.3-Portable;" +
    ";" + relativePath + "\\QueryMaker\\Accessories\\node;";


$(document).ready(function() {
    $('#demo').multiselect();
});

$(document).ready(function() {
    $('#demo2').multiselect();
});



// var getAsync = Promise.promisify(cmd.get, { multiArgs: true, context: cmd })
// var chrome = 'start chrome';
// getAsync(chrome).then(data => {
//   alert('cmd data', data)
// }).catch(err => {
//   alert('cmd err', err)
// })








function read(path) {
    var data = fs.readFileSync(path);
    var results = JSON.parse(data);
    return results;
}

function write(path, data) {
    var temp = JSON.stringify(data, null, 2);
    var userData = fs.writeFileSync(path, temp, 'utf8');
}

brands = read('brands.json');
LanguagesISO = read('LanguagesISO.json');
operators = read('operators.json');
serverIpObj = read('serverIpObj.json');
pspObj = read('pspObj.json');
langObj = read('langObj.json');
tokenizationObj = read('tokenizationObj.json');
var setPathJSON = read('setPath.json');

var data = fs.readFileSync('setPath.json');
var userSetting = JSON.parse(data);
USERNAME = userSetting.username;
PASSWORD = userSetting.password;

function OptionMakerForLangObj() {


    var values = [];
    var text = [];
    for (key in langObj) {
        values.push(langObj[key]['id']);
    }
    for (key in langObj) {
        text.push(key);
    }
    var options = "";

    for (var i = 0, j = 0; i < text.length && j < values.length; i++,
        j++) {

        options += '<option value="' + values[j] + '">' + text[i] + '</option>';

    }

    $("#demo2").html(options);


}


function optionHTMLMaker(elementID, obj) {

    var array = [];
    for (key in obj) {
        array.push(key);
    }
    var j = array;
    var options = '<option value=""></option>';

    for (var i = 0; i < j.length; i++) {
        options += '<option value="' + j[i] + '">' + j[i] + '</option>';
    }
    $("#" + elementID + "").html(options);


}


function addBrand() {

    var brandName = $('#brandName').val();
    var brandId = $('#brandId').val();
    var brandOperations = $('#operatorsList').val();
    $('#brandName').val("");
    $('#brandId').val("");
    // brands[brandName].id = brandId;

    if (brandName && brandId && brandOperations) {
        if (!brands.hasOwnProperty(brandName)) {

            brands[brandName] = {
                "id": brandId,
                "operator": brandOperations
            };
            write('brands.json', brands);
            alert(brandName +
                " Added Successfully ! "
            );

        } else {
            alert("The Brand is allready there");
        }
    } else {
        alert("the inputs can't be empty!");
    }

}


function getInformationFromServer() {
    server = $("#serverList").val();
    brandName = $("#brandList").val();

    if (server && brandName) {

        // $('#textAreaInformation').toggle('slow');
        var targetDate = new Date();
        targetDate.setDate(targetDate.getDate());
        var yyyy = targetDate.getFullYear();
        var dd = targetDate.getDate();
        var mm = targetDate.getMonth() + 1;
        var hours = targetDate.getHours();
        var minutes = targetDate.getMinutes();
        var seconds = targetDate.getSeconds();

        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        var dateString = "'" + dd + "-" + mm + "-" + yyyy + ' ' + hours + ':' + minutes + ':' + seconds + "'";
        setHost(brandName, server);

        var cmdCommands = setPATH +
            ' && (winscp.com /command "open sftp://' + USERNAME + ':' + PASSWORD + '@' + serverIpObj[server].ip + '"' +
            ' "call cd /home/' + USERNAME + ' && echo select language_id from language_brand_rel where brand_id=' + brands[brandName].id + ' INTO OUTFILE \\\'/tmp/QueryMakerLanguages.txt\\\' FIELDS TERMINATED BY \\\',\\\' ENCLOSED BY \\\'\\\ \\\'\\\;  > QueryMakerLanguages.sql"' +
            ' "call cd /home/' + USERNAME + ' && echo select a.name from payment_method as a inner join brand_psp_rel as b on a.id=b.psp_id where b.brand_id=' + brands[brandName].id + ' INTO OUTFILE \\\'/tmp/QueryMakerPsps.txt\\\' FIELDS TERMINATED BY \\\',\\\' ENCLOSED BY \\\'\\\ \\\'\\\;  > QueryMakerPsps.sql"' +
            ' "call cd /home/' + USERNAME + ' && echo select is_forex_enabled+0, is_asset_price_regulation_enabled+0 from brand where id=' + brands[brandName].id + ' INTO OUTFILE \\\'/tmp/QueryMakerForexAndRegulation.txt\\\' FIELDS TERMINATED BY \\\',\\\' ENCLOSED BY \\\'\\\ \\\'\\\;  > QueryMakerForexAndRegulation.sql"' +
            ' "call sudo chmod 777 QueryMakerLanguages.sql && mysql optionfair_trading < QueryMakerLanguages.sql"' +
            ' "call sudo chmod 777 QueryMakerPsps.sql && mysql optionfair_trading < QueryMakerPsps.sql"' +
            ' "call sudo chmod 777 QueryMakerForexAndRegulation.sql && mysql optionfair_trading < QueryMakerForexAndRegulation.sql"' +
            ' "call cd /tmp" "get  QueryMakerPsps.txt"' +
            ' "call cd /tmp" "get  QueryMakerLanguages.txt"' +
            ' "call cd /tmp" "get  QueryMakerForexAndRegulation.txt"' +
            ' "call cd /tmp && sudo rm QueryMakerLanguages.txt QueryMakerPsps.txt QueryMakerForexAndRegulation.txt"' +
            ' "exit")\;';


        fs.writeFileSync('./getInformationFromServer.bat', cmdCommands, function(err) {
            if (err) {
                return console.error(err);
            }
            console.log('');
            console.log("please wait... ");
            console.log('');
        });



            var cmd_to_run = PATH_TO_GET_INFORMATION_FROM_SERVER_BATFILE;
            cmd.get(cmd_to_run, function(data) {

            //fetch version of the server.      
            $.get('http://' + serverIpObj[server].ip + '/app/Version.html', function(version) {
                version = version.split(' ').slice(1, 2).toString().replace('Last', '');
                var resultPsps = fs.readFileSync('QueryMakerPsps.txt', 'utf8');
                var resultLanguages = fs.readFileSync('QueryMakerLanguages.txt', 'utf8');
                var QueryMakerForexAndRegulation = fs.readFileSync('QueryMakerForexAndRegulation.txt', 'utf8');
                var resultForex = QueryMakerForexAndRegulation.split(',')[0] == false ? false : true;
                var resultRegulation = QueryMakerForexAndRegulation.split(',')[1] == false ? false : true;
                // $('#textAreaInformation').toggle('slow');
                $('#textAreaInformation').hide('slow');
                $('#textAreaInformation').show('slow');
                $('#textAreaInformation').val('Time:' + dateString + '\nServer Version: ' + version + 'Brand Name: ' + brandName + ' (' + brands[brandName].operator + ')\nBrand ID:' + brands[brandName].id + '\nPsps: ' + createResultFromServer(resultPsps) + '\nLanguages:' + langISO(createResultFromServer(resultLanguages)) + '\nForex:' + resultForex + ' \nRegulation:' + resultRegulation + ' ');

            }).fail(function() {
                //stop the loading procces
                var resultPsps = fs.readFileSync('QueryMakerPsps.txt', 'utf8');
                var resultLanguages = fs.readFileSync('QueryMakerLanguages.txt', 'utf8');
                var QueryMakerForexAndRegulation = fs.readFileSync('QueryMakerForexAndRegulation.txt', 'utf8');
                var resultForex = QueryMakerForexAndRegulation.split(',')[0] == false ? false : true;
                var resultRegulation = QueryMakerForexAndRegulation.split(',')[1] == false ? false : true;
                // $('#textAreaInformation').toggle('slow');
                $('#textAreaInformation').hide('slow');
                $('#textAreaInformation').show('slow');
                $('#textAreaInformation').val('Time:' + dateString + '\nServer Version: ' + version + '\nBrand Name: ' + brandName + ' (' + brands[brandName].operator + ')\nBrand ID:' + brands[brandName].id + '\nPsps: ' + createResultFromServer(resultPsps) + '\nLanguages:' + langISO(createResultFromServer(resultLanguages)) + '\nForex:' + resultForex + ' \nRegulation:' + resultRegulation + ' ');


            });

        });

        function langISO(arr) {
            var resultArr = [];
            for (i = 0; i < arr.length; i++) {
                if (LanguagesISO.hasOwnProperty(arr[i])) {
                    resultArr.push(LanguagesISO[arr[i]])

                }
            }
            return resultArr.toString();
        }

        function createResultFromServer(result) {
            result = result.replace(/(\r\n|\n|\r)/gm, "").split(' ');
            result.splice(0, 1);
            result.splice(-1, 1);
            result = result.toString().split(',,');
            return result;
        }

    } else {
        alert('Please Choose Server And Brand');
    }

}




function getInformationFromProduction() {
    // server =    $("#serverList").val();
    brandName = $("#brandList").val();

    if (brandName) {

        // $('#textAreaInformation').toggle('slow');
        var targetDate = new Date();
        targetDate.setDate(targetDate.getDate());
        var yyyy = targetDate.getFullYear();
        var dd = targetDate.getDate();
        var mm = targetDate.getMonth() + 1;
        var hours = targetDate.getHours();
        var minutes = targetDate.getMinutes();
        var seconds = targetDate.getSeconds();

        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        var dateString = "'" + dd + "-" + mm + "-" + yyyy + ' ' + hours + ':' + minutes + ':' + seconds + "'";
        // setHost(brandName, server);


        var operator = brands[brandName].operator;
        var operatorIp = operators[operator].dbm;


        var cmdCommands = setPATH +
            ' && (winscp.com /command "open sftp://' + USERNAME + ':' + PASSWORD + '@' + operatorIp + '"' +
            ' "call cd /home/' + USERNAME + ' && echo select language_id from language_brand_rel where brand_id=' + brands[brandName].id + ' INTO OUTFILE \\\'/tmp/QueryMakerLanguages.txt\\\' FIELDS TERMINATED BY \\\',\\\' ENCLOSED BY \\\'\\\ \\\'\\\;  > QueryMakerLanguages.sql"' +
            ' "call cd /home/' + USERNAME + ' && echo select a.name from payment_method as a inner join brand_psp_rel as b on a.id=b.psp_id where b.brand_id=' + brands[brandName].id + ' INTO OUTFILE \\\'/tmp/QueryMakerPsps.txt\\\' FIELDS TERMINATED BY \\\',\\\' ENCLOSED BY \\\'\\\ \\\'\\\;  > QueryMakerPsps.sql"' +
            ' "call cd /home/' + USERNAME + ' && echo select is_forex_enabled+0, is_asset_price_regulation_enabled+0 from brand where id=' + brands[brandName].id + ' INTO OUTFILE \\\'/tmp/QueryMakerForexAndRegulation.txt\\\' FIELDS TERMINATED BY \\\',\\\' ENCLOSED BY \\\'\\\ \\\'\\\;  > QueryMakerForexAndRegulation.sql"' +
            ' "call sudo chmod 777 QueryMakerLanguages.sql && mysql optionfair_trading < QueryMakerLanguages.sql"' +
            ' "call sudo chmod 777 QueryMakerPsps.sql && mysql optionfair_trading < QueryMakerPsps.sql"' +
            ' "call sudo chmod 777 QueryMakerForexAndRegulation.sql && mysql optionfair_trading < QueryMakerForexAndRegulation.sql"' +
            ' "call cd /tmp" "get  QueryMakerPsps.txt"' +
            ' "call cd /tmp" "get  QueryMakerLanguages.txt"' +
            ' "call cd /tmp" "get  QueryMakerForexAndRegulation.txt"' +
            ' "call cd /tmp && sudo rm QueryMakerLanguages.txt QueryMakerPsps.txt QueryMakerForexAndRegulation.txt"' +
            ' "exit")\;';


        fs.writeFileSync('./getInformationFromServer.bat', cmdCommands, function(err) {
            if (err) {
                return console.error(err);
            }
            console.log('');
            console.log("please wait... ");
            console.log('');
        });



        var cmd_to_run = PATH_TO_GET_INFORMATION_FROM_SERVER_BATFILE;
        cmd.get(cmd_to_run, function(data) {




            //fetch version of the server.      
            $.get('http://' + brands[brandName].frontEndDomain + '/app/Version.html', function(version) {
                version = version.split(' ').slice(1, 2).toString().replace('Last', '');
                var resultPsps = fs.readFileSync('QueryMakerPsps.txt', 'utf8');
                var resultLanguages = fs.readFileSync('QueryMakerLanguages.txt', 'utf8');
                var QueryMakerForexAndRegulation = fs.readFileSync('QueryMakerForexAndRegulation.txt', 'utf8');
                var resultForex = QueryMakerForexAndRegulation.split(',')[0] == false ? false : true;
                var resultRegulation = QueryMakerForexAndRegulation.split(',')[1] == false ? false : true;
                // $('#textAreaInformation').toggle('slow');
                $('#textAreaInformation').hide('slow');
                $('#textAreaInformation').show('slow');
                $('#textAreaInformation').val('Time:' + dateString + '\nServer Version: ' + version + 'Brand Name: ' + brandName + ' (' + brands[brandName].operator + ')\nBrand ID:' + brands[brandName].id + '\nPsps: ' + createResultFromServer(resultPsps) + '\nLanguages:' + langISO(createResultFromServer(resultLanguages)) + '\nForex:' + resultForex + ' \nRegulation:' + resultRegulation + ' ');

            }).fail(function() {
                //stop the loading procces
                var resultPsps = fs.readFileSync('QueryMakerPsps.txt', 'utf8');
                var resultLanguages = fs.readFileSync('QueryMakerLanguages.txt', 'utf8');
                var QueryMakerForexAndRegulation = fs.readFileSync('QueryMakerForexAndRegulation.txt', 'utf8');
                var resultForex = QueryMakerForexAndRegulation.split(',')[0] == false ? false : true;
                var resultRegulation = QueryMakerForexAndRegulation.split(',')[1] == false ? false : true;
                // $('#textAreaInformation').toggle('slow');
                $('#textAreaInformation').hide('slow');
                $('#textAreaInformation').show('slow');
                $('#textAreaInformation').val('Time:' + dateString + '\nServer Version: ' + version + '\nBrand Name: ' + brandName + ' (' + brands[brandName].operator + ')\nBrand ID:' + brands[brandName].id + '\nPsps: ' + createResultFromServer(resultPsps) + '\nLanguages:' + langISO(createResultFromServer(resultLanguages)) + '\nForex:' + resultForex + ' \nRegulation:' + resultRegulation + ' ');


            });

        });

        function langISO(arr) {
            var resultArr = [];
            for (i = 0; i < arr.length; i++) {
                if (LanguagesISO.hasOwnProperty(arr[i])) {
                    resultArr.push(LanguagesISO[arr[i]])

                }
            }
            return resultArr.toString();
        }

        function createResultFromServer(result) {
            result = result.replace(/(\r\n|\n|\r)/gm, "").split(' ');
            result.splice(0, 1);
            result.splice(-1, 1);
            result = result.toString().split(',,');
            return result;
        }

    } else {
        alert('Please Choose Server And Brand');
    }

}




function addServer() {

    var serverName = $('#serverName').val();
    var serverIp = $('#serverIp').val();
    $('#serverName').val("");
    $('#serverIp').val("");
    // brands[brandName].id = brandId;

    if (serverName && serverIp) {

        if (!serverIpObj.hasOwnProperty(serverName)) {

            serverIpObj[serverName] = {
                "ip": serverIp
            };
            write('serverIpObj.json', serverIpObj);
            alert(serverName + " Added Successfully ! ");

        } else {
            alert("The Server is allready there");
        }

    } else {
        alert("the inputs can't be empty!");
    }
}


function removeServer() {
    var serverName = $('#ServerName').val();

    $('#serverIp').val("");
    $('#serverName').val("");
    if (serverName.length > 0) {

        if (serverIpObj.hasOwnProperty(serverName)) {

            delete serverIpObj[serverName];
            write('serverIpObj.json', serverIpObj);
            alert(serverName + " Deleted Successfully ! ");

        } else {
            alert("The Server:  " + serverName + " isn't exist in the App ");
        }

    } else {
        alert("the inputs can't be empty!");
    }

}


function removeBrand() {
    var brandName = $('#brandName').val();
    var brandId = $('#brandId').val();

    $('#brandName').val("");
    $('#brandId').val("");

    if (brandName || brandId) {

        for (key in brands) {
            if (brands[key].id === brandId) {
                brandName = key
            }
        }

        if (brands.hasOwnProperty(brandName)) {

            delete brands[brandName];
            write('brands.json', brands);
            alert(brandName +
                " Deleted Successfully ! "
            );

        } else {
            alert("The Brand: " + brandName + " isn't exist in the App ");
        }

    } else {
        alert("the inputs can't be empty!");
    }
}



function addPsp() {

    var pspName = $('#pspName').val();
    var merchantParameters = $('#merchantParameters').val();
    var merchantId = $('#merchantId').val();
    var merchantKey = $('#merchantKey').val();
    var pspID = $('#pspID').val();

    $('#pspName').val("");
    $('#merchantParameters').val("");
    $('#merchantId').val("");
    $('#merchantKey').val("");
    $('#pspID').val("");




    if (pspName && pspID) {

        for (psp in pspObj) {
            if (pspObj[psp]["pspId"] === pspID) {
                return alert("There is allready PSP with the same ID! Try Again.");
            }
        }

        if (!pspObj.hasOwnProperty(pspName)) {

            pspObj[pspName] = {
                'merchantParameters': merchantParameters,
                'merchantId': merchantId,
                'merchantKey': merchantKey,
                'pspId': pspID

            }

            write('pspObj.json', pspObj);
            alert(pspName + " Added Successfully ! ");

        } else {
            alert("The Psp is allready there");
        }

    } else {
        alert('Please Enter Psp Name And ID');
    }
}


function removePsp() {

    var pspName = $('#pspName').val();
    var pspId = $('#pspID').val();

    $('#pspName').val("");
    $('#merchantParameters').val("");
    $('#merchantId').val("");
    $('#merchantKey').val("");
    $('#pspID').val("");

    // for(psp in pspObj){if(pspObj[psp]["pspId"]===pspId){pspName = psp} }
    if (pspName || pspId) {
        for (psp in pspObj) {
            if (pspObj[psp]["pspId"] === pspId) {
                delete pspObj[psp];
                write('pspObj.json', pspObj);
                return alert(psp + " Deleted Successfully ! ");


            }
        }
        if (pspObj.hasOwnProperty(pspName)) {

            delete pspObj[pspName];

            write('pspObj.json', pspObj);
            alert(pspName + " Deleted Successfully ! ");

        } else {
            alert("The Psp: " + pspName + " isn't exist in the App ");
        }

    } else {
        alert("the inputs can't be empty!");
    }
}



function WinScpRunCode(code, server) {

    var cmdCommands = setPATH + ' && (winscp.com /command "open sftp://' + USERNAME + ':' + PASSWORD + '@' + serverIpObj[server].ip + '"  ' + code + ' "exit");';

    fs.writeFileSync('./WinScpCommands.bat', cmdCommands, function(err) {
        if (err) {
            return console.error(err);
        }
        console.log('');
        console.log("please wait... ");
        console.log('');
    });


    var cmd_to_run = PATH_TO_LOCAL_BATFILE;
    cmd.get(cmd_to_run, function(data) {
        console.log('*************************************', data)


    });
}

function setHost(brand, server) {

    this.brand = brand.toLowerCase();
    this.server = server.toLowerCase();

    var cmdCommands =
        '@echo off \n' +
        ' SET NEWLINE=^& echo. \n' +
        ' FIND /C /I \"' + server + '.' + brand + '.com\" %WINDIR%\\system32\\drivers\\etc\\hosts \n' +
        ' IF %ERRORLEVEL% NEQ 0 ECHO %NEWLINE%^' + serverIpObj[server].ip + ' ' + server + '.' + brand + '.com  #This Line Created by QueryMaker(c)#>>%WINDIR%\\System32\\drivers\\etc\\hosts ';


    fs.writeFile('./setHost.bat', cmdCommands, function(err) {
        if (err) {
            return console.error(err);
        }

    });


    var cmd_to_run = PATH_TO_SET_HOST_BAT_FILE;
    cmd.get(cmd_to_run, function(data) {


    });
}

function confPropBrandsValues(code, server) {
    this.server = server;
    var cmdCommands = setPATH + ' && (winscp.com /command "open sftp://' + USERNAME + ':' + PASSWORD + '@' + serverIpObj[server].ip + '"  ' + code + ' "exit");';

    fs.writeFileSync('./confPropBrandsValues.bat', cmdCommands, function(err) {
        if (err) {
            return console.error(err);
        }

    });


    var cmd_to_run = PATH_TO_LOCAL_BATFILE2;
    cmd.get(cmd_to_run, function(data) {
        console.log('*************************************', data)

    });
}

// function InatecIssueCommand(code, server) {
//     this.server = server;
//     var cmdCommands = setPATH + ' && (winscp.com /command "open sftp://' + USERNAME + ':' + PASSWORD + '@' + server + '"  ' + code + ' "exit");';

//     fs.writeFileSync('./InatecIssueCommand.bat', cmdCommands, function(err) {
//         if (err) {
//             return console.error(err);
//         }

//     });


//     var cmd_to_run = PATH_TO_LOCAL_BATFILE3;
//     cmd.get(cmd_to_run, function(data) {
//         console.log('*************************************', data)
//         alert('sdfsdffds');
//     });
// }

function cmdCommand(code) {
    var cmdCommands = setPATH + ' && ' + code;

    fs.writeFileSync('./CmdCommands1.bat', cmdCommands, function(err) {
        if (err) {
            return console.error(err);
        }

    });


    var cmd_to_run = PATH_TO_CMD_COMMAND1;
    cmd.get(cmd_to_run, function(data) {
        console.log('*************************************', data)

    });
}




function cmdCommand2(code) {

    var cmdCommands = setPATH + ' && ' + code;

    fs.writeFileSync('./CmdCommands2.bat', cmdCommands, function(err) {
        if (err) {
            return console.error(err);
        }

    });


    var cmd_to_run = PATH_TO_CMD_COMMAND2;
    cmd.get(cmd_to_run, function(data) {
        console.log('*************************************', data)

    });
}

function cmdCommand3(code) {
    var cmdCommands = setPATH + ' && ' + code;

    fs.writeFileSync('./CmdCommands3.bat', cmdCommands, function(err) {
        if (err) {
            return console.error(err);
        }
    });


    var cmd_to_run = PATH_TO_CMD_COMMAND3;
    cmd.get(cmd_to_run, function(data) {
        console.log('*************************************', data)

    });
}

function cmdCommand4(code) {
    var cmdCommands = setPATH + ' && ' + code;

    fs.writeFileSync('./CmdCommands4.bat', cmdCommands, function(err) {
        if (err) {
            return console.error(err);
        }

    });


    var cmd_to_run = PATH_TO_CMD_COMMAND4;
    cmd.get(cmd_to_run, function(data) {
        console.log('*************************************', data)

    });
}

function cmdCommand5(code) {
    var cmdCommands = setPATH + ' && ' + code;

    fs.writeFileSync('./CmdCommands5.bat', cmdCommands, function(err) {
        if (err) {
            return console.error(err);
        }
    });


    var cmd_to_run = PATH_TO_CMD_COMMAND5;
    cmd.get(cmd_to_run, function(data) {
        console.log('*************************************', data)

    });
}




// function Issue_with_assets_and_open_account_after_copying_brand(){
//    var serverName = $("#serverList").val();
//    var brandName = $("#brandList").val();    
//    var sqlBugsFixes = 'INSERT INTO brand_property'+
//                       '\\(brand_id,name,value,default_value,validation_regexp,last_update_time\\)'+
//                       'SELECT ' + brands[brandName].id + ' ,name,value,default_value,validation_regexp,NOW\\(\\)'+
//                       'FROM brand_property WHERE brand_id = 1\\;'+
//    bugsFixes(' (winscp.com /command "open sftp://' + USERNAME + ':' + PASSWORD + '@' + server + '\" \"call echo ' + sqlBugsFixes + ' > sqlBugsFixes.sql\"  \"call sudo chmod 777 sqlBugsFixes.sql && mysql optionfair_trading < sqlBugsFixes.sql \" \)\;', serverName);

// } 

function Issue_with_missing_entries_in_brand_property_table() {
    var server = $("#serverListBugsFixex").val();
    var brandName = $("#brandListBugsFixes").val();
    var sqlBugsFixes = 'INSERT INTO brand_property' +
        '\\(brand_id,name,value,default_value,validation_regexp,last_update_time\\)' +
        'SELECT ' + brands[brandName].id + ' ,name,value,default_value,validation_regexp,NOW\\(\\)' +
        'FROM brand_property WHERE brand_id = 1\\;';

    cmdCommand(' (winscp.com /command "open sftp://' + USERNAME + ':' + PASSWORD + '@' + serverIpObj[server].ip + '\" \"call echo ' + sqlBugsFixes + ' > sqlBugsFixes.sql\"  \"call sudo chmod 777 sqlBugsFixes.sql && mysql optionfair_trading < sqlBugsFixes.sql \" \)\;');

}



function InatecIssueCommand() {
    var code = "\"call cd ../../ \"  \"call sudo chmod 777 OptionFair\"  \" call cd OptionFair && sudo chmod 777 conf.properties\" \"call if [[ -z $(grep ^Inatec.custom1=123456 conf.properties) ]] \; then echo 'editing' \; sed -i -e \"\\$aInatec.custom1=123456\" conf.properties 2>&1 \; else echo 'Line is there' \; fi \" \" call sudo chmod 666 conf.properties && cd ../ && sudo chmod 755 OptionFair\"";
    var server = $("#serverListBugsFixex").val();
    var brandName = $("#brandListBugsFixes").val();
    if (server.length > 0 && brandName.length > 0) {
        // this.server = server;
        var cmdCommands = setPATH + ' && (winscp.com /command "open sftp://' + USERNAME + ':' + PASSWORD + '@' + serverIpObj[server].ip + '"  ' + code + ' "exit");';

        fs.writeFileSync('./InatecIssueCommand.bat', cmdCommands, function(err) {});

        var cmd_to_run = PATH_TO_LOCAL_BATFILE3;

        cmd.get(cmd_to_run, function(data) {});
    } else {
        alert("You Must Choose Brand And Server!");
    }
}


function sendMessages() {
    userName = $("#messagesUserName").val();
    numberOfMessages = $("#numberOfMessages").val();
    server = $("#serverListBugsFixex").val();
    brandName = $("#brandListBugsFixes").val();
    var messageSQL = '';
    var targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 10);
    var yyyy = targetDate.getFullYear();
    var dd = targetDate.getDate();
    var mm = targetDate.getMonth() + 1;
    var dateString = "'" + yyyy + "-" + mm + "-" + dd + ' 15:00:00' + "'";

    messageSQL += 'delimiter $\$ \n' +
        'set @bo2 = \(select id from bo_user order by id desc limit 1 \)\;\n' +
        'DROP PROCEDURE IF EXISTS QueryMessage\;\n' +
        'create procedure QueryMessage\(\) \n' +
        'begin \n' +
        ' IF EXISTS \(select id from message_template where name like \'QueryMessage\' and brand_id=' + brands[brandName].id + '\) THEN \n' +
        '   set @a =1\;\n' +
        ' ELSE \n' +
        '  insert into message_template \(brand_id,name,created_by,creation_date,default_language,is_deleted\) values \(' + brands[brandName].id + ', \'QueryMessage\',@bo2, now\(\),150,0\)\;\n' +
        ' END IF\; \n' +
        'end $\$ \n' +
        'call QueryMessage\(\)\; \n';

    //step2
    messageSQL +=
        'set @content1=' +
        '"grjkhgjhgrjjgrhgrjhgrjgrh' +
        '<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj' +
        '<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj' +
        '<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj' +
        '<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj' +
        '<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj' +
        '<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj' +
        '<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj' +
        '<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj' +
        '<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj' +
        '<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj' +
        '<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj' +
        '<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj' +
        '<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj' +
        '<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj' +
        '<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj' +
        '<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj' +
        '<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj' +
        '<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj' +
        '<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj' +
        '<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj' +
        '<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj' +
        '<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj' +
        '<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj' +
        '<br>gjrkgjrkgjkrgjgrkjgrkjgrkgrj' +
        '<br>gjrgkrjgrkjgrkjgrkgrjgrjk' +
        '<br>END"\;';


    //step2
    messageSQL += 'set @bo2=\(select id from bo_user order by id desc limit 1 \)\;' +
        'set @sami=\(select id from message_template where name like \'QueryMessage\' and brand_id=' + brands[brandName].id + ' order by id desc limit 1\)\;' +
        'insert into message_template_content \(template_id,language_id,created_by,creation_date,updated_by,title,content\)' +
        'values\(@sami,150,@bo2,now\(\),0,\'QueryMessage\',@content1\)\; \n';

    //step3
    messageSQL += 'set @sami1=\(select id from message_template where name like \'QueryMessage\' and brand_id=' + brands[brandName].id + ' order by id desc limit 1\)\;' +
        'set @sami2=\(select title from message_template_content where template_id=@sami1 order by id desc limit 1\)\;' +
        'set @sami3=\(select content from message_template_content where template_id=@sami1 order by id desc limit 1\)\;' +
        'insert into message_template_instance \(template_id,language_id,title,content\) ' +
        'values \(@sami1,150,@sami2,@sami3\)\;';
    //step4                
    messageSQL += 'set @user1=\(select id from account where user_name like "' + userName + '"\)\;' +
        'set @bo2=\(select id from bo_user order by id desc limit 1 \)\;' +
        'set @instance1=\(select id from message_template_instance order by id desc limit 1\)\;' +
        'insert into message \(account_id,template_instance_id,sent_by,' +
        'send_date,is_read,is_deleted,expiration_date,type,priority\)' +
        'values \(@user1,@instance1,@bo2,now\(\),0,0,' + dateString + ',251,-1\)\;'; //251 notifications 250 message

    var path_to_addMessagesSQL = userPath + '\\sendMessagesSQL.sql';
    var sendMessagesScript = setPATH + ' && ' + ' (winscp.com /command "open sftp://' + USERNAME + ':' + PASSWORD + '@' + serverIpObj[server].ip + '" "put ' + path_to_addMessagesSQL + ' /home/' + USERNAME + '/" "exit"\)\;';

    fs.writeFileSync('./sendMessagesSQL.sql', messageSQL, function(err) {
        if (err) {
            return console.error(err);
        }
    });

    fs.writeFileSync('./sendMessagesScript.bat', sendMessagesScript, function(err) {
        if (err) {
            return console.error(err);
        }
    });



    var cmd_to_run = sendMessagesScript;
    cmd.get(cmd_to_run, function(data) {
        console.log('*************************************', data)

    });


}

function Run() {

    server = $("#serverList").val();
    brand = $("#brandList").val();
    lotCommission = $("#lotCommissionInput").val() * 100;
    lotSize = $("#lotSizeInput").val() * 100;
    percentage = $("#openPositionCommisionInput").val();
    membersOnly = $('#members_only').is(':checked');
    addForex = $('#insertForex').is(':checked');
    addBinary = $('#insertBinary').is(':checked');
    if (server && brand) {

        var all = [];
        $('input').each(function(index) {
            if (this.checked === true) {
                all.push(this.value);
            }
        });

        server = $("#serverList").val();
        brand = $("#brandList").val();
        tokenization = $("#tokenization").is(':checked');
        shortcc = $("#shortcc").is(':checked');
        regulation = $("#regulation").is(':checked');
        forex = $("#forex").is(':checked');
        wagerRequired = $('#wagerRequired').is(':checked');
        sortInstruments = $('#sortable2 > li').attr('value');
        sortInstrumentsCheckbox = $('#sortInstrumentsCheckbox').is(':checked');


        if (brands[brand] !== undefined) {
            confPropBrandsValues("\"call cd ../../ \"  \"call sudo chmod 777 OptionFair\"  \" call cd OptionFair && sudo chmod 777 conf.properties\" \"call if [[ $(grep ^brands.values conf.properties | awk -F= '{ print $2 }') -eq 0 ]] ; then echo 'editing' ; sed -i -e '/^\\<brands.values.*\\>/ s/$/" + brands[brand].id + "/' conf.properties 2>&1 ; elif [[ -z $(grep ^brands.values conf.properties | grep '" + brands[brand].id + ",\\|" + brands[brand].id + "$') ]] ;     then echo 'editing' ; sed -i -e '/^\\<brands.values.*\\>/ s/$/," + brands[brand].id + "/' conf.properties 2>&1 ; else echo 'BrandIsThere' ; fi\" \" call sudo chmod 666 conf.properties && cd ../ && sudo chmod 755 OptionFair\"", server);

        }

        setHost(brand, server);
        // cmdCommand4('hosts add ' + serverIpObj[server].ip + ' ' + server + '.' + brand + '.com  qa-' + server + '.' + brand + '.com');
        // setHost(brand , server);

        queryMakerApp(all);
        cmdCommand2('start chrome "' + server + '.' + brand + '.com/app" -incognito "' + server + '.' + brand + '.com/app?skin=mobile#Login" -incognito');




    } else {
        alert("Please Choose Server And Brand ");
    }

}

function browserSync() {

    var server = $("#serverList").val();
    var brand = $("#brandList").val();

    if (brand && server) {
        setHost(brand, server);
        cmdCommand(' start browser-sync start --proxy "http://' + server + "." + brand + '.com/app" --files "public/css/*.css,app/**/*.slim"');
        setTimeout(function() {
            cmdCommand2('start chrome "http://localhost:3000/app" -incognito "http://localhost:3001" -incognito ');
            cmdCommand3('start firefox "http://localhost:3000/app"');
        }, 3000);


    } else {
        alert("Please Choose Server And Brand For Browser-Sync");
    }
}

function OpenBrowser() {
    var server = $("#serverList").val();
    var brand = $("#brandList").val();
    if (brand && server) {
        // cmdCommand('hosts add ' + serverIpObj[server].ip + ' ' + server + '.' + brand + '.com  qa-' + server + '.' + brand + '.com');
        setHost(brand, server);
        cmdCommand2('start chrome "' + server + '.' + brand + '.com/app" -incognito "' + server + '.' + brand + '.com/app?skin=mobile#Login" -incognito');
    } else {
        alert("Please Choose Server And Brand");
    }
}

function BackOffice() {
    var server = $("#serverList").val();
    var brand = $("#brandList").val();
    if (server) {
        // cmdCommand2('hosts add ' + serverIpObj[server].ip + ' ' + server + '.' + brand + '.com  qa-' + server + '.' + brand + '.com');
        setHost(brand, server);
        cmdCommand('start firefox "' + server + '/BO"');
    } else {
        alert("Please Choose Server And Brand");
    }


}

function Mobile() {
    var server = $("#serverList").val();
    var brand = $("#brandList").val();

    if (brand && server) {
        // cmdCommand('hosts add ' + serverIpObj[server].ip + ' ' + server + '.' + brand + '.com  qa-' + server + '.' + brand + '.com');
        setHost(brand, server);
        cmdCommand('start chrome "' + serverIpObj[server].ip + '.' + brand + '.com/app?skin=mobile#Login"');
    } else {
        alert("Please Choose Server And Brand");
    }
}

function restart() {

    var server = $("#serverList").val();
    if (server) {
        WinScpRunCode('"call sudo service tomcatd restart"', server);
    } else {
        alert("Please Choose Server To Restart");
    }
}

function setDefualtBrandId() {
    var server = $("#serverList").val();
    var brand = $("#brandList").val();
    if (brand && server) {
        WinScpRunCode("\"call sudo sed -i 's/^.*userDataResolver.defaultBrandId.*$/userDataResolver.defaultBrandId=" + brands[brand].id + "/' ../../OptionFair/conf.properties\"", server);
    } else {
        alert("Please Choose Server And Brand");
    }
}

function reset() {
    $('.form')[0].reset();
    $('.multiselect-container li').each(function() {
        $(this).removeClass('active');
    });
    $('.multiselect-selected-text').text('None Selected');
}

function closeBrowserSync() {
    cmdCommand5('taskkill /im node.exe /F && taskkill /im cmd.exe /F');
}

function openServer() {
    var server = $("#serverList").val();
    if (server) {
        cmdCommand('start putty -l ' + USERNAME + ' -pw ' + PASSWORD + ' ' + serverIpObj[server].ip);
    } else {
        alert("Please Choose Server for Putty");
    }
}



function addBonus() {
    server = $("#serverListBugsFixex").val();
    // brandName = $("#brandListBugsFixes").val();
    bonusType = $("#bonusType").val();
    bonusUserName = $("#bonusUserName").val();
    bonusName = $("#bonusName").val();
    bonusBrandId = $("#bonusBrandId").val();
    BO_UserName = $("#BO_UserName").val();
    iteration = $("#iteration").val();



    if (bonusUserName.length > 0 && bonusName.length > 0 && bonusBrandId.length > 0 && BO_UserName.length > 0 && iteration.length > 0 && server.length > 0) {
        if (bonusType === "Wager") {
            $("#bonusUserName").val("");
            $("#bonusName").val("");
            $("#bonusBrandId").val("");
            $("#BO_UserName").val("");
            $("#iteration").val("");
            alert(iteration + " " + "'" + bonusType + "'" + " Bonuses Added Successfuly ");
            bonusMaker(bonusUserName, bonusName, bonusBrandId, BO_UserName, iteration, bonusType);

        } else if (bonusType === "No Wager") {
            $("#bonusUserName").val("");
            $("#bonusName").val("");
            $("#bonusBrandId").val("");
            $("#BO_UserName").val("");
            $("#iteration").val("");

            alert(iteration + " " + "'" + bonusType + "'" + " Bonuses Added Successfuly");
            bonusMaker(bonusUserName, bonusName, bonusBrandId, BO_UserName, iteration, bonusType);
        }

    } else {
        alert("Make Sure You Fill All The Fields!");
    }



}

function removeBonus() {
    var server = $("#serverListBugsFixex").val();
    var bonusUserName = $("#bonusUserName").val();
    var bonusBrandId = $("#bonusBrandId").val();
    var iteration = $("#iteration").val();


    if (bonusUserName.length > 0 && bonusBrandId.length > 0 && iteration.length > 0 && server.length > 0) {
        bonusDelete(bonusUserName, bonusBrandId, iteration, server);
        $("#bonusUserName").val("");
        $("#bonusName").val("");
        $("#bonusBrandId").val("");
        $("#BO_UserName").val("");
        $("#iteration").val("");
    } else {

        alert("Make Sure You Fill All The Requiered Fields (User Name , Brand ID , How Much To Delete!)");
    }

}

function bonusMaker(userName, bonusName, brandId, BO_UserName, iteration, type) {
    var BonusString = " ";
    if (type === "Wager") {
        for (i = 0; i < iteration; i++) {
            BonusString += " set @bonus1=\(select id from bonus_definition where bonus_name like \'" + bonusName + "\' and brand_id=" + brandId + "\)\;" +
                "set @user1=\(select id from account where user_name like \'" + userName + "\' and brand_id=" + brandId + " limit 1\)\;" +
                "set @finance1=\(select financial_ledger_id+1 from bonus_account_rel order by id desc LIMIT 1\)\;" +
                "set @BO1=\(select id from bo_user where username like \'" + BO_UserName + "\'\)\;" +
                "insert into bonus_account_rel " +
                "\(bonus_id, account_id, financial_ledger_id,status, amount, reason, create_user_id, campaign_id, is_deleted, create_date, " +
                "last_update_date, last_update_user,first_approve_date, trading_volume,last_wager_position,total_earnings, " +
                "profit_adjustment_earnings, wager_req, wager_base, is_manual\)" +
                "values \(@bonus1,@user1,@finance1,136,1500,\'sa\',@BO1,0,0,now\(\),now\(\),@BO1,now\(\),0,0,0,0,1,15,0\)\; "
        }


    } else if (type === "No Wager") {
        for (i = 0; i < iteration; i++) {
            BonusString += " set @bonus1=\\(select id from bonus_definition where bonus_name like \'" + bonusName + "\' and brand_id=" + brandId + "\)\;" +
                "set @user1=\(select id from account where user_name like \'" + userName + "\' and brand_id=" + brandId + " limit 1\)\;" +
                "set @finance1=\(select financial_ledger_id+1 from bonus_account_rel order by id desc LIMIT 1\)\;" +
                "set @BO1=\(select id from bo_user where username like \'" + BO_UserName + "\'\)\;" +
                "insert into bonus_account_rel " +
                "\(bonus_id, account_id, financial_ledger_id,status, amount, reason, create_user_id, campaign_id, is_deleted, create_date, " +
                "last_update_date, last_update_user,first_approve_date, trading_volume,last_wager_position,total_earnings, " +
                "profit_adjustment_earnings, wager_req, wager_base, is_manual\)" +
                "values \(@bonus1,@user1,@finance1,136,1500,\'sa\',@BO1,0,0,now\(\),now\(\),@BO1,now\(\),0,0,0,0,0,15,0\)\; "
        }
    }

    var server = $("#serverListBugsFixex").val();
    var path_to_addBonusesScript = userPath + '\\AddBonusToUser.sql';
    // var cmdCommand = setPATH +' && (winscp.com /command "open sftp://' + USERNAME + ':' + PASSWORD + '@' + serverIpObj[serverName].ip  + '"  "synchronize remote ' + path_to_addBonusesScript + ' /home/hananc/UPDATES" "exit")';

    fs.writeFileSync('./AddBonusToUser.sql', BonusString, function(err) {
        if (err) {
            return console.error(err);
        }
    });



    var sendBonusesUploadCommand = setPATH + ' && ' + ' (winscp.com /command "open sftp://' + USERNAME + ':' + PASSWORD + '@' + serverIpObj[server].ip + '"  "put ' + path_to_addBonusesScript + ' /home/hananc/"   "call sudo chmod 777 AddBonusToUser.sql && mysql optionfair_trading < AddBonusToUser.sql"  "exit")';


    fs.writeFileSync('./sendBonusesUpload.bat', sendBonusesUploadCommand, function(err) {
        if (err) {
            return console.error(err);
        }

    });


    var cmd_to_run = sendBonusesUploadCommand;
    cmd.get(cmd_to_run, function(data) {
        console.log('*************************************', data)

    });


}

function bonusDelete(userName, brandId, iteration, server) {

    var BonusString =
        "set @user1=\\(select id from account where user_name like \\'" + userName + "\\' and brand_id=" + brandId + " limit 1\\)\\;" +
        "delete from bonus_account_rel where account_id=@user1 order by id desc limit " + iteration + "\\;";


    var bonusRemoverCMD = setPATH + ' && ' + ' (winscp.com /command "open sftp://' + USERNAME + ':' + PASSWORD + '@' + serverIpObj[server].ip + '"   "call echo ' + BonusString + ' > removeBonuses.sql" "call sudo chmod 777 removeBonuses.sql && mysql optionfair_trading < removeBonuses.sql" "exit")';

    fs.writeFileSync('./RemoveBonusToUser.bat', bonusRemoverCMD, function(err) {
        if (err) {
            return console.error(err);
        }
    });

    alert(iteration + " Bonuses Deleted Successfuly");

}



function queryMakerApp(array1) {

    serverName = $("#serverList").val();
    brandName = $("#brandList").val();
    isTokenization = $("#tokenization").is(':checked');
    isTokenization = (isTokenization === true) ? true : false;
    shortCC = $("#shortcc").is(':checked');
    brandRgulated = $("#regulation").is(':checked');
    brandRgulated = (brandRgulated === true) ? true : false;
    forex = $("#forex").is(':checked');
    openPositionComission = $('.commissionInput').val();
    openPositionComission = (isNaN(parseFloat(openPositionComission)) === false) ? parseFloat(openPositionComission) : false;



    // WinScpRunCode('"call echo ' + array1 + ' >> QueryMakerFuctionLog.txt"',serverName);
    // WinScpRunCode('"call echo server:' + serverName + ' brand:' + brandName + ' tokenization:' + isTokenization + ' shortcc:' + shortCC + ' regulation:' + brandRgulated + ' forex: ' + forex + ' OpenPositionCommission:' + openPositionComission + ' >> QueryMakerFuctionLog.txt"', serverName);

    array1 = array1.toString();
    array1 = array1.split(",");
    var array = array1;
    var resultArr = [],
        languagesArr = [],
        resultQuery;
    var bonusTemplate = [];
    var bonusTemplate2 = [];
    var bonusNoWager2 = [];
    var bonusNoWager = [];
    var messageTemplateOnly = [];



    for (i = 0; i < array.length; i++) {
        for (key in pspObj) {

            if (array[i] === key) {
                resultArr.push(array[i]);

            }
        }
    }

    for (i = 0; i < array.length; i++) {
        for (key in langObj) {

            if (array[i] == langObj[key].id) {
                languagesArr.push(array[i]);
            }
        }

    }


    languagesArr = languagesArr.sort(function(a, b) {
        return a - b;
    });

    resultQuery = queryMaker2(resultArr);
    WinScpRunCode("\"call echo " + resultQuery + " > sql.sql\" \"call echo " + bonusTemplate + " >> sql.sql\"  \"call echo " + bonusTemplate2 + "  >> sql.sql\"  \"call sudo chmod 777 sql.sql && mysql optionfair_trading < sql.sql \"", serverName);
    cmdCommand(' (winscp.com /command "open sftp://' + USERNAME + ':' + PASSWORD + '@' + serverIpObj[server].ip + '\" \"call echo ' + bonusNoWager + ' > sql2.sql\"  \"call echo ' + bonusNoWager2 + '  >> sql2.sql\"  \"call sudo chmod 777 sql2.sql && mysql optionfair_trading < sql2.sql \" \)\;');
    cmdCommand3(' (winscp.com /command "open sftp://' + USERNAME + ':' + PASSWORD + '@' + serverIpObj[server].ip + '\" \"call echo ' + sql3 + ' > sql3.sql\" \"call echo ' + messageTemplateOnly + ' > messageTemplateOnly.sql\"  \"call sudo chmod 777 sql3.sql && mysql optionfair_trading < sql3.sql \" \"call sudo chmod 777 messageTemplateOnly.sql && mysql optionfair_trading < messageTemplateOnly.sql \" \)\;');

            // var getAsync = Promise.promisify(cmd.get, { multiArgs: true, context: cmd })
            // var chrome = 'set PATH=%PATH%;C:\\Users\\Hananc\\QueryMaker\\Accessories\\putty;;C:\\Users\\Hananc\\QueryMaker\\Accessories\\hosts;;C:\\Program Files (x86)\\WinSCP;;C:\\Users\\Hananc\\QueryMaker\\Accessories\\WinSCP-5.9.3-Portable;;C:\\Users\\Hananc\\QueryMaker\\Accessories\\node; &&  (winscp.com /command "open sftp://hananc:cohen100@192.168.40.33" "call echo update brand set display_wager_required_false_bonuses=0 where id=216; update brand set open_position_commission_type=2833 where id=216;  update currency_country_limit set lot_size=2200,lot_commission=200 where brand_id=216 and currency_id=1; update asset set members_only_protected=0 where id in (4,5,6,7,8);delete from brand_platform_rel  where brand_id=216; INSERT INTO brand_platform_rel (platform_id, brand_id, sort) VALUES (80,216,0),(81,216,1); > sql3.sql" "call echo delimiter $$'+ 
            //              'set @bo2 = (select id from bo_user order by id desc limit 1 );DROP PROCEDURE IF EXISTS QueryMessage;create procedure QueryMessage() begin  IF EXISTS (select id from message_template where name like \'QueryMessage\' and brand_id=216) THEN    set @a =1; ELSE   insert into message_template (brand_id,name,created_by,creation_date,default_language,is_deleted) values \(216, \'QueryMessage\',@bo2, now(),150,0); END IF; end $$ call QueryMessage();  > messageTemplateOnly.sql"  "call sudo chmod 777 sql3.sql && mysql optionfair_trading < sql3.sql" "call sudo chmod 777 messageTemplateOnly.sql && mysql optionfair_trading < messageTemplateOnly.sql");';

            // getAsync(chrome).then(data => {
            //   alert('cmd data', data)
            // }).catch(err => {
            //   alert('cmd err', err)
            // })   



    function queryMaker2(pspArr) {

        var targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 10);
        var yyyy = targetDate.getFullYear();
        var dd = targetDate.getDate();
        var mm = targetDate.getMonth() + 1;
        var dateString = "'" + yyyy + "-" + mm + "-" + dd + ' 15:00:00' + "'";

        sql = [];
        sql3 = [];
        tokenizationArr = [];
        var pspArr2 = [];


        // this line prevent banking bug and update the identifier
        // sql.push('update brand set psp_criteria_priority=\\\'none\\\' , identifier=\\\'\\.*'+brandName+'.com\\\' where id=' + brands[brandName].id + '\\;  '); // fix the error message when trying to make manual deposit from BO ("due to risk score")

        if (pspArr.length > 0) {

            // fix the error message when trying to make manual deposit from BO ("due to risk score")
            sql.push('update brand set psp_criteria_priority=\\\'none\\\' where id=' + brands[brandName].id + '\\;  ');
            sql.push('DELETE FROM brand_psp_rel WHERE brand_id = ' + brands[brandName].id + '\\;  ');

            for (i = 0; i < pspArr.length; i++) {

                for (key in tokenizationObj) {
                    if (pspArr[i] == key) {
                        tokenizationArr.push(pspArr[i]);

                    }
                }
            }

            for (i = 0; i < tokenizationArr.length; i++) {
                pspArr.splice(pspArr.indexOf(tokenizationArr[i]), 1);
            }

            if (isTokenization) {


                var counter = 0;
                var counter2 = 1;

                for (i = 0; i < pspArr.length; i++) {
                    sql.push(
                        "INSERT INTO brand_psp_rel \\(psp_id,brand_id,psp_merchant_params,merchant_id,merchant_key,sort\\) VALUES \\(" +
                        pspObj[pspArr[i]].pspId + ',' + brands[brandName].id + ',' + '\\\'' + pspObj[pspArr[i]].merchantParameters + '\\\'' + ',' + '\\\'' + pspObj[pspArr[i]].merchantId + '\\\'' + ',' + '\\\'' +
                        pspObj[pspArr[i]].merchantKey + '\\\'' + ',' + (counter++) + '\\)\\;');

                }


                for (i = 0; i < tokenizationArr.length; i++) {

                    sql.push(
                        "INSERT INTO brand_psp_rel \\(psp_id,brand_id,psp_merchant_params,merchant_id,merchant_key,sort,is_token_service,priority\\) VALUES \\(" +
                        pspObj[tokenizationArr[i]].pspId + ',' + brands[brandName].id + ',' + '\\\'' + pspObj[tokenizationArr[i]].merchantParameters + '\\\'' + ',' + '\\\'' + pspObj[tokenizationArr[i]].merchantId + '\\\'' + ',' + '\\\'' +
                        pspObj[tokenizationArr[i]].merchantKey + '\\\'' + ',' + (counter++) + ',' + 1 + ',' + (counter2++) + '\\)\\;');

                }

            } else {

                var counter = 0;
                var counter2 = 1;

                for (i = 0; i < pspArr.length; i++) {
                    sql.push(
                        "INSERT INTO brand_psp_rel \\(psp_id,brand_id,psp_merchant_params,merchant_id,merchant_key,sort\\) VALUES \\(" +
                        pspObj[pspArr[i]].pspId + ',' + brands[brandName].id + ',' + '\\\'' + pspObj[pspArr[i]].merchantParameters + '\\\'' + ',' + '\\\'' + pspObj[pspArr[i]].merchantId + '\\\'' + ',' + '\\\'' +
                        pspObj[pspArr[i]].merchantKey + '\\\'' + ',' + (counter++) + '\\)\\;');

                }

                for (i = 0; i < tokenizationArr.length; i++) {

                    sql.push(
                        "INSERT INTO brand_psp_rel \\(psp_id,brand_id,psp_merchant_params,merchant_id,merchant_key,sort,priority\\) VALUES \\(" +
                        pspObj[tokenizationArr[i]].pspId + ',' + brands[brandName].id + ',' + '\\\'' + pspObj[tokenizationArr[i]].merchantParameters + '\\\'' + ',' + '\\\'' + pspObj[tokenizationArr[i]].merchantId + '\\\'' + ',' + '\\\'' +
                        pspObj[tokenizationArr[i]].merchantKey + '\\\'' + ',' + (counter++) + ',' + (counter2++) + '\\)\\;');

                }
            }

        }



        if (forex) {
            sql.push(
                'UPDATE brand set is_forex_enabled=' + 1 + ',default_forex_mode=' + 1 + ' where id=' + brands[brandName].id + '\\;' +
                'update asset set fx_spread=5,fx_spread_balance=0, fx_leverage=100,fx_min_limit_and_stop=10,' +
                'fx_rounding=4,fx_swap=1,fx_minimum_spread=4,fx_order_limit=10,fx_trade_status=400, fx_max_limit_and_stop=40000,' +
                'fx_sl_tp_ratio=10 where id in \\(4,5,18,38\\)\\;'

            );
        } else {
            sql.push('UPDATE brand set is_forex_enabled=' + 0 + ',default_forex_mode=' + 0 + ' where id=' + brands[brandName].id + '\\;');
        }


        if (languagesArr.length > 0) {
            sql.push("delete from language_brand_rel where brand_id=" + brands[brandName].id + "\\;");
        }
        for (i = 0; i < languagesArr.length; i++) {

            sql.push("insert into language_brand_rel \\(brand_id,language_id,sort_id\\) values\\(" + brands[brandName].id + "," + languagesArr[i] + "," + i + "\\)\\;");

        }

        if (wagerRequired) {
            sql3.push("update brand set display_wager_required_false_bonuses=1 where id=" + brands[brandName].id + "\\;");

        } else if (!wagerRequired) {
            sql3.push("update brand set display_wager_required_false_bonuses=0 where id=" + brands[brandName].id + "\\;");
        }

        if (lotCommission && lotSize) {

            sql3.push(
                " update brand set open_position_commission_type=2833 where id=" + brands[brandName].id + "\\; " +
                " update currency_country_limit set lot_size=" + lotSize + ",lot_commission=" + lotCommission + " where brand_id=" + brands[brandName].id + " and currency_id=1\\;"
            );

        } else if (percentage) {

            sql3.push("update brand set open_position_commission_type=2834,open_position_commission_percentage=" + percentage + " where id=" + brands[brandName].id + "\\;");
        } else if (!percentage && !lotCommission && !lotSize) {

            sql3.push("update brand set open_position_commission_type=2832 where id=" + brands[brandName].id + "\\;");
        }



        if (membersOnly) {
            sql3.push(' update asset set members_only_protected=1 where id in \\(4,5,6,7,8\\)\\;');
        } else {
            sql3.push(' update asset set members_only_protected=0 where id in \\(4,5,6,7,8\\)\\;');
        }


        var regulation2 = $("#regulation").is(':checked');
        if (regulation2) {

            sql.push(
                'delete from brand_regulation_rel where brand_id=' + brands[brandName].id + ' and regulation=1503\\; ' +
                'update brand set is_asset_price_regulation_enabled=1 where id=' + brands[brandName].id + '\\; ' +
                'insert into brand_regulation_rel ' +
                '\\(brand_id,regulation,withdrawal_policy,max_total_deposit_policy,restrictions,trade_cancellation_enabled,trade_cancellation_limit,trade_cancellation_window,trade_cancellation_window_grace\\)' +
                'values\\(' + brands[brandName].id + ',1503,1675,1680,2800,1,3,3000,2000\\)\\;' +
                'delete from brand_regulation_country where brand_id=' + brands[brandName].id + ' and country_iso like \\\'FR\\\'\\;' +
                'insert into brand_regulation_country \\(brand_id,regulation,country_iso\\) values\\(' + brands[brandName].id + ',1503,\\\'FR\\\'\\)\\;' +
                'update brand set is_asset_price_regulation_enabled=1 where id=' + brands[brandName].id + '\\;'

            );
        } else {
            sql.push('delete from brand_regulation_rel where brand_id=' + brands[brandName].id + ' and regulation=1503\\;' +
                'update brand set is_asset_price_regulation_enabled=0 where id=' + brands[brandName].id + '\\;');
        }


        if (shortCC) {
            sql.push('update currency_country_limit set is_short_form_cc_deposit=1 where brand_id=' + brands[brandName].id + '\\;');
        } else {
            sql.push('update currency_country_limit set is_short_form_cc_deposit=0 where brand_id=' + brands[brandName].id + '\\;');
        }



        bonusTemplate.push('delimiter $\\$ ');
        bonusTemplate2.push(


            'set @operattorID = \\(select operator_id from bonus_definition where id=1\\)\\;' +
            'DROP PROCEDURE IF EXISTS QueryScript\\;' +
            'create procedure QueryScript\\(\\) ' +
            'begin ' +
            ' IF EXISTS \\(select id from bonus_definition where bonus_name like \\\'QueryScript\\\' and brand_id=' + brands[brandName].id + '\\) THEN ' +
            '   update bonus_definition set effect_from=now\\(\\),effect_till=\\\'' + dateString + '\\\' where brand_id=' + brands[brandName].id + ' and bonus_name like \\\'QueryScript\\\'\\; ' +
            ' ELSE ' +
            '  insert into bonus_definition\\(brand_id, operator_id, bonus_type, bonus_name, description, effect_from, effect_till, effect_period, is_manual, wager_req, wager_base\\)values\\(' + brands[brandName].id + ', @operattorID, 1, \\\'QueryScript\\\', \\\'test\\\', now\\(\\), \\\'' + dateString + '\\\', 0, 0, 1, 5\\)\\; ' +
            '   set @temp = \\(select id from bonus_definition where brand_id= ' + brands[brandName].id + ' and bonus_name like \\\'QueryScript\\\'\\)\\; ' +
            '   insert into bonus_amount_rel \\(bonus_id ,currency_id ,amount ,min_amount,max_amount,min_deposit_amount\\) values \\(@temp,1,1500,1500,1500,1500\\)\\; ' +
            ' END IF\\; ' +
            'end $\\$ ' +
            'call QueryScript\\(\\)\\; '

        );



        bonusNoWager.push('delimiter $\\$ ');
        bonusNoWager2.push(
            'set @operattorID = \\(select operator_id from bonus_definition where id=1\\)\\;' +
            'DROP PROCEDURE IF EXISTS QueryScriptNoWager\\;' +
            'create procedure QueryScriptNoWager\\(\\) ' +
            'begin ' +
            ' IF EXISTS \\(select id from bonus_definition where bonus_name like \\\'QueryScriptNoWager\\\' and brand_id=' + brands[brandName].id + '\\) THEN ' +
            '   update bonus_definition set effect_from=now\\(\\),effect_till=\\\'' + dateString + '\\\' where brand_id=' + brands[brandName].id + ' and bonus_name like \\\'QueryScriptNoWager\\\'\\; ' +
            ' ELSE ' +
            '  insert into bonus_definition\\(brand_id, operator_id, bonus_type, bonus_name, description, effect_from, effect_till, effect_period, is_manual, wager_req, wager_base\\)values\\(' + brands[brandName].id + ', @operattorID, 1, \\\'QueryScriptNoWager\\\', \\\'test\\\', now\\(\\), \\\'' + dateString + '\\\', 0, 0, 0, 5\\)\\; ' +
            '   set @temp = \\(select id from bonus_definition where brand_id= ' + brands[brandName].id + ' and bonus_name like \\\'QueryScriptNoWager\\\'\\)\\; ' +
            '   insert into bonus_amount_rel \\(bonus_id ,currency_id ,amount ,min_amount,max_amount,min_deposit_amount\\) values \\(@temp,1,1500,1500,1500,1500\\)\\; ' +
            ' END IF\\; ' +
            'end $\\$ ' +
            'call QueryScriptNoWager\\(\\)\\; '

        );

        messageTemplateOnly.push('delimiter $\\$ \n' +
            'set @bo2 = \\(select id from bo_user order by id desc limit 1 \\)\\;' +
            'DROP PROCEDURE IF EXISTS QueryMessage\\;' +
            'create procedure QueryMessage\\(\\) ' +
            'begin ' +
            ' IF EXISTS \\(select id from message_template where name like \\\'QueryMessage\\\' and brand_id=' + brands[brandName].id + '\\) THEN ' +
            '   set @a =1\\;' +
            ' ELSE ' +
            '  insert into message_template \\(brand_id,name,created_by,creation_date,default_language,is_deleted\\) values \\(' + brands[brandName].id + ', \\\'QueryMessage\\\',@bo2, now\\(\\),150,0\\)\\;' +
            ' END IF\\; ' +
            'end $\\$ ' +
            'call QueryMessage\\(\\)\\; '

        );



        if (addForex === true && addBinary === false && sortInstrumentsCheckbox === false) {
            sql3.push('delete from brand_platform_rel  where brand_id=' + brands[brandName].id + '\\; INSERT INTO brand_platform_rel \\(platform_id, brand_id, sort\\) VALUES \\(81,' + brands[brandName].id + ',0\\)\\;');
        } else if (addBinary === true && addForex === false && sortInstrumentsCheckbox === false) {
            sql3.push('delete from brand_platform_rel  where brand_id=' + brands[brandName].id + '\\; INSERT INTO brand_platform_rel \\(platform_id, brand_id, sort\\) VALUES \\(80,' + brands[brandName].id + ',0\\)\\;');
        } else if (addForex === true && addBinary === true && sortInstrumentsCheckbox === false) {
            sql3.push('delete from brand_platform_rel  where brand_id=' + brands[brandName].id + '\\; INSERT INTO brand_platform_rel \\(platform_id, brand_id, sort\\) VALUES \\(80,' + brands[brandName].id + ',0\\),\\(81,' + brands[brandName].id + ',1\\)\\;');
        }


        $('#sortInstrumentsCheckbox').is(':checked');

        if (sortInstrumentsCheckbox) {
            if (sortInstruments === "TRADE") {
                sql3.push(
                    'delete from brand_platform_rel where brand_id=' + brands[brandName].id + '\\;' +
                    'insert into brand_platform_rel \\(platform_id,brand_id,sort\\) values \\(80,' + brands[brandName].id + ',0\\),\\(81,' + brands[brandName].id + ',1\\)\\;'
                );
            } else {
                sql3.push(
                    'delete from brand_platform_rel where brand_id=' + brands[brandName].id + '\\;' +
                    'insert into brand_platform_rel \\(platform_id,brand_id,sort\\) values \\(81,' + brands[brandName].id + ',0\\),\\(80,' + brands[brandName].id + ',1\\)\\;'
                );
            }

        }




        result = sql.join('');
        sql3 = sql3.join('');

        return result;
    };
}