import { Component } from "solid-js";
import { MetaProvider, Title, Link, Meta } from "solid-meta";
import Header from "../components/Header";

const Layout: Component = props => (
  <div id="main" class="relative overflow-auto h-screen">
    <MetaProvider>
      <Title>SMerge</Title>
      <Link rel="canonical" href="https://smerge.pages.dev" />
      <Meta name="description" content="Free subtitle merger tool." />
      <Meta name="keywords" content="SRT, subtitle, subtitle merger" />

      {/* Open Graph */}
      <Meta property="og:title" content="SMerge" />
      <Meta property="og:type" content="website" />
      <Meta property="og:url" content="https://smerge.pages.dev" />
      <Meta property="og:image" content="/src/assets/img_preview.png" />
      <Meta property="og:description" content="Free subtitle merger tool." />

      {/* Twitter */}
      <Meta name="twitter:card" content="Free subtitle merger tool." />
      <Meta name="twitter:site" content="@vineryap" />
      <Meta name="twitter:title" content="SMerge" />
      <Meta name="twitter:description" content="Free subtitle merger tool." />
      <Meta name="twitter:creator" content="@vineryap" />
    </MetaProvider>
    <Header />
    <div class="flex flex-col flex-wrap w-full px-5 items-center">{props.children}</div>
  </div>
);

export default Layout;
