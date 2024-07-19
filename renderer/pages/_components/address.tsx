'use client'
import Link from 'next/link'
import React, { MouseEventHandler, useEffect, useState } from 'react'

type Props = {}

const Address = (props: Props) => {

  const [address, setAddress] = useState('')

  useEffect(() => {
    
    const listener = window.ipc.on('send-address', (address: string) => {
      console.log({address})
      setAddress(address || '');
    })
  
    return () => listener();
  }, [])

  
  const handlerClick = (ev) => {
    ev.preventDefault();
    window.ipc.send('open-external','');
  }

  return (
    <div className="mt-1 w-full flex-wrap flex justify-center">
    {
      address ? <p>{address}</p>
      : <Link href="http://localhost:3000/wallet-connect" onClick={handlerClick}>Connect</Link>
    }
  </div>
  )
}

export default Address