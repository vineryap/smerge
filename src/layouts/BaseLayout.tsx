import { Component } from "solid-js";

const Layout: Component = props => (
  <div class="relative overflow-hidden h-screen">
    <div class="container mx-auto px-6 md:px-12 relative z-10 flex items-center py-32 xl:py-40">
      {props.children}
    </div>
  </div>
);

export default Layout;
