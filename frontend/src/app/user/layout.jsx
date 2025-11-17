import React from 'react'

import Navbar from '../(main)/navbar'

const Layout = ({ children }) => {
    return (
        <>
            
            <Navbar />
            {children}
        </>
    )
}

export default Layout