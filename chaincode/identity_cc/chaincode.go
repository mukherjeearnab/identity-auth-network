package main

import (
	"encoding/json"
	"fmt"

	"crypto/x509"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/core/chaincode/shim/ext/cid"
	sc "github.com/hyperledger/fabric/protos/peer"
)

// Chaincode is the definition of the chaincode structure.
type Chaincode struct {
}

// Definition of the Profile structure
type citizenProfile struct {
	ID      string `json:"ID"`
	IAC     string `json:"iac"`
	Name    string `json:"Name"`
	Address string `json:"Address"`
}

// Init is called when the chaincode is instantiated by the blockchain network.
func (cc *Chaincode) Init(stub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

// Invoke is called as a result of an application request to run the chaincode.
func (cc *Chaincode) Invoke(stub shim.ChaincodeStubInterface) sc.Response {
	fcn, params := stub.GetFunctionAndParameters()
	fmt.Println("Invoke()", fcn, params)

	if fcn == "createProfile" {
		return cc.createProfile(stub, params)
	} else if fcn == "readProfile" {
		return cc.readProfile(stub, params)
	} else if fcn == "updateProfile" {
		return cc.updateProfile(stub, params)
	} else {
		fmt.Println("Invoke() did not find func: " + fcn)
		return shim.Error("Received unknown function invocation!")
	}
}

// Function to create new citizenProfile (C of CRUD)
func (cc *Chaincode) createProfile(stub shim.ChaincodeStubInterface, params []string) sc.Response {
	// Check Access
	creatorOrg, creatorCertIssuer, creator, err := getTxCreatorInfo(stub)
	if !authenticatePollution(creatorOrg, creatorCertIssuer) {
		return shim.Error("{\"Error\":\"Access Denied!\",\"Payload\":{\"MSP\":\"" + creatorOrg + "\",\"CA\":\"" + creatorCertIssuer + "\"}}")
	}

	// Check if sufficient Params passed
	if len(params) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	// Check if Params are non-empty
	for a := 0; a < 3; a++ {
		if len(params[a]) <= 0 {
			return shim.Error("Arguments must be a non-empty string")
		}
	}

	key := "citizen-" + params[0]

	// Check if Profile exists with Key => params[0]
	citizenProfileAsBytes, err := stub.GetState(key)
	if err != nil {
		return shim.Error("Failed to check if Profile exists!")
	} else if citizenProfileAsBytes != nil {
		return shim.Error("Profile Already Exists!")
	}

	// Generate Profile from params provided
	citizenProfile := &citizenProfile{params[0], creator, params[1], params[2]}
	citizenProfileJSONasBytes, err := json.Marshal(citizenProfile)
	if err != nil {
		return shim.Error(err.Error())
	}

	// Put State of newly generated Profile with Key => params[0]
	err = stub.PutState(key, citizenProfileJSONasBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	// Returned on successful execution of the function
	return shim.Success(nil)
}

// Function to read an citizenProfile (R of CRUD)
func (cc *Chaincode) readProfile(stub shim.ChaincodeStubInterface, params []string) sc.Response {
	// Check if sufficient Params passed
	if len(params) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	// Check if Params are non-empty
	if len(params[0]) <= 0 {
		return shim.Error("1st argument must be a non-empty string")
	}

	// Get State of Profile with Key => params[0]
	citizenProfileAsBytes, err := stub.GetState(params[0])
	if err != nil {
		jsonResp := "{\"Error\":\"Failed to get state for " + params[0] + "\"}"
		return shim.Error(jsonResp)
	} else if citizenProfileAsBytes == nil {
		jsonResp := "{\"Error\":\"Profile does not exist!\"}"
		return shim.Error(jsonResp)
	}

	// Returned on successful execution of the function
	return shim.Success(citizenProfileAsBytes)
}

// Function to update an citizenProfile's owner (U of CRUD)
func (cc *Chaincode) updateProfile(stub shim.ChaincodeStubInterface, params []string) sc.Response {
	// Check Access
	creatorOrg, creatorCertIssuer, _, err := getTxCreatorInfo(stub)
	if !authenticatePollution(creatorOrg, creatorCertIssuer) {
		return shim.Error("{\"Error\":\"Access Denied!\",\"Payload\":{\"MSP\":\"" + creatorOrg + "\",\"CA\":\"" + creatorCertIssuer + "\"}}")
	}

	// Check if sufficient Params passed
	if len(params) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	// Check if Params are non-empty
	for a := 0; a < 3; a++ {
		if len(params[a]) <= 0 {
			return shim.Error("Arguments must be a non-empty string")
		}
	}

	key := "citizen-" + params[0]

	// Get State of Profile with Key => params[0]
	citizenProfileAsBytes, err := stub.GetState(key)
	if err != nil {
		jsonResp := "{\"Error\":\"Failed to get state for " + params[0] + "\"}"
		return shim.Error(jsonResp)
	} else if citizenProfileAsBytes == nil {
		jsonResp := "{\"Error\":\"Profile does not exist!\"}"
		return shim.Error(jsonResp)
	}

	// Create new Profile Variable
	citizenProfileToTransfer := citizenProfile{}
	err = json.Unmarshal(citizenProfileAsBytes, &citizenProfileToTransfer) //unmarshal it aka JSON.parse()
	if err != nil {
		return shim.Error(err.Error())
	}

	// Update citizenProfile attributes
	citizenProfileToTransfer.Name = params[1]
	citizenProfileToTransfer.Address = params[2]

	// Convert to Byte[]
	citizenProfileJSONasBytes, err := json.Marshal(citizenProfileToTransfer)
	if err != nil {
		return shim.Error(err.Error())
	}

	// Put updated State of the Profile with Key => params[0]
	err = stub.PutState(key, citizenProfileJSONasBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	// Returned on successful execution of the function
	return shim.Success(nil)
}

// ---------------------------------------------
// Helper Functions
// ---------------------------------------------

// Authentication
// ++++++++++++++

// Get Tx Creator Info
func getTxCreatorInfo(stub shim.ChaincodeStubInterface) (string, string, string, error) {
	var mspid string
	var err error
	var cert *x509.Certificate
	mspid, err = cid.GetMSPID(stub)

	if err != nil {
		fmt.Printf("Error getting MSP identity: %sn", err.Error())
		return "", "", "", err
	}

	cert, err = cid.GetX509Certificate(stub)
	if err != nil {
		fmt.Printf("Error getting client certificate: %sn", err.Error())
		return "", "", "", err
	}

	return mspid, cert.Issuer.CommonName, cert.Subject.CommonName, nil
}

// Authenticate => IdentityAuthority
func authenticatePollution(mspID string, certCN string) bool {
	return (mspID == "IdentityAuthorityMSP") && (certCN == "ca.identityauthority.ian.com")
}
