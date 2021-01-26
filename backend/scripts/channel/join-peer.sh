#!/bin/bash
PEER=$1
ORG=$2
MSP=$3
PORT=$4
VERSION=$5

ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/ian.com/orderers/orderer.ian.com/msp/tlscacerts/tlsca.ian.com-cert.pem
CORE_PEER_LOCALMSPID=$MSP
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/$ORG.ian.com/peers/$PEER.$ORG.ian.com/tls/ca.crt
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/$ORG.ian.com/users/Admin@$ORG.ian.com/msp
CORE_PEER_ADDRESS=$PEER.$ORG.ian.com:$PORT
CHANNEL_NAME=mainchannel
CORE_PEER_TLS_ENABLED=true

peer channel join -b mainchannel.block >&log.txt

cat log.txt
