import "../styles/globals.css"
import { MoralisProvider } from "react-moralis"
import Header from "../components/Header"
import Head from "next/head"
import { NotificationProvider } from "web3uikit"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import Footer from "../components/Footer"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useState, createContext } from "react"

export const RefreshContext = createContext()

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "https://api.studio.thegraph.com/query/39476/studio-graph-prod/0.0.1",
})

function App({ Component, pageProps }) {
    const [refresh, setRefresh] = useState(false)
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
                        <ToastContainer
                            position="bottom-center"
                            autoClose={5000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick={false}
                            rtl={false}
                            pauseOnFocusLoss={false}
                            draggable={false}
                            pauseOnHover
                        />

                        <Header />
                        <div className="bg-[#fcfafa] pt-20">
                            <RefreshContext.Provider
                                value={{ state: { refresh: refresh, setRefresh: setRefresh } }}
                            >
                                <Component {...pageProps} />
                            </RefreshContext.Provider>
                        </div>
                    </NotificationProvider>
                </ApolloProvider>
            </MoralisProvider>
            <Footer />
        </>
    )
}

export default App
