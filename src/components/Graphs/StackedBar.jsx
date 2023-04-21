/***
 * Chart component that can be reused provided by Apexcharts
 * Component has dynamic data loading and provides options for
 * dataset used for the chart, height, width, title and color
 * palette. Chart object exported ready to use.
 */

import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function({ data_x, data_y, h, w, label_x, label_y }) {
    const chartConfig = {
        "chart": {
            "animations": {
                "enabled": false,
                "easing": "swing"
            },
            "dropShadow": {
                "enabled": true,
                "blur": 2
            },
            "foreColor": "#333",
            "fontFamily": "Montserrat",
            "height": 250,
            "id": "dCzQS",
            "stacked": true,
            "stackType": "100%",
            "toolbar": {
                "show": false
            },
            "type": "bar",
            "width": 400,
            "fontUrl": null
        },
        "plotOptions": {
            "bar": {
                "columnWidth": "50%",
                "borderRadius": 10,
                "dataLabels": {
                    "position": "center"
                }
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
            "type": "gradient",
            "gradient": {
                "type": "diagonal"
            }
        },
        "grid": {
            "padding": {
                "right": 25,
                "left": 15
            }
        },
        "legend": {
            "position": "top",
            "fontSize": 20,
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
                "name": label_x,
                "data": data_x
            },
            {
                "name": label_y,
                "data": data_y
            }
        ],
        "tooltip": {
            "shared": false,
            "intersect": true
        },
        "xaxis": {
            "labels": {
                "trim": true,
                "style": {}
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
            "max": 100,
            "min": 0,
            "labels": {
                "style": {
                    "colors": [
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null
                    ]
                }
            }
        },
        "theme": {
            "palette": "palette2"
        }
    }

    return(
        <Chart options={chartConfig} series={chartConfig.series} height={h} width={w} type={'bar'} />
    )
}