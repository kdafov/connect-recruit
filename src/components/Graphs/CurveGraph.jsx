/***
 * Chart component that can be reused provided by Apexcharts
 * Component has dynamic data loading and provides options for
 * dataset used for the chart, height, width, title and color
 * palette. Chart object exported ready to use.
 */

import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function({data, w, h, title, palette}) {
    const chartConfig = {
        "chart": {
            "animations": {
                "enabled": true,
                "easing": "swing"
            },
            "dropShadow": {
                "enabled": true,
                "blur": 2
            },
            "foreColor": "#333",
            "fontFamily": "Montserrat",
            "height": 250,
            "id": "tTnuK",
            "toolbar": {
                "show": false,
                "tools": {
                    "selection": true,
                    "zoom": true,
                    "zoomin": true,
                    "zoomout": true,
                    "pan": true,
                    "reset": true
                }
            },
            "width": 500
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
            "enabled": false,
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
                "left": 15
            }
        },
        "legend": {
            "showForSingleSeries": true,
            "position": "top",
            "fontSize": 22,
            "offsetY": 0,
            "itemMargin": {
                "vertical": 0
            }
        },
        "markers": {
            "hover": {
                "sizeOffset": 6
            }
        },
        "series": [
            {
                "name": title,
                "data": data
            }
        ],
        "stroke": {
            "curve": "smooth",
            "width": 4
        },
        "tooltip": {},
        "xaxis": {
            "labels": {
                "trim": true,
                "style": {}
            },
            "tickAmount": 2,
            "title": {
                "style": {
                    "fontWeight": 700
                }
            }
        },
        "yaxis": {
            "tickAmount": 5,
            "labels": {
                "style": {},
                formatter: function(val) {
                    return val.toFixed(0)
                }
            },
            "title": {
                "style": {
                    "fontWeight": 700
                }
            }
        },
        "theme": {
            "palette": "palette" + palette
        }
    }

    return(
        <Chart options={chartConfig} series={chartConfig.series} height={h} width={w}/>
    )
}