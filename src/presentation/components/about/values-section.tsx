export default function ValuesSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-foreground mb-16 text-center text-balance">Our Core Values</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {[
            {
              title: "Transparency",
              description:
                "We believe in honest pricing and clear communication. No hidden fees, just great experiences.",
            },
            {
              title: "Safety First",
              description: "Every tour and guide is vetted to ensure the highest safety standards for our travelers.",
            },
            {
              title: "Sustainability",
              description: "We promote eco-friendly tours that respect local environments and communities.",
            },
            {
              title: "Inclusion",
              description:
                "Adventures should be accessible to everyone. We offer diverse tour options for all abilities.",
            },
          ].map((value, idx) => (
            <div key={idx} className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-primary"></div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
