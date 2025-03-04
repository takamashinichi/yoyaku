import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="ja">
      <Head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@500;600;700&display=swap" 
          rel="stylesheet" 
        />
        <link 
          href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" 
          rel="stylesheet" 
        />
      </Head>
      <body className="bg-secondary-50">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 