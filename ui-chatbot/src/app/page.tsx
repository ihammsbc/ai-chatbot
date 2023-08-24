'use client';

import {useState} from 'react';
import styles from './page.module.css'
import InputBox from '@/components/InputBox/page'
import MessageList from '@/components/MessageList/page'
import '../components/MessageList/MessageList.scss';


export default function Home() {
  const [messageList, setMessageList] = useState(['Hello! Welcome to the SBC Chatbot']);

  function handleSend(input:any) {
    setMessageList([...messageList, ...input]);
    console.log(messageList);
  }
  
  return (
    <main className={styles.main}>

      <div className={styles.MessageList}>
        <MessageList messageList={messageList} />
      </div>

      <div className={styles.InputBoxStyle}>
        <InputBox setMessageList={event => handleSend(event)}/>
      </div>

    </main>
  )
}
