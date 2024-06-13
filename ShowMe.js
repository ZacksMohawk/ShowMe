const prompt = require('prompt-sync')();
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const Logger = require('./includes/Logger');

let version = "1.3.0";
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

function showMe(showMeFilePath, firstAttempt){;
	if (!fs.existsSync(showMeFilePath)){
		if (firstAttempt){
			Logger.log("No show.me file present in current folder. Trying user home directory...\n");
			showMe(getUserHome() + pathDivider + 'show.me', false);
			return;
		}
		Logger.log("No show.me file present");
		Logger.log("Exiting");
		process.exit(0);
	}
	let showMeLinks = fs.readFileSync(showMeFilePath, 'utf8').split("\n");

	let linkSections = [];
	let linkSection = [];
	let sectionTitles = [];
	let sectionTitle = '';
	let subSectionOpen = false;
	let subLinkSection = [];

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
		else if (line.startsWith('	[')){
			subSectionOpen = true;

			let subSectionTitle = line.substr(line.indexOf('[') + 1, line.length);
			subSectionTitle = subSectionTitle.substr(0, subSectionTitle.indexOf(']'));
			subLinkSection = [subSectionTitle];
			linkSection.push(subLinkSection);

			continue;
		}
		if (subSectionOpen){
			if (!line.startsWith('	')){
				// close off sub-section if indentation has returned to normal
				subSectionOpen = false;
				subLinkSection = [];
				continue;
			}
			subLinkSection.push(line.replaceAll('\t', ''));
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
	let sectionChoice;
	if (linkSections.length > 1){
		Logger.log('Multiple Options\n');
		for (let index = 0; index < sectionTitles.length; index++){
			let title = sectionTitles[index];
			Logger.log('\t' + (index + 1) + '. ' + title);
		}
		Logger.log('');
		sectionChoice = prompt('Choose (1-' + sectionTitles.length + '): ');
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
		if (Array.isArray(link)){
			displaySubSectionChoice(chosenLinkSection, sectionTitles[sectionChoice - 1]);
			break;
		}
		execSync(openCommand + '"' + link.replaceAll('&', ampersand) + '"');
	}
}

function displaySubSectionChoice(subSectionArray, subSectionTitle){
	Logger.log('');
	Logger.log(subSectionTitle);
	Logger.log('');
	for (let index = 0; index < subSectionArray.length; index++){
		let subSection = subSectionArray[index];
		let title = subSection[0];
		Logger.log('\t' + (index + 1) + '. ' + title);
	}
	Logger.log('');
	let subSectionChoice = prompt('Choose (1-' + subSectionArray.length + '): ');
	if (!subSectionChoice){
		process.exit(0);
	}
	subSectionChoice = subSectionChoice.trim();
	if (subSectionChoice < 1 || subSectionChoice > subSectionArray.length){
		Logger.log("Invalid choice. Aborting");
		process.exit(0);
	}
	let chosenLinkSection = subSectionArray[subSectionChoice -1];

	for (let index = 1; index < chosenLinkSection.length; index++){
		let link = chosenLinkSection[index];
		execSync(openCommand + '"' + link.replaceAll('&', ampersand) + '"');
	}
}

function getUserHome(){
	return process.env.HOME || process.env.USERPROFILE;
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

showMe(folderPath + pathDivider + 'show.me', true);