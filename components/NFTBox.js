import { useState, useEffect } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import nftAbi from "../constants/BasicNft.json"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"
import UpdateListingModal from "./UpdateListingModal"
import { useRouter } from "next/router"
import { toast } from "react-toastify"

const truncateStr = (fullStr, strLen) => {
    if (fullStr.length <= strLen) return fullStr

    const separator = "..."
    const seperatorLength = separator.length
    const charsToShow = strLen - seperatorLength
    const frontChars = Math.ceil(charsToShow / 2)
    const backChars = Math.floor(charsToShow / 2)
    return (
        fullStr.substring(0, frontChars) +
        separator +
        fullStr.substring(fullStr.length - backChars)
    )
}

export default function NFTBox({ price, nftAddress, tokenId, marketplaceAddress, seller }) {
    const { isWeb3Enabled, account } = useMoralis()
    const [imageURI, setImageURI] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
    const [showModal, setShowModal] = useState(false)
    const hideModal = () => setShowModal(false)
    const dispatch = useNotification()
    let router = useRouter()

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId,
        },
    })

    const { runContractFunction: buyItem } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "buyItem",
        msgValue: price,
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
        },
    })

    async function updateUI() {
        const tokenURI = await getTokenURI()
        if (tokenURI) {
            const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            const tokenURIResponse = await (await fetch(requestURL)).json()
            const imageURI = tokenURIResponse.image
            const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            setImageURI(imageURIURL)
            setTokenName(tokenURIResponse.name)
            setTokenDescription(tokenURIResponse.description)
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const isOwnedByUser = seller === account
    const formattedSellerAddress = isOwnedByUser ? "you" : truncateStr(seller || "", 12)
    const buttonString = isOwnedByUser ? "Update price" : "Buy"

    const handleCardClick = () => {
        isOwnedByUser
            ? setShowModal(true)
            : buyItem({
                  onError: (error) => console.log(error),
                  onSuccess: (tx) => handleBuyItemSuccess(tx),
              })
    }

    const handleBuyItemSuccess = async (tx) => {
        await tx.wait()
        toast.success("Item Bought, copy nft address!", {
            autoClose: 20000,
            hideProgressBar: true,
        })
        toast.info(`Address: ${nftAddress}`, { autoClose: 20000, hideProgressBar: true })
        toast.warning("Page refresh in 20seconds", { autoClose: 20000, hideProgressBar: true })
        setTimeout(() => {
            router.reload("/")
        }, 20000)
    }

    return (
        <div className="col-span-1 mb-5 w-full bg-white border rounded-lg transform duration-500 hover:-translate-y-3">
            {imageURI ? (
                <center>
                    <div className="absolute">
                        <UpdateListingModal
                            isVisible={showModal}
                            tokenId={tokenId}
                            marketplaceAddress={marketplaceAddress}
                            nftAddress={nftAddress}
                            onClose={hideModal}
                        />
                    </div>
                    <div className="group">
                        <div
                            className="max-w-sm rounded overflow-hidden  cursor-pointer"
                            onClick={handleCardClick}
                        >
                            <img className="w-full h-72" src={imageURI} alt="NFT" />
                            <div className="px-6 pt-4">
                                <div className="flex flex-col flex-wrap justify-between">
                                    <div className="inline-block bg-slate-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                                        Owned by {formattedSellerAddress}
                                    </div>
                                    <p className="font-bold text-lg flex">
                                        {tokenName} #{tokenId}
                                    </p>

                                    <span className="text-gray-400 font-semibold text-sm flex">
                                        {tokenDescription}
                                    </span>
                                </div>
                            </div>
                            <div className="flex pt-3">
                                <span className="w-max rounded-full text-sm font-bold  mr-2 visible group-hover:invisible absolute mx-6">
                                    {ethers.utils.formatUnits(price, "ether")} ETH
                                </span>
                                <div className="py-3 w-full  font-semibold bg-blue-500 text-white invisible group-hover:visible">
                                    {buttonString}
                                </div>
                            </div>
                        </div>
                    </div>
                </center>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    )
}
