import {
    getDomainSeperator,
    getDataToSignForEIP712,
    buildForwardTxRequest,
    getBiconomyForwarderConfig,
    getDataToSignForPersonalSign
} from './biconomyForwarderHelpers.js';

import { ethers } from "ethers";
import { Biconomy } from "@biconomy/mexa";
import fetch from "node-fetch";

let config = {
    api: {
        prod: "https://api.biconomy.io"
    }
}
const buddyAbi =  [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "approved",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "baseURI",
          "type": "string"
        }
      ],
      "name": "BaseURIUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "conversion",
          "type": "address"
        }
      ],
      "name": "ConversionUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "percentage",
          "type": "uint256"
        }
      ],
      "name": "DeviationPercentageUpdate",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "mintFee",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "uriUpdateFee",
          "type": "uint256"
        }
      ],
      "name": "FeeUpdate",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "creator",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "string",
          "name": "indexedTokenIPFSPath",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "tokenIPFSPath",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string[]",
          "name": "category",
          "type": "string[]"
        },
        {
          "indexed": false,
          "internalType": "string[]",
          "name": "values",
          "type": "string[]"
        }
      ],
      "name": "Minted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "symbol",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "baseURI",
          "type": "string"
        }
      ],
      "name": "NFTMetadataUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "paymentToken",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "feeAmount",
          "type": "uint256"
        }
      ],
      "name": "PaymentDetails",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "fromCreator",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "toCreator",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "TokenCreatorUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "string",
          "name": "indexedTokenIPFSPath",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "tokenIPFSPath",
          "type": "string"
        }
      ],
      "name": "TokenIPFSPathUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "tokenAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "status",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "freePassStatus",
          "type": "uint256"
        }
      ],
      "name": "TokenUpdate",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "creator",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "string",
          "name": "indexedTokenIPFSPath",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "tokenIPFSPath",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string[]",
          "name": "category",
          "type": "string[]"
        },
        {
          "indexed": false,
          "internalType": "string[]",
          "name": "values",
          "type": "string[]"
        }
      ],
      "name": "Updated",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "uint256[]",
          "name": "tokenIds",
          "type": "uint256[]"
        },
        {
          "internalType": "address[]",
          "name": "collectionAddress",
          "type": "address[]"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "_lock",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "uint256[]",
          "name": "releaseTokenIds",
          "type": "uint256[]"
        },
        {
          "internalType": "address[]",
          "name": "releaseColAddresses",
          "type": "address[]"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "_release",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_baseURI",
          "type": "string"
        }
      ],
      "name": "adminUpdateBaseURI",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_conversionAddress",
          "type": "address"
        }
      ],
      "name": "adminUpdateConversion",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_deviationPercentage",
          "type": "uint256"
        }
      ],
      "name": "adminUpdateDeviation",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_mintFee",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_updateFee",
          "type": "uint256"
        }
      ],
      "name": "adminUpdateFeeAmount",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_tokenAddress",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "status",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "freepassStatus",
          "type": "uint256"
        }
      ],
      "name": "adminUpdateFeeToken",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "baseURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "burn",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "feeAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "checkDeviation",
      "outputs": [],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "conversionAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "deviationPercentage",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "getApproved",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getBuddyTreasury",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "creator",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "tokenIPFSPath",
          "type": "string"
        }
      ],
      "name": "getHasCreatorMintedIPFSHash",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "buddyID",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "collectionContract",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "findID",
          "type": "uint256"
        }
      ],
      "name": "getIsLocked",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getMintFee",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getNextTokenId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "getTokenIPFSPath",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getUpdateFee",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address payable",
          "name": "treasury",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "symbol",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "conversion",
          "type": "address"
        }
      ],
      "name": "initialize",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "mapTokenIds",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address payable",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "tokenIPFSPath",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "paymentToken",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "feeAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256[]",
          "name": "tokenIds",
          "type": "uint256[]"
        },
        {
          "internalType": "address[]",
          "name": "collectionAddress",
          "type": "address[]"
        },
        {
          "internalType": "string[]",
          "name": "properties",
          "type": "string[]"
        },
        {
          "internalType": "string[]",
          "name": "values",
          "type": "string[]"
        },
        {
          "internalType": "string",
          "name": "_type",
          "type": "string"
        }
      ],
      "name": "mint",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "nftIdPassStatus",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ownerOf",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "propTovalue",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "registerInterfaces",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "_data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "tokenAddress",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "tokenByIndex",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "tokenCreator",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "tokenFreePassStatus",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "tokenIdToProp",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "tokenOfOwnerByIndex",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "tokenURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "tokenIPFSPath",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "paymentToken",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "feeAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256[]",
          "name": "tokenIds",
          "type": "uint256[]"
        },
        {
          "internalType": "address[]",
          "name": "collectionAddresses",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "releaseTokenIds",
          "type": "uint256[]"
        },
        {
          "internalType": "address[]",
          "name": "releaseColAddresses",
          "type": "address[]"
        },
        {
          "internalType": "string[]",
          "name": "properties",
          "type": "string[]"
        },
        {
          "internalType": "string[]",
          "name": "values",
          "type": "string[]"
        },
        {
          "internalType": "string",
          "name": "_type",
          "type": "string"
        }
      ],
      "name": "updateTokenURI",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    }
];

