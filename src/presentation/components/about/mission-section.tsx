export default function MissionSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">Our Mission</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            To empower local tour guides and create unforgettable travel experiences by making it easy for explorers to
            discover authentic activities in their area. We're building a community where wanderlust meets local
            expertise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "🌍",
              title: "Local First",
              description: "We prioritize authentic local experiences curated by people who know their cities best.",
            },
            {
              icon: "🤝",
              title: "Community Driven",
              description: "Supporting local tour guides and small businesses is at the heart of what we do.",
            },
            {
              icon: "✨",
              title: "Unforgettable Moments",
              description: "Every tour is designed to create memories that last a lifetime.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all"
            >
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
