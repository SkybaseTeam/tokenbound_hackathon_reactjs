"use client"

import { ConnectedStarknetWindowObject } from "get-starknet-core";
import { useState } from "react";
import { TokenboundConnector, TokenBoundModal, useTokenBoundModal } from "tokenbound-connector";

function TokenBoundExample() {
  const [connection, setConnection] = useState<ConnectedStarknetWindowObject>();
  const [account, setAccount] = useState();
  const [address, setAddress] = useState("");
  
  const {
    isOpen,
    openModal,
    closeModal,
    value,
    selectedOption,
    handleChange,
    handleChangeInput,
    resetInputValues,
  } = useTokenBoundModal();

  const tokenbound = new TokenboundConnector({
    tokenboundAddress: value,
    parentAccountId: selectedOption,
  });

  const connectTBA = async () => {
    const connection = await tokenbound.connect();
    closeModal();
    resetInputValues();

    if (connection && connection.isConnected) {
      setConnection(connection);
      setAccount(connection.account);
      setAddress(connection.selectedAddress);
    }
  };

  const disconnectTBA = async () => {
    await tokenbound.disconnect();
    setConnection(undefined);
    setAccount(undefined);
    setAddress("");
  };

  return (
    <div>
        <p><b>Address: {address ? address : "Undefind"}</b></p>

      {!connection ? (
        <button
          className="button"
          onClick={openModal}
        >
          Connect Wallet
        </button>
      ) : (
        <button className="" onClick={disconnectTBA}>
          Disconnect
        </button>
      )}

      {isOpen && (
        <TokenBoundModal
          isOpen={isOpen}
          closeModal={closeModal}
          value={value}
          selectedOption={selectedOption}
          handleChange={handleChange}
          handleChangeInput={handleChangeInput}
          onConnect={connectTBA}
        />
      )}
    </div>
  );
}

export default TokenBoundExample;