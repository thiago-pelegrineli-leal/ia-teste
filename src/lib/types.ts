export interface Bot {
  id: string
  name: string
  description: string
  status: 'online' | 'manutencao' | 'offline'
  inviteUrl: string
  imageUrl: string
  tags: string[]
  createdAt: number
}

export interface Plan {
  id: string
  name: string
  price: string
  period: string
  description: string
  features: string[]
  highlighted: boolean
  order: number
}

export interface SiteSettings {
  termsOfService: string
  privacyPolicy: string
  discordInviteUrl: string
  contactEmail: string
  adminEmails: string[]
  heroSubtitle: string
}

export const defaultSettings: SiteSettings = {
  termsOfService: '',
  privacyPolicy: '',
  discordInviteUrl: '',
  contactEmail: '',
  adminEmails: [],
  heroSubtitle:
    'Bots de Discord sob medida para a sua comunidade. Automação, moderação e experiências únicas com a qualidade !P | PRODUCTIONS.',
}
