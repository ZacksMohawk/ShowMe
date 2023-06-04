# Zack's Mohawk Limited
## ShowMe

## Overview

The purpose of ShowMe is to immediately open sets of related links in a browser from the command line, for the purpose of helping the user to understand the context of any given folder or project

## How To Install

	npm install

## How To Configure

No configuration required.

## Setup Alias

Run the setup script with the following command:

	./setup.sh

NOTE: This is specifically for a Mac. Setup scripts for Linux/Windows will be written on request.
NOTE: If this doesn't work please add the following directly to your .zshrc file

	alias showme='dt=$(pwd); {full path to this folder}; node ShowMe.js -folderPath $dt; cd $dt;'

## How To Use

Create a file called show.me and populate it with links, or sections of links, as shown below:

	[section 1]
	https://link1.com
	https://link2.com
	https://link3.com

	[section 2]
	https://link3.com
	https://link4.com
	https://link5.com

Type 'showme' into your terminal and the application will attempt to open any links found in the show.me file at that level

	showme

In the above example, you will be presented with a further choice of which section to open. If no sections are present, or there is only a single headed section, the application will just open all links in the file