import Footer from "../../components/mainComponents/Footer"
import NavBar from "../../components/mainComponents/NavBar"
import PublicHeader from "../../components/mainComponents/PublicHeader"

const role = "user"
const LandingPage = () => {
  return (
    <div>
    <NavBar role={role} />
    <PublicHeader />
    <Footer />
    </div>
  )
}

export default LandingPage