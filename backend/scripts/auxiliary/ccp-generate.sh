#!/bin/bash

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp {
    local PP=$(one_line_pem $5)
    local CP=$(one_line_pem $6)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${ORGMSP}/$2/" \
        -e "s/\${P0PORT}/$3/" \
        -e "s/\${CAPORT}/$4/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        ../../connections/ccp-template.json 
}

ORG=citizen
ORGMSP=Citizen
P0PORT=7051
CAPORT=7054
PEERPEM=../crypto-config/peerOrganizations/citizen.ian.com/tlsca/tlsca.citizen.ian.com-cert.pem
CAPEM=../crypto-config/peerOrganizations/citizen.ian.com/ca/ca.citizen.ian.com-cert.pem

echo "$(json_ccp $ORG $ORGMSP $P0PORT $CAPORT $PEERPEM $CAPEM)" >../../connections/connection-citizen.json

ORG=identityauthority
ORGMSP=IdentityAuthority
P0PORT=8051
CAPORT=8054
PEERPEM=../crypto-config/peerOrganizations/identityauthority.ian.com/tlsca/tlsca.identityauthority.ian.com-cert.pem
CAPEM=../crypto-config/peerOrganizations/identityauthority.ian.com/ca/ca.identityauthority.ian.com-cert.pem

echo "$(json_ccp $ORG $ORGMSP $P0PORT $CAPORT $PEERPEM $CAPEM)" >../../connections/connection-identityauthority.json
