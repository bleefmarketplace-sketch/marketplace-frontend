import BuyerOrdersPage from '@/components/BuyerComponents/Orders'
import React, { Suspense } from 'react'

const Page = () => {
  return (
    <Suspense>
      <BuyerOrdersPage/>
    </Suspense>
  )
}

export default Page