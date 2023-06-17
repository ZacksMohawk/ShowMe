const prompt = require('prompt-sync')();
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const Logger = require('./includes/Logger');

let version = "1.0.1";
let pathDivider = process.platform === "win32" ? '\\' : '/';

Logger.log('');
Logger.log(fs.readFileSync('AppLogo.txt', 'utf8'));
Logger.log('');
Logger.log('ShowMe v' + version);
Logger.log('');
Logger.log('');

let folderPath;
if (process.argv.indexOf("-folderPath") != -1){
	folderPath = process.argv[process.argv.indexOf("-folderPath") + 1];
	if (!folderPath){
		process.exit(0);
	}
}
else {
	process.exit(0);
}

function showMe(folderPath){
	let showMeFilePath = folderPath + pathDivider + 'show.me';
	if (!fs.existsSync(showMeFilePath)){
		Logger.log("No show.me file present");
		Logger.log("Exiting");
		process.exit(0);
	}
	let showMeLinks = fs.readFileSync(showMeFilePath, 'utf8').split("\n");

	let linkSections = [];
	let linkSection = [];
	let sectionTitles = [];
	let sectionTitle = '';
	for (let index = 0; index < showMeLinks.length; index++){
		let line = showMeLinks[index];
		if (!line || line.startsWith("//")){
			continue;
		}
		if (line.startsWith('[')){
			if (linkSection.length > 0){
				linkSections.push(linkSection);

				if (sectionTitle){
					sectionTitles.push(sectionTitle);
				}

				sectionTitle = line.substr(line.indexOf('[') + 1, line.length);
				sectionTitle = sectionTitle.substr(0, sectionTitle.indexOf(']'));

				linkSection = [];
			}
			else {
				sectionTitle = line.substr(line.indexOf('[') + 1, line.length);
				sectionTitle = sectionTitle.substr(0, sectionTitle.indexOf(']'));
			}
			continue;
		}
		linkSection.push(line);
	}
	if (linkSection.length > 0){
		linkSections.push(linkSection);

		if (sectionTitle){
			sectionTitles.push(sectionTitle);
		}
	}

	if (linkSections.length == 0){
		Logger.log("Empty or incorrectly formatted show.me file");
		Logger.log("Exiting");
		process.exit(0);
	}

	if (linkSections.length > 1 && linkSections.length != sectionTitles.length){
		Logger.log("Empty or incorrectly formatted show.me file");
		Logger.log("Exiting");
		process.exit(0);
	}

	let chosenLinkSection = linkSections[0];
	if (linkSections.length > 1){
		Logger.log('Multiple Options\n');
		for (let index = 0; index < sectionTitles.length; index++){
			let title = sectionTitles[index];
			Logger.log((index + 1) + '. ' + title);
		}
		Logger.log('');
		let sectionChoice = prompt('Choose (1-' + sectionTitles.length + '): ');
		if (!sectionChoice){
			process.exit(0);
		}
		sectionChoice = sectionChoice.trim();
		if (sectionChoice < 1 || sectionChoice > sectionTitles.length){
			Logger.log("Invalid choice. Aborting");
			process.exit(0);
		}
		chosenLinkSection = linkSections[sectionChoice - 1];
	}

	for (let index = 0; index < chosenLinkSection.length; index++){
		let link = chosenLinkSection[index];
		execSync('open -a "Google Chrome" ' + link);
	}
}

showMe(folderPath);