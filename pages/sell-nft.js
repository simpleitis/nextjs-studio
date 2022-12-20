import { Form, useNotification } from "web3uikit"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ethers } from "ethers"
import nftAbi from "../constants/BasicNft.json"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import networkMapping from "../constants/networkMapping.json"
import { useEffect, useState } from "react"

export default function Home() {
    const { chainId, account, isWeb3Enabled } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = networkMapping[chainString].NftMarketplace[0]
    const dispatch = useNotification()
    const [proceeds, setProceeds] = useState("0")

    const { runContractFunction } = useWeb3Contract()

    async function approveAndList(data) {
        console.log("Approving...")
        const nftAddress = data.data[0].inputResult
        const tokenId = data.data[1].inputResult
        const price = ethers.utils.parseUnits(data.data[2].inputResult, "ether").toString()

        const approveOptions = {
            abi: nftAbi,
            contractAddress: nftAddress,
            functionName: "approve",
            params: {
                to: marketplaceAddress,
                tokenId: tokenId,
            },
        }

        await runContractFunction({
            params: approveOptions,
            onSuccess: (tx) => handleApproveSuccess(tx, nftAddress, tokenId, price),
            onError: (error) => {
                console.log(error)
            },
        })
    }

    async function handleApproveSuccess(tx, nftAddress, tokenId, price) {
        console.log("Ok! Now time to list")
        await tx.wait()
        const listOptions = {
            abi: nftMarketplaceAbi,
            contractAddress: marketplaceAddress,
            functionName: "listItem",
            params: {
                nftAddress: nftAddress,
                tokenId: tokenId,
                price: price,
            },
        }

        await runContractFunction({
            params: listOptions,
            onSuccess: () => handleListSuccess(),
            onError: (error) => console.log(error),
        })
    }

    async function handleListSuccess() {
        dispatch({
            type: "success",
            message: "NFT listing",
            title: "NFT listed",
            position: "topR",
        })
    }

    const handleWithdrawSuccess = () => {
        dispatch({
            type: "success",
            message: "Withdrawing proceeds",
            position: "topR",
        })
    }

    async function setupUI() {
        const returnedProceeds = await runContractFunction({
            params: {
                abi: nftMarketplaceAbi,
                contractAddress: marketplaceAddress,
                functionName: "getProceeds",
                params: {
                    seller: account,
                },
            },
            onError: (error) => console.log(error),
        })
        if (returnedProceeds) {
            setProceeds(returnedProceeds.toString())
        }
    }

    useEffect(() => {
        setupUI()
    }, [proceeds, account, isWeb3Enabled, chainId])

    return (
        <>
            <div className="bg-white flex justify-around min-h-[60vh] ">
                <div className="min-w-[50%] self-center">
                    <h1 className="p-5 font-bold text-3xl text-slate-600">Sell NFT</h1>
                    <Form
                        buttonConfig={{
                            theme: "primary",
                        }}
                        data={[
                            {
                                name: "NFT Address",
                                type: "text",
                                inputWidth: "100%",
                                value: "",
                                key: "nftAddress",
                            },
                            {
                                name: "Token ID",
                                type: "number",
                                inputWidth: "70%",
                                value: "",
                                key: "tokenId",
                            },
                            {
                                name: "Price (in ETH)",
                                type: "number",
                                inputWidth: "70%",
                                value: "",
                                key: "price",
                            },
                        ]}
                        onSubmit={approveAndList}
                        id="Main Form"
                    />
                </div>
                <div className="hidden md:block self-center">
                    <img src="sell.png" className="h-96" alt="logo" />
                </div>
            </div>

            <div class="inline-flex justify-center items-center w-full bg-white pt-10">
                <hr class="my-8 w-96 h-px bg-gray-500 border-0" />
                <span class="absolute left-1/2 px-3 font-medium text-gray-900 bg-white -translate-x-1/2">
                    OR
                </span>
            </div>

            <div className="bg-white flex justify-around min-h-screen  pt-40">
                <div className="hidden md:block ">
                    <img src="proceeds.png" className="h-96" alt="logo" />
                </div>
                <div className="min-w-[30%] ">
                    <h1 className="px-5 pt-20 font-bold text-3xl text-slate-600">
                        Withdraw proceeds
                    </h1>
                    <div className="m-5 font-bold text-xl text-slate-600 w-max">
                        Balance:{" "}
                        <p className="text-green-500 text-5xl">
                            {ethers.utils.formatUnits(proceeds, "ether")} ETH
                        </p>
                    </div>
                    {proceeds != "0" ? (
                        <div className="p-5 font-bold text-xl text-slate-600 flex justify-center">
                            <button
                                className="border-2 border-green-500 w-full h-max font-extrabold text-2xl sm:text-5xl p-5  rounded-3xl text-green-500 hover:bg-green-500 hover:text-white shadow-lg"
                                onClick={() => {
                                    runContractFunction({
                                        params: {
                                            abi: nftMarketplaceAbi,
                                            contractAddress: marketplaceAddress,
                                            functionName: "withdrawProceeds",
                                            params: {},
                                        },
                                        onError: (error) => console.log(error),
                                        onSuccess: () => handleWithdrawSuccess,
                                    })
                                }}
                            >
                                Withdraw
                            </button>
                        </div>
                    ) : (
                        <div className="px-5 font-bold text-4xl text-red-400">
                            No proceeds detected!
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
