import AboutHero from "@/presentation/components/about/AboutHero"
import CTASection from "@/presentation/components/about/cta-section"
import MissionSection from "@/presentation/components/about/mission-section"
import TeamSection from "@/presentation/components/about/team-section"
import ValuesSection from "@/presentation/components/about/values-section"

const AboutPage = () => {
  return (
    <main>
        <AboutHero/>
        <MissionSection />
        <ValuesSection />
        <TeamSection />
        <CTASection />
    </main>
  )
}

export default AboutPage