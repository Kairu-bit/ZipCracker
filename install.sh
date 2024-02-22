green="\033[1;32m"
blue="\033[1;34m"
yellow="\033[1;33m"
underline="\033[4m"
reset="\033[0m"
termux-setup-storage
echo "${yellow}${underline}Updating Packages...${reset}${green}"
pkg update
echo "${yellow}${underline}Installing Node...${reset}${green}"
pkg install nodejs
echo "${blue}SETUP COMPLETE RUN ${yellow}${underline}node ZipCracker.mjs${reset}"
