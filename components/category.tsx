import { Newspaper, MessageCircleQuestion, Rocket } from 'lucide-react'

const icons: {
  [key: string]: React.ComponentType<React.SVGProps<SVGSVGElement>>
} = {
  general: Newspaper,
  ask: MessageCircleQuestion,
  show: Rocket,
}

const iconSizeClasses: { [key: string]: string } = {
  '3': 'h-3 w-3',
  '3.5': 'h-3.5 w-3.5',
  '4': 'h-4 w-4',
  '5': 'h-5 w-5',
}

export default function Category({
  category,
  iconSize = '4',
}: {
  category: string
  iconSize?: string
}) {
  const IconComponent = icons[category]
  const iconSizeClass = iconSizeClasses[iconSize]

  return <IconComponent className={iconSizeClass} />
}
