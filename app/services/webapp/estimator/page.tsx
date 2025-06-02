'use client'

import { useState } from 'react'

interface Estimate {
  min: number
  max: number
  monthly: number
}

const tiers = {
  starter: {
    label: 'Starter',
    min: 750,
    max: 1500,
    description:
      'Ideal for landing pages, calculators, interactive demos, or user interfaces that do not require login or saved data.',
  },
  growth: {
    label: 'Growth',
    min: 2500,
    max: 5000,
    description:
      'Ideal for platforms requiring user authentication, saved content, dashboards, or business logic.',
  },
  scale: {
    label: 'Scale',
    min: 5000,
    max: 10000,
    description:
      'Ideal for intelligent applications requiring automation, third-party integrations, or advanced data capabilities.',
  },
} as const

type Tier = keyof typeof tiers

const complexities = {
  basic: { label: 'Basic', factor: 1 },
  moderate: { label: 'Moderate', factor: 1.2 },
  advanced: { label: 'Advanced', factor: 1.4 },
} as const

type Complexity = keyof typeof complexities

const maintenancePlans = {
  none: { label: 'No', monthly: 0 },
  basic: { label: 'Basic', monthly: 100 },
  full: { label: 'Full Support', monthly: 300 },
} as const

type Maintenance = keyof typeof maintenancePlans

const featureList = [
  {
    id: 'auth',
    label: 'User Login',
    cost: 300,
    description: 'User authentication and access control',
  },
  {
    id: 'admin',
    label: 'Admin Panel',
    cost: 400,
    description: 'Admin panel or content management tools',
  },
  {
    id: 'payment',
    label: 'Stripe or Payment System',
    cost: 500,
    description: 'Integration with payment providers like Stripe',
  },
  {
    id: 'ai',
    label: 'AI Chat or Analysis',
    cost: 800,
    description: 'AI capabilities such as chat assistants or analysis',
  },
  {
    id: 'api',
    label: 'Integrate with another platform',
    cost: 600,
    description: 'Connect your app to an external service or API',
  },
  {
    id: 'notifications',
    label: 'Email or Push Notifications',
    cost: 300,
    description: 'Background processing and notifications',
  },
] as const

type FeatureId = (typeof featureList)[number]['id']

const EstimatorPage = () => {
  const [tier, setTier] = useState<Tier>('starter')
  const [complexity, setComplexity] = useState<Complexity>('basic')
  const [maintenance, setMaintenance] = useState<Maintenance>('none')
  const [features, setFeatures] = useState<Record<FeatureId, boolean>>({
    auth: false,
    admin: false,
    payment: false,
    ai: false,
    api: false,
    notifications: false,
  })
  const [estimate, setEstimate] = useState<Estimate | null>(null)

  const toggleFeature = (id: FeatureId) => {
    setFeatures((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const calculate = () => {
    const base = tiers[tier]
    const factor = complexities[complexity].factor
    let min = Math.round(base.min * factor)
    let max = Math.round(base.max * factor)

    const featureCost = featureList.reduce(
      (sum, f) => (features[f.id] ? sum + f.cost : sum),
      0
    )

    min += featureCost
    max += featureCost

    const monthly = maintenancePlans[maintenance].monthly

    setEstimate({ min, max, monthly })
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-primary">
        Web App Cost Estimator
      </h1>

      {/* Tier Selection */}
      <fieldset className="space-y-2">
        <legend className="font-medium">What type of app do you need?</legend>
        {Object.entries(tiers).map(([key, val]) => (
          <label key={key} className="flex items-start gap-2">
            <input
              type="radio"
              name="tier"
              value={key}
              checked={tier === key}
              onChange={() => setTier(key as Tier)}
              className="accent-accent mt-1"
            />
            <span>
              <span className="font-medium">{val.label}</span>
              <span className="block text-sm text-muted-foreground">{val.description}</span>
            </span>
          </label>
        ))}
      </fieldset>

      {/* Complexity */}
      <fieldset className="space-y-2">
        <legend className="font-medium">How complex is your project?</legend>
        {Object.entries(complexities).map(([key, val]) => (
          <label key={key} className="flex items-center gap-2">
            <input
              type="radio"
              name="complexity"
              value={key}
              checked={complexity === key}
              onChange={() => setComplexity(key as Complexity)}
              className="accent-accent"
            />
            {val.label}
          </label>
        ))}
      </fieldset>

      {/* Maintenance */}
      <fieldset className="space-y-2">
        <legend className="font-medium">Do you want ongoing maintenance?</legend>
        {Object.entries(maintenancePlans).map(([key, val]) => (
          <label key={key} className="flex items-center gap-2">
            <input
              type="radio"
              name="maintenance"
              value={key}
              checked={maintenance === key}
              onChange={() => setMaintenance(key as Maintenance)}
              className="accent-accent"
            />
            {val.label}
            {val.monthly > 0 && ` ($${val.monthly}/month)`}
          </label>
        ))}
      </fieldset>

      {/* Features */}
      <fieldset className="space-y-2">
        <legend className="font-medium">Which features do you need?</legend>
        {featureList.map((feat) => (
          <label key={feat.id} className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={features[feat.id]}
              onChange={() => toggleFeature(feat.id)}
              className="accent-accent mt-1"
            />
            <span>
              <span className="font-medium">
                {feat.label} (+${feat.cost})
              </span>
              <span className="block text-sm text-muted-foreground">
                {feat.description}
              </span>
            </span>
          </label>
        ))}
      </fieldset>

      <button
        className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
        onClick={calculate}
      >
        Calculate Estimate
      </button>

      {estimate && (
        <div className="bg-muted p-4 rounded space-y-2">
          <p>
            Estimated initial cost:{' '}
            <span className="font-semibold">
              ${estimate.min.toLocaleString()} – ${estimate.max.toLocaleString()}
            </span>
          </p>
          {estimate.monthly > 0 && (
            <p>
              Maintenance:{' '}
              <span className="font-semibold">
                ${estimate.monthly.toLocaleString()}/month
              </span>
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default EstimatorPage
