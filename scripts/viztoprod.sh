
#!/bin/sh
# Go to MetExploreViz folder

if [ $# -ne 1 ] # s'il n'y a pas 1 paramètres 
then
         echo 'Parameter is required : \n\t1: sencha cmd path'
else
	arg=$1
        
	cd ../
	# Build ExtJS
	sudo $arg app build  

	cd ./scripts/
	# Link to the file which contain metExploreViz version 
	appJS="/var/www/MetExploreViz/build/production/metExploreViz/app.json"

	# Parse JSON to get version
	sub='\["version"]'
	lineversion=$(./JSON.sh -l < $appJS| egrep $sub)
	version=${lineversion#$sub}
	newversion=$(echo $version | sed s/\"//g)
	echo $newversion

	# ../licenses/compil\&licence.sh => add licenses
	# ../build/production/metExploreViz/  => MetExploreViz production folder
	sudo ../licenses/compil\&licence.sh ../build/production/metExploreViz/ $newversion

 
fi