const buddyAddress = "0x46C1891a312a49709926bb3fe7Af99F8F8029151";

let options = {
    apiKey: "5vvtZa68O.d12d165f-9baa-485d-b53b-a5f46f65e43b",
    debug: true,
};

const rpc = "https://rpc-mumbai.maticvigil.com";
const networkId = 80001;

let jsonRpcProvider = new ethers.providers.JsonRpcProvider(rpc);

const biconomy = new Biconomy(jsonRpcProvider, options);

const ethersProvider = new ethers.providers.Web3Provider(biconomy);

let buddyInstance;
let signerAddress = "0xCb6ffD84E7D553643288b42196A6976679E94ede";
let privateKey = "92687ee3a4b4d0f219c93597f226b63301beeff04cd2397f96696eba9f02a3ec";

biconomy.onEvent(biconomy.READY, () => {
    buddyInstance = new ethers.Contract(
        buddyAddress,
        buddyAbi,
        biconomy.getSignerByAddress(signerAddress)
    );
    for(let i=1; i<=2; i++) {
      if(i==1) {
        mint("0x79313Acc5916cbF07b528e5ed37bcBdd6BF8D489","QmYfH2YVS1qCJKTCPzd8fwfb7Xy1L99VZbJy6vcDTG1jmY","0xa7DaEDa2b350D8a7e8185aF13dA143127A19ffb4", "87", ["0"], ["0x0000000000000000000000000000000000000000"],["gender","body_shape","outfit","outfit_type"],["male","standard","casual_wear","default"], "ERC721", i);
      } else if(i==2) {
        mint("0x274DC0B318b3918d01b94d84bEAD5e1452Aaf521","QmWiXyp1HvTTv657QyeSzCpe5g5DcB7GiJLeLhLEPUDFdo","0xa7DaEDa2b350D8a7e8185aF13dA143127A19ffb4", "88", ["0"], ["0x0000000000000000000000000000000000000000"],["gender","body_shape","outfit","outfit_type"],["male","standard","casual_wear","default"], "ERC721", i); 
      }

    }
}).onEvent(biconomy.ERROR, (error, message) => {
    console.log(message);
    console.log(error);
});

const mint = async (userAddress, tokenIPFSPath, paymentToken, feeAmount, tokenIds, collectionAddress, properties, values, _type, batchId) => {
    try{
       let userSigner = new ethers.Wallet(privateKey);
      
        //call a function of the contract
        let { data }= await buddyInstance.populateTransaction.mint(userAddress, tokenIPFSPath, paymentToken, feeAmount, tokenIds, collectionAddress, properties, values, _type);
        //console.log("data", data);
        
        //gasPrice
        let gasPrice = await ethersProvider.getGasPrice();

        //gasLimit
        let gasLimit = await ethersProvider.estimateGas({
            to:buddyAddress,
            from:userAddress,
            data:data
        });
        
        
        console.log("gasLimit", gasLimit.toString());
        console.log("gasPrice", gasPrice.toString());

        
        let forwarder = await getBiconomyForwarderConfig(networkId);
        //console.log("forwarder", forwarder);
        let forwarderContract = new ethers.Contract(
            forwarder.address,
            forwarder.abi,
            biconomy.getSignerByAddress(signerAddress)
        );

        const batchNonce = await forwarderContract.getNonce(userAddress, 0);
        console.log("batchNonce", Number(batchNonce));
        
        const gasLimitNum = Number(gasLimit.toNumber().toString());
        //const batchId = 0;
        const to = buddyAddress;
        const req = await buildForwardTxRequest({
            account:signerAddress,
            to,
            gasLimitNum,
            batchId,
            batchNonce,
            data,
        });
        // console.log(req);
        const hashToSign = getDataToSignForPersonalSign(req);
        // console.log("hashToSign", hashToSign);

        const signature = await userSigner.signMessage(hashToSign);
        // console.log("signature", signature);
        // console.log("signerAddress", signerAddress);
        sendTransaction({
            userAddress:signerAddress,
            request:req,
            sig:signature,
            signatureType: "PERSONAL_SIGN",
        });

    } catch(error) {
        console.log(error);
    }
}

const sendTransaction = async ({userAddress, request, sig, signatureType}) => {
    let params;
    params = [request, sig];
    try {
        fetch(`${config.api.prod}/api/v2/meta-tx/native`, {
            method: "POST",
            headers: {
                "x-api-key": options.apiKey,
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
                to:buddyAddress,
                apiId:"d0998a51-e4ed-4857-a4c7-a06c40236778",
                params:params,
                from:userAddress,
                signatureType:signatureType
            }),
        })
        .then((response) => response.json())
        .then(async function(result) {
            console.log("result", result);
            console.log(`Transaction sent by relayer with hash ${result.txHash}`);
            // let receipt = await ethersProvider.getTransactionReceipt(result.txHash);
            // console.log(`Transaction Confirmed.`);
            // console.log(receipt);
            //return result.txHash;
        })
        // .then(function(hash) {
        //     ethersProvider.once(hash, (transaction) => {
        //         // Emitted when the transaction has been mined
        //         console.log("transaction", transaction);
        //         console.log("hash", hash);
        //     });
        // })
        .catch(function(error){
            console.log(error);
        });
    } catch (error) {
        console.log(error);
    }
};