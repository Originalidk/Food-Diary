import { useEffect, useState } from 'react'
import axios from 'axios'
import { Image } from 'cloudinary-react'
import { ReactComponent as Loading } from '../images/loading.svg'

function Home() {
    const [imageSelected, setImageSelected] = useState("")
    const [listOfPhotos, setListOfPhotos] = useState([])
    const [posted, setPosted] = useState({})
    const [disabled, setDisabled] = useState(false)

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_SERVER_URL}/photos`).then((response) => {
          setListOfPhotos(response.data)
        })
    }, [posted])

    const uploadImage = () => {
        if (imageSelected === "" || !imageSelected) {
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
    }
    
    return (
      <div className='bg-stone-100'>
        <div className='flex flex-row items-center w-full bg-red-100 py-3'>
          <div className='text-black pl-5 text-2xl font-semibold items-center'> Food Diary </div>
          <div className='flex flex-row items-center justify-end w-5/6 pr-5'>
            <input type="file" onChange={(event) => {
              setImageSelected(event.target.files[0])
            }} />
            <button className='flex flex-row items-center justify-center bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded' disabled={disabled} onClick={uploadImage}>
                {disabled
                    ? <Loading />
                    : <h6>Upload</h6>}
            </button>
          </div>
        </div>
        <div className='flex flex-col items-center'>
            <h1 className='text-6xl py-5'> Entries: </h1>
          {listOfPhotos.map((value, key) => {
            return (
                <div className='my-5 px-10'>
                    <Image
                      key={key}
                      className="w-[800px] mb-5"
                      cloudName="originalidk"
                      publicId={value.url} />
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
