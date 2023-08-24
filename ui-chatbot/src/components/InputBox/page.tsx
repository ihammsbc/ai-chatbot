'use client';

import './InputBox.scss';
import {SetStateAction, useState} from 'react';
import Image from 'next/image';

export default function InputBox({setMessageList}) {

    const [input, setInput] = useState('');

    const handleChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setInput(e.target.value);
    }

    const handleClick = async () => {
        
        const response = await fetch('http://localhost:5000/predict',{
            method :'POST',
            body: JSON.stringify({prompt: input}),
            headers : {
                'Content-Type':'application/json'
            }
        });
        console.log(response);
        const data = await response.json();
        const dataKeys = Object.values(data);
        console.log(dataKeys);
        
        await setMessageList([input, ...dataKeys])
        setInput('');
    }

    const handleKeyDown = async(event: any) => {
        if (event.key === 'Enter') {
            await handleClick();
            event.target.style.height = `inherit`;
        }

        console.log(event.target.style.height);
        if (parseInt(event.target.style.height) > 150) {
            return;
        }
        event.target.style.height = `${event.target.scrollHeight}px`;
    }

    return (
        <>

            <div className='InputBoxStyle'>
                <div className='InnerInputBox'>

                    <button className='ButtonLeft' onClick={() => window.location.reload()}>
                        <Image 
                            src={'/reload.png'}
                            alt={'Reload'}
                            height={30}
                            width={30}
                            />
                    </button>
                    <textarea value={input} onChange={handleChange} onKeyDown={handleKeyDown}
                        placeholder="Type here to start"
                        rows={1}
                        />
                    <button onClick={handleClick}>
                    <Image 
                            src={'/send.png'}
                            alt={'Reload'}
                            height={30}
                            width={30}
                            />
                    </button>
                    
                </div>
            </div>
        </>
    )
}