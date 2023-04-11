import React from 'react'
import Image from 'next/image'
import { ImageTypeInterface } from '../../../interface/AllFarmsInterface'


function ImageCard(props: ImageTypeInterface) {

  const myLoader = () => {
    return `http://localhost:5000/public/img/${props.type}/${props.image}`
  }

  return (
    <div className='w-full h-full rounded-md'>
      <Image
        alt='#'
        crossOrigin="anonymous"
        src={`http://localhost:5000/public/img/${props.type}/${props.image}`}
        loader={myLoader}
        width={200}
        height={200}
        className='w-full h-full rounded-md'
      />
    </div>
  )
}

export default ImageCard