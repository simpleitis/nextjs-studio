import { useState } from "react"
import { ConnectButton } from "web3uikit"
import Link from "next/link"

function Navbar() {
    const [isNavOpen, setIsNavOpen] = useState(false)

    return (
        <div className="flex items-center justify-between pr-3 lg:pr-0">
            <nav>
                <section className="MOBILE-MENU flex lg:hidden">
                    <div
                        className="HAMBURGER-ICON space-y-2"
                        onClick={() => setIsNavOpen((prev) => !prev)}
                    >
                        <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
                        <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
                        <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
                    </div>

                    <div className={isNavOpen ? "showMenuNav" : "hideMenuNav"}>
                        {" "}
                        <div
                            className="CROSS-ICON absolute top-0 right-0 px-8 py-8"
                            onClick={() => setIsNavOpen(false)}
                        >
                            <svg
                                className="h-8 w-8 text-gray-600"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </div>
                        <ul className="MENU-LINK-MOBILE-OPEN flex flex-col items-center justify-between min-h-[250px] font-medium">
                            <li className=" my-8 uppercase">
                                {/* 'moralisAuth' is set to 'false' as we don't want to connect to a moralis database on load */}
                                <ConnectButton moralisAuth={false} />
                            </li>
                            <li className="border-b border-gray-400 my-8 uppercase">
                                <Link href="/" onClick={() => setIsNavOpen(false)}>
                                    <p>NFT Marketplace</p>
                                </Link>
                            </li>
                            <li className="border-b border-gray-400 my-8 uppercase">
                                <Link href="/sell-nft" onClick={() => setIsNavOpen(false)}>
                                    <p>Sell NFT</p>
                                </Link>
                            </li>
                            <li className="border-b border-gray-400 my-8 uppercase">
                                <Link href="/credits" onClick={() => setIsNavOpen(false)}>
                                    <p>Credits</p>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </section>

                <ul className="DESKTOP-MENU hidden space-x-8 lg:flex items-center font-medium text-slate-600">
                    <li>
                        <Link href="/" className="hover:text-slate-900">
                            <p>NFT Marketplace</p>
                        </Link>
                    </li>
                    <li>
                        <Link href="/sell-nft" className="hover:text-slate-900">
                            <p>Sell NFT</p>
                        </Link>
                    </li>
                    <li>
                        <Link href="/credits" className="hover:text-slate-900">
                            <p>Credits</p>
                        </Link>
                    </li>
                    <li>
                        <ConnectButton moralisAuth={false} />
                    </li>
                </ul>
            </nav>
            <style>{`
      .hideMenuNav {
        display: none;
      }
      .showMenuNav {
        display: block;
        position: absolute;
        width: 100%;
        height: 100vh;
        top: 0;
        left: 0;
        background: white;
        z-index: 10;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
      }
    `}</style>
        </div>
    )
}

export default Navbar
