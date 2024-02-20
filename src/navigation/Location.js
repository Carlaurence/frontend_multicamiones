import React from 'react';
import Navbar from '../components/Navbar';
import Mapss from '../components/Mapss';
import Footer from '../components/Footer';


const Location = () => {

    return (
        <div className="relative overflow-hidden flex flex-col bg-gradient-to-r from-black via-gray-400 to to-white">
            
            <Navbar />

            <div className="mt-[115px] min-h-screen">
                <Mapss />
            </div>

            <Footer />

        </div>
    )
}

export default Location;

/**
 return (
        <>
            <Navbar />
            <div className="bg-gradient-to-r from-black via-gray-400 to to-white flex justify-center">
                <h1>About_US</h1>
            </div>
        </>
    )
 */