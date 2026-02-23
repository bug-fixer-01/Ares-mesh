import React from 'react'

const rateLimitInfo = ({ userInfo }) => {
   return (
          <div className='border  bg-green-500/60 my-2 rounded-lg p-1 flex items-center justify-between'>
              
              <div className='flex items-center gap-2'><FaUser /><p>{userInfo?.username}</p></div>
              <span>UserId: {userInfo?.userId}</span>
              <div className='flex items-center gap-2 justify-end '><BiTransfer />Total Request {userInfo?.totalRequests}</div>
          </div>
      )
}

export default rateLimitInfo