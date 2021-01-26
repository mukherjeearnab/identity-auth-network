cd ..
export IMAGE_TAG=1.4

docker-compose -f docker-compose-cli.yaml up -d

docker exec -it cli bash ./scripts/channel/create-channel.sh

docker exec -it cli bash ./scripts/channel/join-peer.sh peer0 identityauthority IdentityAuthorityMSP 8051 1.0

CC="identity_cc"
echo "Installing "$CC
docker exec -it cli bash ./scripts/install-cc/install-onpeer-cc.sh $CC peer0 citizen CitizenMSP 7051 1.0
docker exec -it cli bash ./scripts/install-cc/install-onpeer-cc.sh $CC peer0 identityauthority IdentityAuthorityMSP 8051 1.0
echo "Instantiating "$CC
docker exec -it cli bash ./scripts/install-cc/instantiate.sh $CC

echo "All Done!"
