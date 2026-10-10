import React from 'react'
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader'
import DashboardSideBar from '../../components/Shop/Layout/DashboardSideBar'
import DashboardMessages from "../../components/Shop/DashboardMessages";

const ShopInboxPage = () => {
  return (
    <div>
    <DashboardHeader />
    <div className="flex items-start w-full">
      <div className="w-[80px] shrink-0 800px:w-[330px]">
        <DashboardSideBar active={8} />
      </div>
      <div className="min-w-0 flex-1">
        <DashboardMessages />
      </div>
    </div>
  </div>
  )
}

export default ShopInboxPage