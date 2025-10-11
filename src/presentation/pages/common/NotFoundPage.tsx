export default function NotFoundPage() {
  return (
    <main className="min-h-screen grid place-items-center">
      <section className="px-6 py-16 text-center">
        {/* Top caption */}
        <p className="text-muted-foreground text-xs md:text-sm uppercase tracking-[0.2em]">Oops! Page not found</p>

        {/* Big 404 */}
        <h1
          aria-label="404 — Page not found"
          className="mt-3 font-black leading-none tracking-tight text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-foreground"
        >
          404
          <span className="sr-only">Error</span>
        </h1>

        {/* Bottom caption */}
        <p className="mt-3 text-muted-foreground text-xs md:text-sm uppercase tracking-wide text-pretty">
          We are sorry but the page you requested was not found
        </p>
      </section>
    </main>
  )
}
