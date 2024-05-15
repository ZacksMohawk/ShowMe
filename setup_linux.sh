#!/bin/bash

touch ~/.bashrc
while read -r line
do
	if [[ "$line" =~ ^"alias showme="* ]]; then
		echo "Alias already set"
		exit 1
	fi
done < ~/.bashrc

echo "Setting 'showme' alias";
echo "alias showme='dt=\$(pwd); cd $(pwd); node ShowMe.js -folderPath \$dt; cd \$dt;'" >> ~/.bashrc
source ~/.bashrc