
#!/bin/sh

# Go to MetExploreViz folder
cd /var/www/MetExploreViz/
# Build ExtJS
sudo /root/bin/Sencha/Cmd/6.1.3.42/sencha app build  


cd /var/www/scripts/
# Link to the file which contain metExploreViz version 
appJS="/var/www/MetExploreViz/build/production/metExploreViz/app.json"

# Parse JSON to get version
sub='\["version"]'
lineversion=$(./JSON.sh -l < $appJS| egrep $sub)
version=${lineversion#$sub}
newversion=$(echo $version | sed s/\"//g)
echo $newversion

# ./licensesScriptMetExploreViz/compil\&licence.sh => add licenses
# ../MetExploreViz/build/production/metExploreViz/  => MetExploreViz production folder
sudo ./licenses/compil\&licence.sh ../MetExploreViz/build/production/metExploreViz/ $newversion

