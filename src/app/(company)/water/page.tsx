'use client'

import React from 'react'
import { Droplets } from 'lucide-react'

export default function WaterCreditsPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div
          className="mx-auto mb-6 w-20 h-20 rounded-full
          bg-blue-50 border-2 border-blue-100
          flex items-center justify-center"
        >
          <Droplets className="w-9 h-9 text-blue-400" />
        </div>

        <span
          className="inline-block mb-4 px-3 py-1 text-xs font-semibold
          tracking-widest uppercase rounded-full
          bg-blue-100 text-blue-600 border border-blue-200"
        >
          Coming Soon
        </span>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">Water Credit Module</h1>

        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          Future expansion of the Green Credit Programme to include water conservation and
          air quality improvement initiatives.
        </p>

        <div
          className="rounded-2xl border border-blue-100 bg-blue-50/50
          p-5 text-left space-y-3"
        >
          <p
            className="text-xs font-semibold uppercase tracking-wider
            text-blue-500"
          >
            What to expect
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span
                className="mt-0.5 w-1.5 h-1.5 rounded-full
                bg-blue-400 flex-shrink-0"
              />
              Automated monitoring of water body restoration
            </li>
            <li className="flex items-start gap-2">
              <span
                className="mt-0.5 w-1.5 h-1.5 rounded-full
                bg-blue-400 flex-shrink-0"
              />
              AI-based water quality and recharge assessment
            </li>
            <li className="flex items-start gap-2">
              <span
                className="mt-0.5 w-1.5 h-1.5 rounded-full
                bg-blue-400 flex-shrink-0"
              />
              Credit issuance for watershed and wetland projects
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
