#!/bin/bash
CHAINCODE=$1
PEER=$2
ORG=$3
MSP=$4
PORT=$5
VERSION=$6

ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/ian.com/orderers/orderer.ian.com/msp/tlscacerts/tlsca.ian.com-cert.pem
CORE_PEER_LOCALMSPID=$MSP
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/$ORG.ian.com/peers/$PEER.$ORG.ian.com/tls/ca.crt
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/$ORG.ian.com/users/Admin@$ORG.ian.com/msp
CORE_PEER_ADDRESS=$PEER.$ORG.ian.com:$PORT
CHANNEL_NAME=mainchannel
CORE_PEER_TLS_ENABLED=true

peer chaincode install -n $CHAINCODE -v $VERSION -p $CHAINCODE >&log.txt

cat log.txt
