import { Modal, Input, useNotification } from "web3uikit"
import { useState } from "react"
import { useWeb3Contract } from "react-moralis"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import { ethers } from "ethers"

export default function UpdateListingModal({
    nftAddress,
    tokenId,
    isVisible,
    marketplaceAddress,
    onClose,
}) {
    const dispatch = useNotification()

    const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState(0)

    const handleUpdateListingSuccess = () => {
        dispatch({
            type: "success",
            message: "listing updated",
            title: "Please wait for transaction confirmation",
            position: "topR",
        })
        onClose && onClose()
        setPriceToUpdateListingWith("0")
    }

    const { runContractFunction: updateListing } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "updateListing",
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
            newPrice: ethers.utils.parseEther(priceToUpdateListingWith || "0.1"),
        },
    })

    return (
        <div>
            <Modal
                isVisible={isVisible}
                onCancel={onClose}
                onCloseButtonPressed={onClose}
                title={<p className="font-bold text-xl text-green-500">Update price</p>}
                onOk={() => {
                    updateListing({
                        onError: (error) => {
                            console.log(error)
                        },
                        onSuccess: () => handleUpdateListingSuccess(),
                    })
                }}
                className="max-h-[75%] scrollbar-hide"
            >
                <div className="pb-7">
                    <Input
                        label="New price (ETH)"
                        name="New listing price"
                        type="number"
                        onChange={(event) => {
                            setPriceToUpdateListingWith(event.target.value)
                        }}
                    />
                </div>
            </Modal>
        </div>
    )
}
