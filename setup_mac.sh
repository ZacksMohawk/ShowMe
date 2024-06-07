#!/bin/bash

touch ~/.zshrc

SHOWMESET=false
EDITSHOWMESET=false

while read -r line
do
	if [[ "$line" =~ ^"alias showme="* ]]; then
		SHOWMESET=true
	fi
done < ~/.zshrc

while read -r line
do
	if [[ "$line" =~ ^"alias editshowme="* ]]; then
		EDITSHOWMESET=true
	fi
done < ~/.zshrc

NEWLINESET=false

if [[ "$SHOWMESET" != true ]]; then
	if [[ "$NEWLINESET" != true ]]; then
		echo '' >> ~/.zshrc
		NEWLINESET=true
	fi
	echo "Setting 'showme' alias";
echo "alias showme='dt=\$(pwd); cd $(pwd); node ShowMe.js -folderPath \$dt; cd \$dt;'" >> ~/.zshrc
fi

if [[ "$EDITSHOWMESET" != true ]]; then
	if [[ "$NEWLINESET" != true ]]; then
		echo '' >> ~/.zshrc
		NEWLINESET=true
	fi
	echo "Setting 'editshowme' alias";
echo "alias editshowme='touch ~/show.me; open ~/show.me'" >> ~/.zshrc
fi

source ~/.zshrc