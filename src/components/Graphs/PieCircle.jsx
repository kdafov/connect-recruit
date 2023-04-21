/***
 * Chart component that can be reused provided by Apexcharts
 * Component has dynamic data loading and provides options for
 * dataset used for the chart, height, width, and title. Chart 
 * object exported ready to use.
 */

import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function({ labels, series, h, w }) {
    const chartConfig = {
        "chart": {
            "animations": {
                "enabled": true
            },
            "dropShadow": {
                "enabled": true,
                "blur": 3
            },
            "foreColor": "#333",
            "fontFamily": "Montserrat",
            "height": 184,
            "id": "fmYHI",
            "toolbar": {
                "show": false
            },
            "type": "donut",
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
            "type": "gradient",
            "opacity": 1,
            "gradient": {}
        },
        "grid": {
            "padding": {
                "right": 25,
                "left": 20
            }
        },
        "labels": labels,
        "legend": {
            "position": "right",
            "fontSize": 14,
            "offsetY": 0,
            "itemMargin": {
                "vertical": 0
            }
        },
        "series": series,
        "tooltip": {
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
        },
        "theme": {
            "palette": "palette2"
        }
    }

    return(
        <Chart options={chartConfig} series={chartConfig.series} height={h} width={w} type={'pie'} />
    )
}