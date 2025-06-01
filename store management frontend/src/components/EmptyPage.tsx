import React from 'react'
import emptyList from "../assets/emptyList.png";
import emptyImage from "../assets/emptyImage.svg"

export default function EmptyPage({message}) {
    return (
        <div className='w-full flex flex-col justify-center items-center'>
            <img src={emptyImage} alt="" className='h-[30vh]'/>
            <p className='font-medium text-gray-600'>{message}</p>
        </div>
    )
}
