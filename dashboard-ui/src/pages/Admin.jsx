import { useEffect, useState } from 'react'
import RequestUsage from '../components/RequestUsage'
import axiosInstance from '../utils/axiosInstance';
import { BiTransfer } from "react-icons/bi";

const Admin = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await axiosInstance.get("/admin/analytics/usage")
        // const res2 = await axiosInstance.get("/admin/analytics/usage")
        console.log(res.data)
        setUser(res.data)
      } catch (e) {
        console.log(`error in fetching user data ${e}`)
      }
    }
    fetchUserData()
  }, [])
  return (
    <div className=' bg-black flex flex-col h-screen p-8'>
      <h1 className='text-3xl font-bold mb-5 text-green-500'>Admin Dashboard</h1>
      <div className='border-2 grow flex justify-between'>
        <div className='border flex-col w-[50%] m-2 p-1 bg-green-900/15 rounded-lg'>
          <span className='text-green-900 text-2xl font-bold'>
            User request analytics
          </span>

          {user && user.length > 0 ? (
            user.map((user, key) => (
              <RequestUsage
                userInfo={user}
                key={key}
              />
            ))
          ) : (
            <p className="text-gray-500 mt-2">No data</p>
          )}
        </div>
        <div className='border flex grow  m-2'>asdfasdf</div>
      </div>
    </div>
  )
}

export default Admin 