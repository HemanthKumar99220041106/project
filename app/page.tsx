import Link from 'next/link';



export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">
        Welcome to Next.js
      </h1>
      <p className="text-xl text-gray-600">
        Get started by editing app/page.tsx
      </p>
      <Link href="/code" style={{color:"blue"}} >
        Go to Code Page
      </Link>
    </main>
  );
}