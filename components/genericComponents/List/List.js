import { Component } from "react";
import { storyblokEditable, StoryblokComponent } from "@storyblok/react";
import Element from "../Element/Element";
import css from "./List.module.scss";

export default class List extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <>
        <section className={css["rich-text-section"]} {...storyblokEditable(this.props.blok)}>
          <h2 className={css["rich-text-section__title"]}>{this.props.blok.title}</h2>
          {this.props.blok.elements && this.props.blok.elements.map((nestedBlok) => (
            <Element blok={nestedBlok} key={nestedBlok._uid} />
          ))}
        </section>
      </>
    );
  }
}
