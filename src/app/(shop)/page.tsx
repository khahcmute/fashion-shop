import Link from "next/link";
import Banner from "@/components/Banner";
import FeatureHighlights from "@/components/FeatureHighlights";
import HomeCategories from "@/components/HomeCategories";
import HomeProductSection from "@/components/HomeProductSection";
import HomeCTA from "@/components/HomeCTA";

export default function HomePage() {
  return (
    <>
      <Banner />
      <FeatureHighlights />
      <HomeCategories />
      <HomeProductSection />
      <HomeCTA />
    </>
  );
}
