const prompt = require('prompt-sync')();
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const Logger = require('./includes/Logger');

let version = "1.1.0";
let pathDivider = process.platform === "win32" ? '\\' : '/';
let linuxType = null;
if (process.platform === 'linux'){
	let linuxTypeFilePath = 'linux.type';
	if (!fs.existsSync(linuxTypeFilePath)){
		let windowsAnswer = prompt('Are you running Linux/Ubuntu via Windows (y/n)?: ').toLowerCase();
		if (windowsAnswer == 'y'){
			linuxType = 'windows';
		}
		else if (windowsAnswer == 'n'){
			linuxType = 'linux';
		}
		else {
			Logger.log("Invalid answer. Setup not complete.");
			Logger.log("Exiting");
			process.exit(0);
		}
		fs.writeFileSync(linuxTypeFilePath, linuxType);
	}
	if (!fs.existsSync(linuxTypeFilePath)){
		Logger.log("Missing config file");
		Logger.log("Exiting");
		process.exit(0);
	}

	linuxType = fs.readFileSync(linuxTypeFilePath, 'utf8');
}
let openCommand =  process.platform === 'win32' ? 'start '
	: process.platform === 'linux' && linuxType == 'linux' ? 'xdg-open '
	: process.platform === 'linux' && linuxType == 'windows' ? 'cmd.exe /C start '
	: 'open ';
let ampersand = process.platform === 'linux' && linuxType == 'windows' ? '^&' : '&';

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
		execSync(openCommand + '"' + link.replaceAll('&', ampersand) + '"');
	}
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

showMe(folderPath);