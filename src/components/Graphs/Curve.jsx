/***
 * Chart component that can be reused provided by Apexcharts
 * Component has dynamic data loading and provides options for
 * dataset used for the chart, height, and width. Chart object 
 * exported ready to use.
 */

import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function({data, h, w}) {
    const chartConfig = {
        chart: {
            id: 'spark4',
            group: 'sparks',
            type: 'line',
            height: 80,
            sparkline: {
            enabled: true
            },
            dropShadow: {
            enabled: true,
            top: 1,
            left: 1,
            blur: 2,
            opacity: 0.2,
            }
        },
        series: [{
            data: data
        }],
        stroke: {
            curve: 'smooth'
        },
        markers: {
            size: 0
        },
        grid: {
            padding: {
            top: 20,
            bottom: 10,
            left: 10
            }
        },
        colors: ['#fff'],
        xaxis: {
            crosshairs: {
            width: 1
            },
        },
        tooltip: {
            x: {
            show: false
            },
            y: {
            title: {
                formatter: function formatter(val) {
                return '';
                }
            }
            }
        }
        }

    return(
        <Chart options={chartConfig} series={chartConfig.series} height={h} width={w}/>
    )
}