import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { AdvancedImage } from '@cloudinary/react'
import { Cloudinary } from '@cloudinary/url-gen'
import { scale } from '@cloudinary/url-gen/actions/resize';

const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.REACT_APP_CLOUD_NAME,
  },
});

interface Photo {
    id: number;
    url: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

function Home() {
    const [imageSelected, setImageSelected] = useState<File | null>(null)
    const [listOfPhotos, setListOfPhotos] = useState<Array<Photo>>([])
    const [posted, setPosted] = useState({})
    const [disabled, setDisabled] = useState(false)

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_SERVER_URL}/photos`).then((response) => {
          setListOfPhotos(response.data)
        })
    }, [posted])

    const changeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0]
            setImageSelected(file)
        } else {
            alert("File not selected")
        }
    }

    const uploadImage = () => {
      try {
          if (!imageSelected) {
              alert("File not selected")
          } else {
              setDisabled(true)
              const formData = new FormData()
              formData.append("file", imageSelected)
              formData.append("upload_preset", "l8sioozh")
              axios.post(`${process.env.REACT_APP_CLOUDINARY_URL}/image/upload`, formData).then(async (response) => {
                const url = response.data.url
                const photo = { description: "", url: url }
                await axios.post(`${process.env.REACT_APP_SERVER_URL}/photos`, photo)
                setPosted(photo)
                setDisabled(false)
              })
          }
      } catch (error) {
          alert("Error occured")
      }
    }
    
    return (
      <div className='bg-stone-100'>
        <div className='flex flex-row items-center w-full bg-red-100 py-3'>
          <div className='text-black pl-5 text-2xl font-semibold items-center'> Food Diary </div>
          <div className='flex flex-row items-center justify-end w-5/6 pr-5'>
            <input type="file" onChange={changeFile} />
            <button className='flex flex-row items-center justify-center bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded' disabled={disabled} onClick={uploadImage}>
                {disabled
                  ? <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                  : <h6>Upload</h6>}
            </button>
          </div>
        </div>
        <div className='flex flex-col items-center'>
            <h1 className='text-6xl py-5'> Entries: </h1>
          {listOfPhotos.map((value, key) => {
            const image = cld.image(value.url.split('/').pop());
            image.resize(scale().width(800));
            return (
                <div key={key} className='my-5 px-10'>
                  <AdvancedImage cldImg={image} className="mb-5" />
                  <p className='mb-2'> {new Date(value.createdAt).toDateString()} </p>
                  <p className='w-[800px]'> Description: {value.description} </p>
                </div>
            )
          })}
        </div>
      </div>
    )
}

export default Home
