# Zack's Mohawk Limited
## ShowMe

## Overview

The purpose of ShowMe is to immediately open sets of related links in a browser from the command line, for the purpose of helping the user to understand the context of any given folder or project

## How To Install

	npm install

## How To Configure

No configuration required.

## Setup Alias

Run the setup script for Mac with the following command:

	./setup_mac.sh

Run the setup script for Linux/Ubuntu with the following command:

	./setup_linux.sh

NOTE: Windows setup script will be added in future.

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

To implement a sub-section of choices, use the following format (single tab indentation):

	[section 3]
		[sub-section 3a]
		https://link6.com
		[sub-section 3b]
		https://link7.com
		https://link8.com

Type 'showme' into your terminal and the application will attempt to open any links found in the show.me file at that level (if no local show.me file is found, the application will attempt to find and open a show.me file in your user home folder)

	showme

In the above examples, you will be presented with a further choice of which section to open. If no sections are present, or there is only a single headed section, the application will just open all links in the file