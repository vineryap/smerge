import { Component } from "solid-js";

const Layout: Component = props => (
  <div class="relative overflow-hidden h-screen">
    <div class="flex flex-col flex-wrap h-full w-full px-5 justify-center items-center">
      {props.children}
    </div>
  </div>
);

export default Layout;
