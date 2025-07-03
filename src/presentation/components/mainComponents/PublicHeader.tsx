import { ArrowRight, Play } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

const PublicHeader = () => {
    const navigate = useNavigate();
  return (
    <section className="w-full py-12 ">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                Plan Your Next Escape
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Explore Unique Experiences Around the World
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                From thrilling adventures to serene agro retreats and vibrant
                cultural tours — Global Explorer lets you discover and book
                unforgettable travel experiences in just a few clicks.
              </p>
            </div>

            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" className="inline-flex items-center gap-2" onClick={() => navigate("/home")}>
                Start Exploring
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="inline-flex items-center gap-2 bg-transparent"
                onClick={() => navigate("/login")}
              >
                <Play className="h-4 w-4" />
                Login
              </Button>
            </div>

            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <span>✓</span>
                <span>Instant booking — no hassle</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>✓</span>
                <span>Handpicked tours & verified hosts</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <img
              src="background/0bfe5acada1433436c816f79f1670ff3.jpg"
              width="500"
              height="500"
              alt="Hero illustration"
              className="mx-auto aspect-square overflow-hidden rounded-xl object-cover shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PublicHeader;
