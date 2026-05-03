import { Header } from "./components/layout/header";
import MainSection from "./components/banner_home";
import FoodCategory from "./components/home_body";
import { Footer } from "./components/layout/footer";

export default function Home() {
  return (
<main className="min-h-screen bg-white">
      <Header />
      <MainSection/>
      <FoodCategory/>
      <Footer/>
</main>


  );
}
