/***
 * Chart component that can be reused provided by Apexcharts
 * Component has dynamic data loading and provides options for
 * dataset used for the chart, height, width, title and color
 * palette. Chart object exported ready to use.
 */

import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function({ data, h, w, title, palette}) {
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
            "height": 230,
            "id": "puRXz",
            "toolbar": {
                "show": false
            },
            "type": "bar",
            "width": 400,
            "zoom": {
                "enabled": false
            },
            "fontUrl": null
        },
        "plotOptions": {
            "bar": {
                "horizontal": true,
                "barHeight": "50%",
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
            "offsetX": -2,
            "offsetY": -3,
            "style": {
                "fontWeight": 700,
                "colors": [
                    "#fff"
                ]
            },
            "background": {
                "enabled": false
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
            "markers": {
                "shape": "square",
                "size": 8
            },
            "itemMargin": {
                "vertical": 0
            }
        },
        "series": [
            {
                "name": title,
                "data": data
            }
        ],
        "tooltip": {
            "shared": false,
            "intersect": true
        },
        "xaxis": {
            "labels": {
                "trim": true,
                "style": {},
                formatter: function(val) {
                    return val.toFixed(0)
                }
            },
            "tickPlacement": "between",
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
                "style": {},
            },
            "title": {
                "style": {
                    "fontWeight": 700
                }
            }
        },
        "theme": {
            "palette": palette === 1 ? "palette1" : "palette2"
        }
    }

    return(
        <Chart options={chartConfig} series={chartConfig.series} height={h} width={w} type={'bar'}/>
    )
}