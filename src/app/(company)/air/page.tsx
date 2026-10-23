'use client'

import React from 'react'
import { Wind } from 'lucide-react'

export default function AirCreditsPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div
          className="mx-auto mb-6 w-20 h-20 rounded-full
          bg-purple-50 border-2 border-purple-100
          flex items-center justify-center"
        >
          <Wind className="w-9 h-9 text-purple-400" />
        </div>

        <span
          className="inline-block mb-4 px-3 py-1 text-xs font-semibold
          tracking-widest uppercase rounded-full
          bg-purple-100 text-purple-600 border border-purple-200"
        >
          Coming Soon
        </span>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">Air Credit Module</h1>

        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          Future expansion of the Green Credit Programme to include water conservation and
          air quality improvement initiatives.
        </p>

        <div
          className="rounded-2xl border border-purple-100 bg-purple-50/50
          p-5 text-left space-y-3"
        >
          <p
            className="text-xs font-semibold uppercase tracking-wider
            text-purple-500"
          >
            What to expect
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span
                className="mt-0.5 w-1.5 h-1.5 rounded-full
                bg-purple-400 flex-shrink-0"
              />
              Automated tracking of urban tree cover and AQI zones
            </li>
            <li className="flex items-start gap-2">
              <span
                className="mt-0.5 w-1.5 h-1.5 rounded-full
                bg-purple-400 flex-shrink-0"
              />
              Satellite-based particulate matter and emission monitoring
            </li>
            <li className="flex items-start gap-2">
              <span
                className="mt-0.5 w-1.5 h-1.5 rounded-full
                bg-purple-400 flex-shrink-0"
              />
              Credits for air quality improvement and pollution offset projects
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
