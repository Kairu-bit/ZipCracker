



import fs from "fs";
import { execSync } from "child_process";
const NodeModules = `/data/data/com.termux/files/home/node_modules/`;
const ExtractedDestination = `/data/data/com.termux/files/extracted/`;
const yellow = "\u001b[1;33m";
const green = "\u001b[1;32m";
const red = "\u001b[1;31m";
const magenta = "\u001b[1;35m";
const blue = "\u001b[1;34m";
const underline = "\u001b[4m";
const reset = "\u001b[0m";
function InstallDependencies(...libs){
  if (!fs.existsSync(NodeModules)){
    fs.mkdirSync(NodeModules);
  }
  for (const lib of libs){
    if (!fs.existsSync(NodeModules.concat(lib))){
      console.log(`${blue}Installing ${yellow + underline + lib + reset + blue} Dependencies`);
      execSync(`npm install --save ${lib}`, { stdio: "inherit" });
    }
  }
}
function clearTerm(){
  execSync(`clear`, { stdio: "inherit" });
}
if (!fs.existsSync(ExtractedDestination)){
  fs.mkdirSync(ExtractedDestination);
}
InstallDependencies("inquirer", "adm-zip");
try {
  fs.accessSync('/sdcard/', fs.constants.R_OK | fs.constants.W_OK);
} catch (error) {
  await animate(`${yellow}ERROR ACCESSING STORAGE DIRECTORY : ${red + error}`, null, 45);
  await animate(`${blue}PLEASE ENSURE ${yellow + underline}'sdcard'${reset + blue} IS ACCESSIBLE OR RUN ${yellow + underline}termux-setup-storage${reset}`, null, 45);
  process.exit();
}
const intro = `${green}8888P 88 88""Yb  dP""b8 88""Yb    db     dP""b8 88  dP
  dP  88 88__dP dP   \`" 88__dP   dPYb   dP   \`" 88odP
 dP   88 88"""  Yb      88"Yb   dP__Yb  Yb      88"Yb
d8888 88 88      YboodP 88  Yb dP""""Yb  YboodP 88  Yb`;
const author = `
${yellow}╔══════════════════════════╗
${yellow}║${blue}Author :${green} @Kyle${yellow}            ║
${yellow}║${blue}Facebook :${green} @Kyle Tilano${yellow}   ║
${yellow}║${blue}Telegram :${green} @stdoutstdiin${yellow}  ║
${yellow}╚══════════════════════════╝`;
const { default: inquirer } = await import("inquirer");
const { default: AdmZip } = await import("adm-zip");
class prompt {
  static getZipFile = {
    type: "input",
    name: "zip",
    prefix: "",
    message: `${magenta}PROTECTED ZIP FILE ${yellow}(q to quit)~#`,
    validate: (zip) => {
      if (zip.toLowerCase() === "q"){
        return true;
      }
      if (!fs.existsSync(zip) || zip.trim() === ""){
        return `${yellow + underline + zip}${reset + red} NOT FOUND`;
      }
      const stats = fs.statSync(zip);
      if (stats.isDirectory()){
        return `${yellow + underline}${zip + reset} ${red}IS DIRECTORY`;
      }
      if (!zip.endsWith(".zip")){
        return `${red}EXTENSION ERROR ${yellow + underline}${zip.split(".")[1] + reset}`;
      }
      const isZipEncrypted = isZipPasswordProtected(zip);
      if (!isZipEncrypted){
        return `${yellow + underline + zip + reset + red} IS NOT ENCRYPTED`;
      }
      const checkzip = new AdmZip(zip);
      const zipEntries = checkzip.getEntries();
      if (zipEntries.length === 0){
        return `${yellow + underline + zip + reset + red} IS EMPTY`;
      }
      return true;
    },
  }
  static getTxtFile = {
    type: "input",
    name: "txt",
    message: `${magenta}TXT FILE ${yellow}(q to quit)~#`,
    prefix: "",
    validate: (txt) => {
      if (txt.toLowerCase() === "q"){
        return true;
      }
      if (!fs.existsSync(txt) || txt.trim() === ""){
        return `${yellow + underline + txt + reset + red} NOT FOUND`;
      }
      const stats = fs.statSync(txt);
      if (stats.isDirectory()){
        return `${yellow + underline}${txt}${red} IS DIRECTORY`;
      }
      if (!txt.endsWith(".txt")){
        return `${red}EXTENSION ERROR ${yellow + underline + txt.split(".")[1] + reset}`
      }
      const txtcontent = fs.readFileSync(txt, { encoding: "utf8" });
      if (txtcontent.trim() === ""){
        return `${yellow + underline + txt + reset + red} IS EMPTY`;
      }
      return true;
    }
  }
  static askBack = {
    type: "list",
    name: "back",
    prefix: "",
    message: `${magenta}DO YOU WANT TO GO BACK?`,
    choices: [`${green}YES`, `${red}NO`],
  }
}
async function askBack(){
  const { back } = await inquirer.prompt(prompt.askBack);
  if (back.includes("NO")){
    await animate(`THANK YOU FOR USING`, green, 55);
    process.exit();
  }
  main();
}
async function animate(text, color = green, ms = 3){
  text = text.toString();
  if (color === null){
    for (const char of text){
      await delay(ms);
      process.stdout.write(char);
    }
    console.log();
    return;
  }
  for (const char of text){
    await delay(ms);
    process.stdout.write(color + char);
  }
  console.log();
}
function isZipPasswordProtected(zipFilePath) {
  try {
    const zip = new AdmZip(zipFilePath);
    const zipEntries = zip.getEntries();
    for (const entry of zipEntries) {
      if (entry.header.encripted) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error(`${red}ERROR WHILE CHECKING ZIP FILE : ${yellow + underline}`, error.message + reset);
    return false;
  }
}
function delay(ms){
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function main(){
  clearTerm();
  await animate(intro + author, null, 2);
  const { zip } = await inquirer.prompt(prompt.getZipFile);
  if (zip.toLowerCase() === "q"){
    await animate(`THANK YOU FOR USING`, green, 55);
    process.exit();
  }
  const { txt } = await inquirer.prompt(prompt.getTxtFile);
  if (txt.toLowerCase() === "q"){
    await animate(`THANK YOU FOR USING`, green, 55);
    process.exit();
  }
  ZipCracker(zip, txt);
}
async function ZipCracker(zip, txt){
  const Zip = new AdmZip(zip);
  const List = fs.readFileSync(txt, { encoding: "utf8" });
  const PasswordList = List.trim().split("\n");
  for (let Password of PasswordList){
    Password = Password.trim();
    try{
      Zip.extractAllTo(ExtractedDestination, true, Password);
      await animate(`${blue}PASSWORD FOUND  : ${green + underline + Password + reset + blue}\nEXTRACTED TO : ${green + underline + ExtractedDestination + reset}`, null, 55);
      askBack();
      return;
    }
    catch($){
      console.log(`${blue}PASSWORD FAILED : ${red + underline + Password + reset}`);
    }
  }
  await animate(`${red}PASSWORD NOT FOUND IN : ${yellow + underline + txt + reset}`, null, 45);
  askBack();
}
main();
