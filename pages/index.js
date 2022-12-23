import { useMoralisQuery, useMoralis } from "react-moralis"
import NFTBox from "../components/NFTBox"
import networkMapping from "../constants/networkMapping.json"
import GET_ACTIVE_ITEMS from "../constants/subgraphQueries"
import { useQuery } from "@apollo/client"
import { list } from "postcss"
import { useEffect, useState, useContext } from "react"
import { useRouter } from "next/router"
import { RefreshContext } from "./_app"

export default function Index() {
    const { isWeb3Enabled, chainId } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = networkMapping[chainString].NftMarketplace[0]
    const router = useRouter()
    const value = useContext(RefreshContext)
    let { refresh } = value.state
    let { setRefresh } = value.state

    const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS)

    useEffect(() => {
        if (refresh) {
            setRefresh(false)
            router.reload();
        }
    }, [refresh])

    return (
        <>
            <div className="min-h-screen">
                <h1 className="px-10 2xl:px-20 py-10 font-bold text-3xl">Recently Listed</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-10 2xl:px-20 sm:gap-x-12">
                    {isWeb3Enabled ? (
                        loading || !listedNfts ? (
                            <div>Loading...</div>
                        ) : (
                            listedNfts.activeItems.map((nft) => {
                                const { price, nftAddress, tokenId, seller } = nft
                                return (
                                    <NFTBox
                                        price={price}
                                        nftAddress={nftAddress}
                                        tokenId={tokenId}
                                        marketplaceAddress={marketplaceAddress}
                                        seller={seller}
                                        key={`${nftAddress}${tokenId}`}
                                    />
                                )
                            })
                        )
                    ) : (
                        <div>Web3 Currently Not Enabled</div>
                    )}
                </div>
            </div>
        </>
    )
}
