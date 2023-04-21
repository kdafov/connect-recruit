/***
 * Chart component that can be reused provided by Apexcharts
 * Component has dynamic data loading and provides options for
 * dataset used for the chart, height, and width. Chart object 
 * exported ready to use.
 */

import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function({names, rates, w, h}) {
    const chartConfig = {
        "chart": {
            "animations": {
                "enabled": true,
                "dynamicAnimation": {
                    "speed": 1200
                }
            },
            "dropShadow": {
                "enabled": true,
                "blur": 2
            },
            "foreColor": "#333",
            "fontFamily": "Montserrat",
            "height": 250,
            "id": "2ypyw",
            "toolbar": {
                "show": false
            },
            "type": "radialBar",
            "width": 300,
            "fontUrl": null
        },
        "plotOptions": {
            "bar": {
                "borderRadius": 10
            },
            "radialBar": {
                "hollow": {
                    "background": "#fff"
                },
                "dataLabels": {
                    "name": {},
                    "value": {},
                    "total": {}
                }
            },
            "pie": {
                "donut": {
                    "labels": {
                        "name": {},
                        "value": {},
                        "total": {}
                    }
                }
            }
        },
        "dataLabels": {
            "style": {
                "fontWeight": 700
            }
        },
        "fill": {
            "type": "gradient"
        },
        "grid": {
            "padding": {
                "right": 25,
                "left": 30
            }
        },
        "labels": names,
        "legend": {
            "position": "top",
            "fontSize": 14,
            "offsetY": 0,
            "itemMargin": {
                "vertical": 0
            }
        },
        "series": rates,
        "tooltip": {
            "enabled": false,
            "fillSeriesColor": true
        },
        "xaxis": {
            "labels": {
                "trim": true,
                "style": {}
            },
            "title": {
                "style": {
                    "fontWeight": 700
                }
            }
        },
        "yaxis": {
            "labels": {
                "style": {}
            },
            "title": {
                "style": {
                    "fontWeight": 700
                }
            }
        }
    }

    return(
        <Chart options={chartConfig} series={chartConfig.series} height={h} width={w} type={'radialBar'} />
    )
}