import { NavLink, useFetcher } from '@remix-run/react'
import React, { useEffect } from 'react'
import { QueriedPost } from '~/utils/types.server'

type SideBarStatsProps = {
  totalPosts: number
  mostPopularPost: QueriedPost
}
export default function SideBarStats({ totalPosts, mostPopularPost }: SideBarStatsProps) {
  const hottest = useFetcher();

  useEffect(() => {
    if (hottest.type === "init") {
      hottest.load("/?index");
    }
  }, [hottest]);



  return (
    <div>
      <label className="text-xl font-bold text-gray-700 underline dark:text-white">
        Site Stats
      </label>

      <div className="flex flex-col">
        <div>
          <label className="text-base">Total posts:</label>
          <p> {totalPosts}</p>
        </div>

        <button className="hover:cursor-pointer">
          <NavLink to={`/posts/${mostPopularPost.id}`}>
            <label className="text-base">Hottest Post</label>

          </NavLink>
        </button>
        <div className="flex md:order-2"></div>
      </div>
    </div>
  )
}
