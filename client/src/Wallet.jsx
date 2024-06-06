import { useState } from "react";
import server from "./server";
import { getAddress, hashMessage, signMessage } from "./lib/utils";
import { secp256k1 as secp } from "ethereum-cryptography/secp256k1";
import {
  bytesToUtf8,
  hexToBytes,
  utf8ToBytes,
  toHex,
} from "ethereum-cryptography/utils";

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  setPublicKey,
  privateKey,
  setPrivateKey,
}) {
  async function onChange(evt) {
    const pvtK = evt.target.value;
    setPrivateKey(pvtK);
    if (pvtK === "") {
      setPublicKey("");
      setAddress("");
    } else {
      const b = hexToBytes(pvtK);
      const publicKey = toHex(secp.getPublicKey(b));
      const address = `0x${getAddress(publicKey)}`;
      setPublicKey(publicKey);
      setAddress(address);

      if (address) {
        const {
          data: { balance },
        } = await server.get(`balance/${address}`);
        setBalance(balance);
      } else {
        setBalance(0);
      }
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private key:
        <input
          placeholder="Type your private key"
          value={privateKey}
          onChange={onChange}
        ></input>
      </label>
      <label>
        Wallet Address
        <input
          placeholder="Type an address, for example: 0x1"
          value={address}
          readOnly
        ></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
