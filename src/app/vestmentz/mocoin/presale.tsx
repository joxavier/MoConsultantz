// PreSaleInstructions.tsx

import React from 'react';
import { FaInstagram } from 'react-icons/fa6';

const PreSaleInstructions: React.FC = () => {
    return (
        <div className="text-center items-center p-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-black font-bold">
                <span className="text-shadow-black text-outline-black">{'Pre-Sale Instructions'}</span>
            </h1>
            <div className="mt-8">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-700 mb-4">Step 1: Send Solana to movestmentz.sol</h2>
                <p className="text-lg text-center ">
                    Participate in the pre-sale by sending SOL to{' '}
                    <a href="https://solscan.io/account/9mVADHnQYVesb6xwZziYBeaH1HXM3DhKY55PHRS9UgEa" target="_blank" rel="noopener noreferrer">
                        <code>movestmentz.sol</code>
                    </a>{' '} using your Solana wallet.
                </p>
            </div>
            <div className="mt-8 flex justify-center items-center flex-col">
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-700 mb-4">Step 2: Follow MoVestmentz on Instagram</h3>
                <p className="text-lg text-center">
                    Follow MoVestmentz on Instagram for updates and announcements regarding the pre-sale. Stay tuned for exclusive content and opportunities related to the pre-sale.
                </p>

                <a href={'https://instagram.com/joshuax32'} target="_blank" rel="noopener noreferrer">
                    <h2 className="text-center" style={{ fontSize: '64px', margin: '8px' }}><FaInstagram /></h2>
                </a>
            </div>
        </div>


    );
};

export default PreSaleInstructions;
