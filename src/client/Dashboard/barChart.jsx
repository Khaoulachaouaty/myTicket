import React from 'react';
import { ResponsiveBar } from '@nivo/bar';

const BarChart = () => {
    const data = [
        {
            "id": "Ticket 1",
            "value": 60,
        },
        {
            "id": "Ticket 2",
            "value": 80,
        },
        {
            "id": "Ticket 3",
            "value": 40,
        },
        {
            "id": "Ticket 4",
            "value": 70,
        },
        {
            "id": "Ticket 5",
            "value": 50,
        }
    ];

    return (
        <div style={{ height: 380 , width:570}}>
            <ResponsiveBar
                data={data}
                keys={['value']}
                indexBy="id"
                margin={{  right: 130, bottom: 50, left: 60 }}
                padding={0.3}
                layout="horizontal"
                colors={{ scheme: 'nivo' }} // Correct the colors property
                borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Bar',
                    legendPosition: 'middle',
                    legendOffset: 32
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: '',
                    legendPosition: 'middle',
                    legendOffset: -40
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                legends={[
                    {
                        dataFrom: 'keys',
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 120,
                        translateY: 0,
                        itemsSpacing: 2,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemDirection: 'left-to-right',
                        itemOpacity: 0.85,
                        symbolSize: 20,
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemOpacity: 1
                                }
                            }
                        ]
                    }
                ]}
                role="application"
                ariaLabel="Nivo bar chart demo"
                barAriaLabel={e => `${e.id}: ${e.value}`}
            />
        </div>
    );
}

export default BarChart;
