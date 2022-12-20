import React from "react"
import Link from "next/link"
import Navbar from "./Navbar"

function Header() {
    return (
        <div className="flex justify-between sm:px-3 py-1.5 border fixed z-20 bg-white w-full">
            <Link href="/">
                <div className="self-center font-bold text-gray-800 text-2xl sm:text-5xl flex">
                    <img src="logo.png" className="self-center pl-2" alt="logo" />
                    <p className="self-center text-[#494b4d] pl-2">Studio</p>
                </div>
            </Link>
            <Navbar />
        </div>
    )
}

export default Header
