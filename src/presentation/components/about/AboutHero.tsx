export default function AboutHero() {
  return (
    <section className="relative min-h-[600px] bg-gradient-to-br from-primary/10 via-background to-background flex items-center">
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight text-balance">
              Discover Adventures Near You
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We believe travel should be accessible, authentic, and unforgettable. Our mission is to connect travelers
              with incredible local tour experiences in their own backyard.
            </p>
            <div className="flex gap-4 pt-4">
              <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                Explore Tours
              </button>
              <button className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors">
                Learn More
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-3xl"></div>
            <img
              src="assets/about/DJI_20250411212235_0002_D.jpg"
              alt="Adventure travelers exploring nature"
              className="relative rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
