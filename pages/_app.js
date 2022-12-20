import "../styles/globals.css"
import { MoralisProvider } from "react-moralis"
import Header from "../components/Header"
import Head from "next/head"
import { NotificationProvider } from "web3uikit"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import Footer from "../components/Footer"

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "https://api.studio.thegraph.com/query/39476/studio-graph-prod/0.0.1",
})

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>Studio</title>
                <meta name="description" content="NFT Marketplace" />
                <link rel="icon" href="/logo.png" />
            </Head>
            <MoralisProvider initializeOnMount={false}>
                <ApolloProvider client={client}>
                    <NotificationProvider>
                        <Header />
                        <div className="bg-[#fcfafa] pt-20">
                            <Component {...pageProps} />
                        </div>
                    </NotificationProvider>
                </ApolloProvider>
            </MoralisProvider>
            <Footer />
        </>
    )
}

export default MyApp
