export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">Ready to Start Your Adventure?</h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Explore hundreds of unique tours and activities happening near you right now. Whether you're looking for
            hiking, cultural experiences, food tours, or something completely unique, we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              Explore Tours Now
            </button>
            <button className="px-8 py-4 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
