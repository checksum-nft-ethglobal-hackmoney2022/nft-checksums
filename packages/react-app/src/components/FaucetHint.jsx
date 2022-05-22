import { Button } from "antd";
import React, { useState } from "react";
import { ethers } from "ethers";
import { useBalance, useGasPrice } from "eth-hooks";

import { Transactor } from "../helpers";

function FaucetHint({ localProvider, targetNetwork, address }) {
  const [faucetClicked, setFaucetClicked] = useState(false);

  // fetch local balance
  const yourLocalBalance = useBalance(localProvider, address);

  // get gas Price from network
  const gasPrice = useGasPrice(targetNetwork, "fast");

  // Faucet Tx can be used to send funds from the faucet
  const faucetTx = Transactor(localProvider, gasPrice);

  let faucetHint = "";

  return (
    <div style={{ padding: 16, display: "inline-flex" }}>
        <Button
          type="primary"
          onClick={() => {
            faucetTx({
              to: address,
              value: ethers.utils.parseEther("1.00"),
            });
          }}
        >
          💰 Grab funds from the faucet ⛽️
        </Button>
      </div>
  )
}

export default FaucetHint;
