export default function TeamSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">Meet Our Team</h2>
          <p className="text-lg text-muted-foreground">
            Passionate adventurers and tech enthusiasts dedicated to making travel accessible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {[
            {
              name: "Sarah Chen",
              role: "Founder & CEO",
              bio: "Travel enthusiast with 10+ years in the tourism industry.",
              image: "assets/about/imgi_61_images.jpg",
            },
            {
              name: "Marcus Johnson",
              role: "CTO",
              bio: "Full-stack developer passionate about building community platforms.",
              image: "assets/about/imgi_38_portrait-young-investor-banker-workplace-260nw-2364566447.jpg",
            },
            {
              name: "Elena Rodriguez",
              role: "Head of Experiences",
              bio: "Expert in curating authentic local tour experiences.",
              image: "assets/about/imgi_44_images.jpg",
            },
          ].map((member, idx) => (
            <div key={idx} className="text-center">
              <img
                src={member.image || "/placeholder.svg"}
                alt={member.name}
                className="w-40 h-40 rounded-full mx-auto mb-6 object-cover shadow-lg"
              />
              <h3 className="text-xl font-semibold text-foreground mb-1">{member.name}</h3>
              <p className="text-primary font-medium mb-3">{member.role}</p>
              <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
