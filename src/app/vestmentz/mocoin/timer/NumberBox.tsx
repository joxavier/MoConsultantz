import React from 'react'

interface numProp {
    num: string | number,
    unit: string,
    flip: boolean,
};

export const NumberBox = ({ num, unit, flip }: numProp) => {
    return (
        <div className="flex flex-col items-center ">
            <div className="relative bg-transparent flex flex-col items-center justify-center rounded-lg w-20 h-20 sm:w-20 sm:h-20 md:w-32 md:h-32">
                <div className="rounded-t-lg rounded-b-lg bg-[#111111] w-2/3 h-2/3"></div>

                <div className="text-4xl md:text-5xl absolute text-white z-10 font-bold font-redhat font-mono">
                    {num}
                </div>
                <div className="rounded-b-lg rounded-t-lg bg-[#111111] w-2/3 h-2/3"></div>
                <div className={`absolute w-2/3 h-2/5 top-0 rounded-t-lg z-5 ${flip ? 'animate-flip bg-[#2c2e3f]' : 'bg-transparent'}`}></div>

            </div>
            <p className="text-lg mt-2 font-semibold text-[#000000] md:text-xl">
                {unit}
            </p>
        </div>

        

    )
}
