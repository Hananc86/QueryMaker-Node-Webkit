set PATH=%PATH%;C:\Users\Hananc\QueryMaker\Accessories\putty;;C:\Users\Hananc\QueryMaker\Accessories\hosts;;C:\Program Files (x86)\WinSCP;;C:\Users\Hananc\QueryMaker\Accessories\WinSCP-5.9.3-Portable;;C:\Users\Hananc\QueryMaker\Accessories\node; && (winscp.com /command "open sftp://hananc:cohen100@192.168.20.17"  "call cd ../../ "  "call sudo chmod 777 OptionFair"  " call cd OptionFair && sudo chmod 777 conf.properties" "call if [[ $(grep ^brands.values conf.properties | awk -F= '{ print $2 }') -eq 0 ]] ; then echo 'editing' ; sed -i -e '/^\<brands.values.*\>/ s/$/80/' conf.properties 2>&1 ; elif [[ -z $(grep ^brands.values conf.properties | grep '80,\|80$') ]] ;     then echo 'editing' ; sed -i -e '/^\<brands.values.*\>/ s/$/,80/' conf.properties 2>&1 ; else echo 'BrandIsThere' ; fi" " call sudo chmod 666 conf.properties && cd ../ && sudo chmod 755 OptionFair" "exit");