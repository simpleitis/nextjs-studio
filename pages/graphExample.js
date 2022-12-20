import React from "react"
import { useQuery, gql } from "@apollo/client"

const GET_ACTIVE_ITEMS = gql`
    {
        activeItems(first: 5, where: { buyer: "0x0000000000000000000000000000000000000000" }) {
            id
            buyer
            nftAddress
            tokenId
            price
        }
    }
`

export default function graphExample() {
    const { loading, error, data } = useQuery(GET_ACTIVE_ITEMS)
    console.log(data)
    return <div>Hi</div>
}
