#!/bin/bash
CHAINCODE=$1

#export ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/ian.com/orderers/orderer.ian.com/msp/tlscacerts/tlsca.ian.com-cert.pem

#peer chaincode instantiate -o orderer.ian.com:7050 --tls true --cafile $ORDERER_CA -C mainchannel -n $CHAINCODE -v 1.0 -c '{"Args":[]}' >&log.txt
peer chaincode instantiate -o orderer.ian.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/ian.com/orderers/orderer.ian.com/msp/tlscacerts/tlsca.ian.com-cert.pem -v 1.0 -c '{"Args":[]}' -C mainchannel -n $CHAINCODE

#cat log.txt
