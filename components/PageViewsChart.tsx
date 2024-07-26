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
  chartData: IChartData[]
}

export default function PageViewsChart({ chartData }: ChartProps) {
  const [activeChart, setActiveChart] =
    useState<keyof typeof chartConfig>("desktop")

  const total = useMemo(
    () => ({
      desktop: chartData.reduce((acc, curr) => acc + curr.desktop, 0),
      mobile: chartData.reduce((acc, curr) => acc + curr.mobile, 0),
    }),
    [chartData]
  )

  return (
    <Card className="border-none bg-primary">
      <CardHeader className="flex items-center p-0 md:flex-row bg-primary text-white rounded-lg">
        <div className="flex flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Page View</CardTitle>
          <CardDescription>
            Showing total <b className="text-white underline">pageview</b> events for this week
          </CardDescription>
        </div>
        <div className="flex w-full md:w-auto md:ms-auto">
          {["desktop", "mobile"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left even:border-l data-[active=true]:bg-black/70 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
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
      <CardContent className="px-2 sm:p-6 bg-primary rounded-lg max-h-60">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[210px] w-full"
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
