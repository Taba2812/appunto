import { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'Appunto',
    description: 'Should there be one?',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className='notebook-cover'>{children}</body>
        </html>
    )
}