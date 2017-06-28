@echo off 
 SET NEWLINE=^& echo. 
 FIND /C /I "tf-webdev8.33option.com" %WINDIR%\system32\drivers\etc\hosts 
 IF %ERRORLEVEL% NEQ 0 ECHO %NEWLINE%^192.168.20.17 tf-webdev8.33option.com  #This Line Created by QueryMaker(c)#>>%WINDIR%\System32\drivers\etc\hosts 