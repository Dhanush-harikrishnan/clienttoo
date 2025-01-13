import { Sidebar } from 'lucide-react'
import React from 'react'

type Props = {
    children: React.ReactNode
    params: { slug: string }
}

const layout = ({children, params}: Props) => {
  
  return  <div className='p-3'>
    {/*sidebar*/}
    <Sidebar/>
  </div>
}

export default layout