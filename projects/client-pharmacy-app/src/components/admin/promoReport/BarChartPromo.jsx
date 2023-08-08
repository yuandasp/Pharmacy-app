import React from 'react'
import { Bar } from 'react-chartjs-2'
import{Chart as ChartJS} from 'chart.js/auto'

function BarChartPromo({promosData}) {
    return (
      <Bar data={promosData}/>
  )
}

export default BarChartPromo