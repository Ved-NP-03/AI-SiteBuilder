import { Loader2Icon } from 'lucide-react'
import { useEffect } from 'react'

const Loading = () => {


    useEffect(() => {
        setTimeout(() => {
            window.location.href = '/'
        }, 6000)
    }, [])

    return (
        <div className='h-screen flex flex-col'>
            <div className='flex items-center justify-center flex-1 gap-3'>
                <Loader2Icon className='size-7 animate-spin text-indigo-300' />
                <p className='text-lg'>Please wait... Credits are being added to your account!</p>
            </div>
        </div>
    )
}

export default Loading