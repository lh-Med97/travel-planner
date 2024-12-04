import './globals.css'
import Provider from '../providers/SessionProvider'

export const metadata = {
  title: 'Travel Planner',
  description: 'Plan your next trip with AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  )
}
