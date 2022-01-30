import { Component } from "solid-js";
import Header from "../components/Header";

const Layout: Component = props => (
  <div id="main" class="relative overflow-auto h-screen">
    <Header />
    <div class="flex flex-col flex-wrap w-full px-5 items-center">{props.children}</div>
  </div>
);

export default Layout;
