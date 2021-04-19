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

// Definition of the ICN Tx Record
type ICNTx struct {
	ID                      string `json:"ID"`
	RequestNetworkID        string `json:"RequestNetworkID"`
	RequestNetworkUserID    string `json:"RequestNetworkUserID"`
	RequestNetworkUserGroup string `json:"RequestNetworkUserGroup"`
	Payload                 string `json:"Payload"`
	Method                  string `json:"Method"`
	Contract                string `json:"Contract"`
}

// Init is called when the chaincode is instantiated by the blockchain network.
func (cc *Chaincode) Init(stub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

// Invoke is called as a result of an application request to run the chaincode.
func (cc *Chaincode) Invoke(stub shim.ChaincodeStubInterface) sc.Response {
	fcn, params := stub.GetFunctionAndParameters()
	fmt.Println("Invoke()", fcn, params)

	if fcn == "createICNTx" {
		return cc.createICNTx(stub, params)
	} else if fcn == "readICNTx" {
		return cc.readICNTx(stub, params)
	} else {
		fmt.Println("Invoke() did not find func: " + fcn)
		return shim.Error("Received unknown function invocation!")
	}
}

// Function to create new ICNTx (C of CRUD)
func (cc *Chaincode) createICNTx(stub shim.ChaincodeStubInterface, params []string) sc.Response {
	// Check Access
	creatorOrg, creatorCertIssuer, _, err := getTxCreatorInfo(stub)
	if !authenticateIdentityAuthority(creatorOrg, creatorCertIssuer) {
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

	key := "icntx-" + params[0]

	// Check if ICNTx exists with Key => params[0]
	ICNTxAsBytes, err := stub.GetState(key)
	if err != nil {
		return shim.Error("Failed to check if ICNTx exists!")
	} else if ICNTxAsBytes != nil {
		return shim.Error("ICNTx Already Exists!")
	}

	// Generate ICNTx from params provided
	ICNTx := &ICNTx{params[0], params[1], params[2], params[3], params[4], params[5], params[6]}
	ICNTxJSONasBytes, err := json.Marshal(ICNTx)
	if err != nil {
		return shim.Error(err.Error())
	}

	// Put State of newly generated ICNTx with Key => params[0]
	err = stub.PutState(key, ICNTxJSONasBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	// Returned on successful execution of the function
	return shim.Success(nil)
}

// Function to read an ICNTx (R of CRUD)
func (cc *Chaincode) readICNTx(stub shim.ChaincodeStubInterface, params []string) sc.Response {
	// Check if sufficient Params passed
	if len(params) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	// Check if Params are non-empty
	if len(params[0]) <= 0 {
		return shim.Error("1st argument must be a non-empty string")
	}

	key := "icntx-" + params[0]

	// Get State of ICNTx with Key => params[0]
	ICNTxAsBytes, err := stub.GetState(key)
	if err != nil {
		jsonResp := "{\"Error\":\"Failed to get state for " + params[0] + "\"}"
		return shim.Error(jsonResp)
	} else if ICNTxAsBytes == nil {
		jsonResp := "{\"Error\":\"ICNTx does not exist!\"}"
		return shim.Error(jsonResp)
	}

	// Returned on successful execution of the function
	return shim.Success(ICNTxAsBytes)
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
func authenticateIdentityAuthority(mspID string, certCN string) bool {
	return (mspID == "IdentityAuthorityMSP") && (certCN == "ca.identityauthority.ian.com")
}
