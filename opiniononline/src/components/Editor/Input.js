import React, { useEffect, useRef, useState } from "react";


import IconButton from '../IconButton';

import { FaBold, FaItalic, FaUnderline, FaRemoveFormat } from "react-icons/fa";

const Input = React.forwardRef(({ disabled = false, placeholder, value = "", onChange = {}, setStyling = false, className, onButtonClicks, buttonStates }, ref) => {
    const [inputFocussed, setInputFocussed] = useState(false);


    const classNameButtons = "bg-primary text-white"


    function onBlur(e) {
        if (e.relatedTarget?.classList.contains('style')) return

        setInputFocussed(false)
    }
    return (
        <div  className={`flex-1 mb-1`}>
            <div className="relative flex items-center outline-0  text-left focus-within:before:w-full before:absolute before:content-[''] before:w-0 before:bg-primary before:h-0.5 before:bottom-0 before:left-1/2 before:-translate-x-1/2
                                transform before:transition-all before:ease-in-out before:delay-75
                                  ">

                <div onFocus={() => setInputFocussed(true)} onBlur={onBlur} className="flex-1">

                    <input id="titleElement" ref={ref} disabled={disabled} className={`w-full focus:outline-none text-2xl py-2 px-1 bg-transparent ${className}`} type="text" placeholder={placeholder} value={value} onChange={(e) => onChange && onChange(e.target.value)}

                    />


                    <div className={`${inputFocussed && setStyling ? 'block' : 'hidden'} flex gap-4  mt-4 text-xl style ${className?.includes('text-end') && 'justify-end'}`}>
                        <IconButton id="boldButton" className={`style ${buttonStates?.isBold ? classNameButtons : ""}`} onClick={() => onButtonClicks.Bold()} icon={FaBold} message={'Vet'} />
                        <IconButton className={`style ${buttonStates?.isCursive ? classNameButtons : ""}`} onClick={() => onButtonClicks.Cursive()} icon={FaItalic} message={'Cursief'} />
                        <IconButton className={`style ${buttonStates?.isUnderlined ? classNameButtons : ""}`} onClick={() => onButtonClicks.Underlined()} icon={FaUnderline} message={'Onderstrepen'} />

                        {
                          //  <IconButton icon={FaRemoveFormat} message={'Opmaak verwijderen'} />
                        }
                    </div>


                </div>


            </div>
        </div>
    )

})



export default Input;