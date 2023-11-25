import React from 'react'

const Results = ({data, isLoading}) => {
  return (
      <div>
        {data}
        {isLoading}
    </div>
  )
}

export default Results