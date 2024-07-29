import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Offline',
  description: 'You are currently offline',
}

export default function Offline() {
  return <div>You are offline. Please check your internet connection.</div>
}