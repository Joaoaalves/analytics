"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { type IChartData } from "@/types/chart"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {  
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useMemo, useState } from "react"


const chartConfig = {
  views: {
    label: "Page Views",
  },
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--secondary)",
  },
} satisfies ChartConfig


interface ChartProps {
  chartData: IChartData[],
  onTimeRangeChange: (range: string) => void
}

export default function DefaultChart({chartData, onTimeRangeChange}:ChartProps) {
  const [activeChart, setActiveChart] =
    useState<keyof typeof chartConfig>("desktop")
    const [timeRange, setTimeRange] = useState("last3Months")

    const total = useMemo(
      () => ({
        desktop: chartData.reduce((acc, curr) => acc + curr.desktop, 0),
        mobile: chartData.reduce((acc, curr) => acc + curr.mobile, 0),
      }),
      [chartData]
    )
  
    const handleTimeRangeChange = (value: string) => {
      setTimeRange(value)
      onTimeRangeChange(value)
    }
  return (
    <Card className="border-none bg-primary">
      <CardHeader className="flex items-center p-0 md:flex-row bg-primary rounded-lg text-white">
      <div className="flex flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Page View</CardTitle>
          <CardDescription>
            Showing total <b className="text-white underline">pageview</b> events for the {timeRange == 'last3Months' ? 'last 3 months' : timeRange == 'thisMonth' ? 'this month' : 'this week'}
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-80 md:w-48 lg:w-80 font-medium mx-auto bg-transparent">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent className="bg-primary text-white">
              <SelectItem className="cursor-pointer" value="last3Months">Last 3 Months</SelectItem>
              <SelectItem className="cursor-pointer" value="thisMonth">This Month</SelectItem>
              <SelectItem className="cursor-pointer" value="thisWeek">This Week</SelectItem>
            </SelectContent>
          </Select>
        <div className="flex w-full md:w-auto md:ms-auto">
          {["desktop", "mobile"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-black/70 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6 bg-primary rounded-lg">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={true}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("pt-BR", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("pt-BR", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
