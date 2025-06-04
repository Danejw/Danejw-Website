import type { Metadata } from 'next'
import EstimatorClient from './EstimatorClient'

export const metadata: Metadata = {
  title: 'Web App Cost Estimator - Dane Willacker',
  description: 'Interactive tool for estimating web application development costs.',
}

export default function EstimatorPage() {
  return <EstimatorClient />
}
