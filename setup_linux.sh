#!/bin/bash

touch ~/.bashrc

SHOWMESET=false
EDITSHOWMESET=false

while read -r line
do
	if [[ "$line" =~ ^"alias showme="* ]]; then
		SHOWMESET=true
	fi
done < ~/.bashrc

while read -r line
do
	if [[ "$line" =~ ^"alias editshowme="* ]]; then
		EDITSHOWMESET=true
	fi
done < ~/.bashrc

NEWLINESET=false

if [[ "$SHOWMESET" != true ]]; then
	if [[ "$NEWLINESET" != true ]]; then
		echo '' >> ~/.bashrc
		NEWLINESET=true
	fi
	echo "Setting 'showme' alias";
echo "alias showme='dt=\$(pwd); cd $(pwd); node ShowMe.js -folderPath \$dt; cd \$dt;'" >> ~/.bashrc
fi

if [[ "$EDITSHOWMESET" != true ]]; then
	if [[ "$NEWLINESET" != true ]]; then
		echo '' >> ~/.bashrc
		NEWLINESET=true
	fi
	echo "Setting 'editshowme' alias";
echo "alias editshowme='touch ~/show.me; open ~/show.me'" >> ~/.bashrc
fi

source ~/.bashrc