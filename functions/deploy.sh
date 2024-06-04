#!/bin/bash
# Color codes
RED="\033[0;31m"
GREEN="\033[0;32m"
CYAN="\033[0;36m"
END="\033[0m"

hold () {
  sec=$1
  while [ $sec -ge 0 ]; do
    echo -ne "Hold for $sec seconds...\033[0K\r"
    let "sec=sec-1"
    sleep 1
  done
}

# >>>> 
PARENT_PATH=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
export newversion=1.0
clear

if [ `ps -ef | grep -i "docker serve" | wc -l` -gt 1 ]
then
  echo -e ${GREEN}Docker is running${END}
  hold 10
else
  echo -e ${RED}Docker is NOT running${END}
  open /Applications/Docker.app
  echo "Hold on while docker is started"
  while [ `ps -ef | grep -i "docker serve" | wc -l` -lt 2 ]; do
    sleep 10
    echo -ne "."
  hold 30
  done
  echo -e ${GREEN}Docker is NOW running${END}
fi

echo
echo
echo -e "${GREEN}[LOG]${CYAN} Deploy function to Google Cloud Run (v$newversion) ...${END}"
echo "-----------------------------------------------------------"
docker build -t mppise/broadai:$newversion .
docker push mppise/broadai:$newversion
hold 10
gcloud config set project aidapter
gcloud config set run/region us-central1
gcloud run deploy broadai --image docker.io/mppise/broadai:$newversion --cors-allowed-origins
hold 5
docker rmi mppise/broadai:$newversion
cd ..
hold 5

echo
echo
echo -e "${GREEN}[LOG]${CYAN} DONE ${END}"
echo "-----------------------------------------------------------"