import { useState } from 'react'
import {FaRegEye,FaRegEyeSlash} from 'react-icons/fa6'

const Input = ({value , onChange, placeholder ,label , type}) => {
        const[showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = ()=>{
        setShowPassword(!showPassword);
    }

  return (
    <div>
        <label className='text-[14px] font-medium text-green-500' >{label}</label>
        <div className='flex items-center relative mt-1'>
            <input
            type={type == 'password' ? showPassword ? 'text' : 'password' : type}
            placeholder={placeholder}
            className='w-full bg-black text-green-500 border border-green-900 px-2 py-1 font-millennium outline-none'
            value={value}
            onChange = {(e) =>onChange(e)}
            />

            {type === 'password' && (
                <>
                    {showPassword ? (
                        <FaRegEye
                         size = {22}
                         className = "text-green-500 cursor-pointer absolute right-2"
                         onClick={() => toggleShowPassword()}
                         />
                    ):(
                        <FaRegEyeSlash
                        size = {22}
                        className="text-green-500 cursor-pointer absolute right-2"
                        onClick={()=> toggleShowPassword()}
                        /> 
                    )}
                </>
            )}
        </div>
    </div>
  )
}

export default Input

