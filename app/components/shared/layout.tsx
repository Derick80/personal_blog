import React from 'react'
import { getCategoryCounts } from '~/utils/categories.server'
import CategoryCount from '../category-count'
import Footer from '../footer'
import NavigationBar from '../navbar/primary-nav'
import SidebarContainer from '../navbar/sidebar-container'
import Sidebar from '../navbar/sidebar-stats'

export type LayoutProps = {
  data: {
    isLoggedIn: boolean
    firstName: string
    userRole: string
    catCount: Awaited<ReturnType<typeof getCategoryCounts>>
    userId: string
    totalPosts: number
    mostPopularPost: {
      title: string
      id: string
    }

  }


  children: React.ReactNode
}

// removed this from the div grid-rows-[(1fr, 200px, 1fr, 1fr)] grid-cols-[(1fr, 2fr, 2fr, 1fr)] grid gap-4
export default function Layout({ data, children }: LayoutProps) {
  return (
    <div className="col-start-1 col-span-full md:col-start-1 md:col-end-6 row-start-1 m-0 grid gap-4 p-2 md:p-6">
      <div className='col-start-1 col-span-6 row-start-1 row-end-1'>


    <NavigationBar data={data} />

      </div>
<div className='col-start-1 col-span-full md:row-start-2 md:col-end-1 row-start-7'>
<SidebarContainer
        isLoggedIn={data.isLoggedIn}
        userRole={data.userRole}
        firstName={data.firstName}
        userId={data.userId}
        totalPosts={data.totalPosts}
        mostPopularPost={data.mostPopularPost}
      />

</div>



      <div className='col-start-1 col-span-full md:col-start-2 md:col-end-6 row-start-2'>

      <div className="flex flex-wrap justify-center text-sm md:text-base pb-2 md:pb-4">
        {data?.catCount?.map((category) => (
          <CategoryCount key={category.id} category={category} />
        ))}
      </div>

        {children}</div>
      <Footer />
    </div>
  )
}
