'use client';
import Image from 'next/image';
import './MessageList.scss';

import {useState} from 'react';

export default function MessageList({messageList}: {messageList: string[]}) {

    return (
        <>
            <ul>   
                {messageList.map((message: string, index: number) => (
                    <div>
                        {(index % 2) === 0 ?
                        <div className='flex'>

                        <li>
                             
                            <Image 
                            src={'/Mint.png' ? '/Mint.png' : ''} 
                            alt='The Etogy logo.'
                            height={25}
                            width={25}/>
                            
                            <p>Chatbot:</p>
                            <p className='overflow'>{message}</p>
                        </li> 
                        </div> :
                        <li className='gray'>
                            <p>User:</p>
                            <p className='overflow'>{message}</p>
                        </li>
                        }
                    </div>        
                ))}
            </ul>
        </>
    )
}