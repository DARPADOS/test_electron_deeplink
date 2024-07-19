'use client'
import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import dynamic from 'next/dynamic'

const Address = dynamic(
  () => import('./_components/address'),
  { ssr: false })

export default function HomePage() {

  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (with-tailwindcss)</title>
      </Head>
      <div className="grid grid-col-1 text-2xl w-full text-center">
        <div>
          <Image
            className="ml-auto mr-auto"
            src="/images/logo.png"
            alt="Logo image"
            width={256}
            height={256}
          />
        </div>
      </div>
      <Address/>
    </React.Fragment>
  )
}
