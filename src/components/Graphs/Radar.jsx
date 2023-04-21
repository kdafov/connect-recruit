/***
 * Chart component that can be reused provided by Apexcharts
 * Component has dynamic data loading and provides options for
 * dataset used for the chart, height, width, title and color
 * palette. Chart object exported ready to use.
 */

import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function({ title, data, h, w, mode }) {
    const chartConfig = {
        "chart": {
            "animations": {
                "enabled": false
            },
            "dropShadow": {
                "enabled": true,
                "blur": 3
            },
            "foreColor": "#333",
            "fontFamily": "Montserrat",
            "height": 250,
            "id": "B7kYm",
            "toolbar": {
                "show": false
            },
            "type": "radar",
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
                "fontSize": 10,
                "fontWeight": 100
            }
        },
        "fill": {},
        "grid": {
            "show": false,
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
                "size": 0
            }
        },
        "series": [
            {
                "name": title,
                "data": [
                    {
                        "x": "Applications",
                        "y": data[0]
                    },
                    {
                        "x": "Views",
                        "y": data[1]
                    },
                    {
                        "x": mode === 'u' ? "Accepted" : "Days active",
                        "y": data[2]
                    },
                    {
                        "x": "Messages",
                        "y": data[3]
                    }
                ]
            }
        ],
        "tooltip": {
            "shared": false,
            "followCursor": true,
            "intersect": true
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
            },
            "tooltip": {
                "enabled": false
            }
        },
        "yaxis": {
            "tickAmount": 5,
            "labels": {
                "offsetY": 6,
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
            "palette": "palette2"
        }
    }

    return (
        <Chart options={chartConfig} series={chartConfig.series} height={h} width={w} type={'radar'} />
    )
}